package ch.casachocs.connector.controller;

import ch.casachocs.connector.model.Sale;
import ch.casachocs.connector.model.SyncLog;
import ch.casachocs.connector.model.Event;
import ch.casachocs.connector.model.enums.LogType;
import ch.casachocs.connector.repository.EventRepository;
import ch.casachocs.connector.repository.SaleRepository;
import ch.casachocs.connector.repository.SyncLogRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping(value = "/petzi", consumes = {"application/json", "text/plain", "*/*"})
    public ResponseEntity<String> receiveTicket(
            @RequestBody String rawBody,
            @RequestHeader Map<String, String> headers) {

        long startTime = System.currentTimeMillis();

        String signature = headers.get("petzi-signature");
        if (signature == null) {
            log.warn("Tentative d'appel sans signature Petzi !");
            logWebhook("ERROR", null, null, "Missing Petzi-Signature header", rawBody, 0.0);
            return ResponseEntity.status(403).body("Missing Signature");
        }

        log.info("Webhook PETZI recu avec signature: {}", signature);

        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> payload = objectMapper.readValue(rawBody, Map.class);

            String eventId = (String) payload.get("eventId");
            String ticketType = (String) payload.getOrDefault("ticketType", "Standard");
            Double price = payload.get("price") != null ? ((Number) payload.get("price")).doubleValue() : 25.0;
            String buyerCity = (String) payload.getOrDefault("buyerCity", "Unknown");

            Event event = eventRepository.findById(eventId).orElse(null);
            String eventTitle = event != null ? event.getTitle() : "Unknown Event";

            Sale sale = Sale.builder()
                    .eventId(eventId)
                    .ticketType(ticketType)
                    .price(price)
                    .purchasedAt(LocalDateTime.now())
                    .buyerCity(buyerCity)
                    .build();

            saleRepository.save(sale);

            double duration = (System.currentTimeMillis() - startTime) / 1000.0;

            String jsonDetails = String.format(
                    "{\"action\":\"WEBHOOK_RECEIVED\",\"saleId\":\"%s\",\"eventId\":\"%s\",\"ticketType\":\"%s\",\"price\":%.2f,\"buyerCity\":\"%s\"}",
                    sale.getId(), eventId, ticketType, price, buyerCity
            );

            logWebhook("SUCCESS", eventId, eventTitle, jsonDetails, null, duration);

            log.info("Vente enregistree: {} pour {}", sale.getId(), eventTitle);
            return ResponseEntity.ok("Ticket received");

        } catch (Exception e) {
            double duration = (System.currentTimeMillis() - startTime) / 1000.0;
            log.error("Erreur webhook PETZI: {}", e.getMessage());
            logWebhook("ERROR", null, null, "{\"error\":\"" + e.getMessage() + "\"}", rawBody, duration);
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

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
}