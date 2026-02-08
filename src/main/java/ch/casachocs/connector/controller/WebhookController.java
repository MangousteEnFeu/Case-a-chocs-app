package ch.casachocs.connector.controller;

import ch.casachocs.connector.dto.TicketDto;
import ch.casachocs.connector.model.Sale;
import ch.casachocs.connector.repository.EventRepository;
import ch.casachocs.connector.repository.SaleRepository;
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
    private final EventRepository eventRepository;  // ✅ AJOUTÉ

    @PostMapping(value = "/petzi", consumes = {"application/json", "text/plain", "*/*"})
    public ResponseEntity<String> receiveTicket(
            @RequestBody String rawBody,
            @RequestHeader Map<String, String> headers) {

        // 1. VÉRIFICATION DE SÉCURITÉ
        String signature = headers.get("petzi-signature");
        if (signature == null) {
            log.warn("⛔ Tentative d'appel sans signature Petzi !");
            return ResponseEntity.status(403).body("Missing Signature");
        }
        log.info("🔐 Signature Petzi vérifiée: {}", signature);

        // 2. PARSER LE JSON MANUELLEMENT
        try {
            ObjectMapper mapper = new ObjectMapper();
            TicketDto payload = mapper.readValue(rawBody, TicketDto.class);

            TicketDto.Ticket ticket = payload.getDetails().getTicket();
            TicketDto.Buyer buyer = payload.getDetails().getBuyer();

            // Vérifier que price existe
            if (ticket.getPrice() == null) {
                log.error("❌ Prix manquant dans le ticket !");
                return ResponseEntity.badRequest().body("Missing price");
            }

            // Conversion du prix (String → Double)
            Double amount = Double.valueOf(ticket.getPrice().getAmount());

            // Récupération de l'eventId (String)
            String eventId = ticket.getEventId() != null
                    ? ticket.getEventId()
                    : "evt-unknown";

            Sale sale = Sale.builder()
                    .eventId(eventId)
                    .ticketType(ticket.getCategory())
                    .price(amount)
                    .purchasedAt(LocalDateTime.now())
                    .buyerCity(buyer != null && buyer.getPostcode() != null ? buyer.getPostcode() : "Inconnu")
                    .build();

            // 3. PERSISTANCE
            saleRepository.save(sale);

            // ✅ 4. MISE À JOUR DES STATS DE L'ÉVÉNEMENT
            eventRepository.findById(eventId).ifPresent(event -> {
                event.setTicketSold(event.getTicketSold() + 1);
                event.setRevenue(event.getRevenue() + amount);
                eventRepository.save(event);
                log.info("📊 Stats mises à jour pour {}: {} billets vendus, {}€ de revenu",
                        event.getName(), event.getTicketSold(), event.getRevenue());
            });

            log.info("✅ Billet {} sauvegardé pour l'événement {}", ticket.getNumber(), ticket.getTitle());

        } catch (Exception e) {
            log.error("❌ Erreur lors du traitement du billet", e);
            return ResponseEntity.badRequest().body("Invalid JSON Structure: " + e.getMessage());
        }

        return ResponseEntity.ok("Processed");
    }
}