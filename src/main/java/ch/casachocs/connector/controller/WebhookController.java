package ch.casachocs.connector.controller;

import ch.casachocs.connector.model.Sale;
import ch.casachocs.connector.model.SyncLog;
import ch.casachocs.connector.model.Event;
import ch.casachocs.connector.model.enums.LogType;
import ch.casachocs.connector.repository.EventRepository;
import ch.casachocs.connector.repository.SaleRepository;
import ch.casachocs.connector.repository.SyncLogRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/webhooks")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class WebhookController {

    private final SaleRepository saleRepository;
    private final EventRepository eventRepository;
    private final SyncLogRepository syncLogRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    // Secret partagé avec PETZI - configurable via application.properties
    @Value("${petzi.webhook.secret:AEeyJhbGciOiJIUzUxMiIsImlzcyI6}")
    private String webhookSecret;

    // Tolérance de temps pour les requêtes (en secondes)
    private static final int TIMESTAMP_TOLERANCE_SECONDS = 300; // 5 minutes

    /**
     * Endpoint principal pour recevoir les webhooks PETZI
     * Format attendu: voir documentation PETZI
     */
    @PostMapping(value = "/petzi", consumes = {"application/json", "text/plain", "*/*"})
    public ResponseEntity<String> receivePetziWebhook(
            @RequestBody String rawBody,
            @RequestHeader Map<String, String> headers) {

        long startTime = System.currentTimeMillis();
        String signature = headers.get("petzi-signature");
        String petziVersion = headers.get("petzi-version");

        log.info("=== WEBHOOK PETZI REÇU ===");
        log.info("Petzi-Version: {}", petziVersion);
        log.info("Body length: {} bytes", rawBody.length());

        // 1. Vérifier la présence de la signature
        if (signature == null || signature.isEmpty()) {
            log.warn("❌ Requête sans signature Petzi-Signature");
            logWebhook("ERROR", null, null,
                    "{\"error\":\"MISSING_SIGNATURE\",\"message\":\"Header Petzi-Signature manquant\"}",
                    rawBody, 0.0);
            return ResponseEntity.status(403).body("Missing Petzi-Signature header");
        }

        // 2. Vérifier la signature HMAC
        SignatureValidationResult validationResult = validateSignature(signature, rawBody);
        if (!validationResult.isValid()) {
            log.warn("❌ Signature invalide: {}", validationResult.getErrorMessage());
            logWebhook("ERROR", null, null,
                    String.format("{\"error\":\"INVALID_SIGNATURE\",\"message\":\"%s\"}", validationResult.getErrorMessage()),
                    rawBody, 0.0);
            return ResponseEntity.status(403).body("Invalid signature: " + validationResult.getErrorMessage());
        }

        log.info("✅ Signature HMAC validée");

        // 3. Parser et traiter le payload PETZI
        try {
            JsonNode payload = objectMapper.readTree(rawBody);
            String eventType = payload.path("event").asText();

            log.info("Event type: {}", eventType);

            // Gérer les différents types d'événements
            if ("ticket_created".equals(eventType) || "ticket_updated".equals(eventType)) {
                return processTicketEvent(payload, rawBody, startTime);
            } else if ("webhook_test".equals(eventType)) {
                log.info("🧪 Requête de test PETZI reçue");
                logWebhook("SUCCESS", null, "WEBHOOK_TEST",
                        "{\"action\":\"WEBHOOK_TEST\",\"message\":\"Test request received successfully\"}",
                        rawBody, (System.currentTimeMillis() - startTime) / 1000.0);
                return ResponseEntity.ok("Test webhook received");
            } else {
                log.warn("Type d'événement inconnu: {}", eventType);
                logWebhook("WARNING", null, null,
                        String.format("{\"warning\":\"UNKNOWN_EVENT_TYPE\",\"eventType\":\"%s\"}", eventType),
                        rawBody, (System.currentTimeMillis() - startTime) / 1000.0);
                return ResponseEntity.ok("Unknown event type: " + eventType);
            }

        } catch (Exception e) {
            double duration = (System.currentTimeMillis() - startTime) / 1000.0;
            log.error("❌ Erreur de traitement du webhook: {}", e.getMessage(), e);
            logWebhook("ERROR", null, null,
                    String.format("{\"error\":\"PROCESSING_ERROR\",\"message\":\"%s\"}", escapeJson(e.getMessage())),
                    rawBody, duration);
            return ResponseEntity.status(500).body("Processing error: " + e.getMessage());
        }
    }

    /**
     * Traite un événement de type ticket_created ou ticket_updated
     */
    private ResponseEntity<String> processTicketEvent(JsonNode payload, String rawBody, long startTime) {
        JsonNode details = payload.path("details");
        JsonNode ticket = details.path("ticket");
        JsonNode buyer = details.path("buyer");

        // Extraire les informations du ticket
        String ticketNumber = ticket.path("number").asText();
        String ticketType = ticket.path("type").asText();
        String ticketCategory = ticket.path("category").asText();
        String eventName = ticket.path("event").asText();
        int petziEventId = ticket.path("eventId").asInt(0);

        // Prix
        JsonNode priceNode = ticket.path("price");
        double price = 0.0;
        String currency = "CHF";
        if (!priceNode.isMissingNode()) {
            try {
                price = Double.parseDouble(priceNode.path("amount").asText("0.00"));
                currency = priceNode.path("currency").asText("CHF");
            } catch (NumberFormatException e) {
                log.warn("Impossible de parser le prix: {}", priceNode);
            }
        }

        // Informations acheteur
        String buyerFirstName = buyer.path("firstName").asText("");
        String buyerLastName = buyer.path("lastName").asText("");
        String buyerPostcode = buyer.path("postcode").asText("");
        String buyerRole = buyer.path("role").asText("unknown");

        // Session info (première session)
        String sessionCity = "";
        JsonNode sessions = ticket.path("sessions");
        if (sessions.isArray() && sessions.size() > 0) {
            JsonNode firstSession = sessions.get(0);
            JsonNode location = firstSession.path("location");
            sessionCity = location.path("city").asText("");
        }

        // Utiliser le postcode de l'acheteur ou la ville de la session
        String buyerLocation = !buyerPostcode.isEmpty() ? buyerPostcode : sessionCity;

        log.info("📨 Ticket reçu: {} | Event: {} | Prix: {} {} | Acheteur: {} {} ({})",
                ticketNumber, eventName, price, currency, buyerFirstName, buyerLastName, buyerLocation);

        // Trouver ou créer l'événement correspondant dans notre DB
        String internalEventId = findOrCreateEvent(petziEventId, eventName, ticket);
        Event event = eventRepository.findById(internalEventId).orElse(null);
        String eventTitle = event != null ? event.getTitle() : eventName;

        // Créer et sauvegarder la vente
        Sale sale = Sale.builder()
                .eventId(internalEventId != null ? internalEventId : "petzi-" + petziEventId)
                .ticketType(ticketCategory)
                .price(price)
                .purchasedAt(LocalDateTime.now())
                .buyerCity(buyerLocation)
                .build();

        sale = saleRepository.save(sale);

        double duration = (System.currentTimeMillis() - startTime) / 1000.0;

        // Créer le JSON détaillé pour le log (inclut le payload complet)
        String jsonDetails = String.format(
                "{\"action\":\"TICKET_RECEIVED\",\"ticketNumber\":\"%s\",\"petziEventId\":%d,\"eventName\":\"%s\",\"internalEventId\":\"%s\",\"category\":\"%s\",\"price\":{\"amount\":%.2f,\"currency\":\"%s\"},\"buyer\":{\"firstName\":\"%s\",\"lastName\":\"%s\",\"postcode\":\"%s\",\"role\":\"%s\"},\"saleId\":\"%s\",\"rawPayload\":%s}",
                ticketNumber,
                petziEventId,
                escapeJson(eventName),
                internalEventId != null ? internalEventId : "UNKNOWN",
                escapeJson(ticketCategory),
                price,
                currency,
                escapeJson(buyerFirstName),
                escapeJson(buyerLastName),
                buyerPostcode,
                buyerRole,
                sale.getId(),
                rawBody
        );

        logWebhook("SUCCESS", internalEventId, eventTitle, jsonDetails, null, duration);

        log.info("✅ Vente enregistrée: {} pour {} (durée: {}s)", sale.getId(), eventTitle, duration);
        return ResponseEntity.ok("Ticket received: " + ticketNumber);
    }

    /**
     * Valide la signature HMAC du webhook PETZI
     * Format: t=timestamp,v1=signature
     */
    private SignatureValidationResult validateSignature(String signatureHeader, String body) {
        try {
            // Parser le header: t=1679476923,v1=7ed1d9929bcd41e2...
            String timestamp = null;
            String providedSignature = null;

            for (String part : signatureHeader.split(",")) {
                String[] keyValue = part.split("=", 2);
                if (keyValue.length == 2) {
                    if ("t".equals(keyValue[0])) {
                        timestamp = keyValue[1];
                    } else if ("v1".equals(keyValue[0])) {
                        providedSignature = keyValue[1];
                    }
                }
            }

            if (timestamp == null || providedSignature == null) {
                return SignatureValidationResult.invalid("Format de signature invalide");
            }

            // Vérifier que le timestamp n'est pas trop vieux (protection replay attack)
            long timestampSeconds = Long.parseLong(timestamp);
            long nowSeconds = Instant.now().getEpochSecond();
            long timeDelta = Math.abs(nowSeconds - timestampSeconds);

            if (timeDelta > TIMESTAMP_TOLERANCE_SECONDS) {
                return SignatureValidationResult.invalid(
                        String.format("Timestamp trop ancien (%d secondes de différence)", timeDelta));
            }

            // Calculer la signature attendue: HMAC-SHA256(secret, "timestamp.body")
            String bodyToSign = timestamp + "." + body;
            String expectedSignature = computeHmacSha256(webhookSecret, bodyToSign);

            // Comparaison en temps constant pour éviter les timing attacks
            if (MessageDigest.isEqual(expectedSignature.getBytes(), providedSignature.getBytes())) {
                return SignatureValidationResult.valid();
            } else {
                log.debug("Signature mismatch - Expected: {}, Provided: {}", expectedSignature, providedSignature);
                return SignatureValidationResult.invalid("Signature ne correspond pas");
            }

        } catch (Exception e) {
            log.error("Erreur lors de la validation de la signature", e);
            return SignatureValidationResult.invalid("Erreur de validation: " + e.getMessage());
        }
    }

    /**
     * Calcule un HMAC-SHA256
     */
    private String computeHmacSha256(String secret, String data) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKeySpec = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        mac.init(secretKeySpec);
        byte[] hash = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));

        // Convertir en hex
        StringBuilder hexString = new StringBuilder();
        for (byte b : hash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) hexString.append('0');
            hexString.append(hex);
        }
        return hexString.toString();
    }

    /**
     * Trouve ou crée l'événement à partir de l'ID PETZI
     * Si l'événement n'existe pas, il est créé automatiquement
     */
    private String findOrCreateEvent(int petziEventId, String eventName, JsonNode ticketNode) {
        // D'abord chercher par petziExternalId
        String petziExternalId = "petzi-" + petziEventId;

        for (Event event : eventRepository.findAll()) {
            if (petziExternalId.equals(event.getPetziExternalId())) {
                return event.getId();
            }
            // Chercher aussi par titre (fallback)
            if (event.getTitle() != null && event.getTitle().equalsIgnoreCase(eventName)) {
                return event.getId();
            }
        }

        // L'événement n'existe pas, on le crée
        log.info("🆕 Création automatique de l'événement PETZI: {} (ID: {})", eventName, petziEventId);

        Event newEvent = new Event();
        newEvent.setId(petziExternalId); // Utiliser l'ID PETZI comme ID interne
        newEvent.setTitle(eventName);
        newEvent.setPetziExternalId(petziExternalId);
        newEvent.setStatus("CONFIRMED");
        newEvent.setVenue("Case à Chocs");

        // Extraire les infos de la session si disponible
        JsonNode sessions = ticketNode.path("sessions");
        if (sessions.isArray() && sessions.size() > 0) {
            JsonNode firstSession = sessions.get(0);
            String dateStr = firstSession.path("date").asText();
            if (!dateStr.isEmpty()) {
                try {
                    newEvent.setEventDate(java.time.LocalDate.parse(dateStr));
                } catch (Exception e) {
                    log.warn("Impossible de parser la date: {}", dateStr);
                    newEvent.setEventDate(java.time.LocalDate.now());
                }
            }
            newEvent.setTimeStart(firstSession.path("time").asText("20:00:00"));
            newEvent.setTimeDoors(firstSession.path("doors").asText("19:00:00"));
        } else {
            newEvent.setEventDate(java.time.LocalDate.now());
        }

        // Prix
        JsonNode priceNode = ticketNode.path("price");
        if (!priceNode.isMissingNode()) {
            try {
                double price = Double.parseDouble(priceNode.path("amount").asText("0.00"));
                newEvent.setPricePresale(price);
            } catch (NumberFormatException ignored) {}
        }

        newEvent.setCreatedAt(java.time.LocalDateTime.now());
        newEvent.setLastSyncAt(java.time.LocalDateTime.now());

        eventRepository.save(newEvent);
        log.info("✅ Événement créé: {}", newEvent.getId());

        return newEvent.getId();
    }

    /**
     * Enregistre un log de webhook
     */
    private void logWebhook(String status, String eventId, String eventTitle, String message, String rawBody, double duration) {
        SyncLog logEntry = SyncLog.builder()
                .timestamp(LocalDateTime.now())
                .status(status)
                .type(LogType.WEBHOOK)
                .eventId(eventId)
                .eventTitle(eventTitle)
                .message(message)
                .recordsSynced("SUCCESS".equals(status) ? 1 : 0)
                .duration(duration)
                .build();
        syncLogRepository.save(logEntry);
    }

    /**
     * Échappe les caractères spéciaux pour JSON
     */
    private String escapeJson(String input) {
        if (input == null) return "";
        return input.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }

    /**
     * Classe helper pour le résultat de validation de signature
     */
    private static class SignatureValidationResult {
        private final boolean valid;
        private final String errorMessage;

        private SignatureValidationResult(boolean valid, String errorMessage) {
            this.valid = valid;
            this.errorMessage = errorMessage;
        }

        public static SignatureValidationResult valid() {
            return new SignatureValidationResult(true, null);
        }

        public static SignatureValidationResult invalid(String errorMessage) {
            return new SignatureValidationResult(false, errorMessage);
        }

        public boolean isValid() {
            return valid;
        }

        public String getErrorMessage() {
            return errorMessage;
        }
    }
}