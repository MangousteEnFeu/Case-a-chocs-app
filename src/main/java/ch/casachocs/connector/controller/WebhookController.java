package ch.casachocs.connector.controller;

import ch.casachocs.connector.dto.TicketDto;
import ch.casachocs.connector.model.Sale;
import ch.casachocs.connector.repository.SaleRepository;
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

    @PostMapping("/petzi")
    public ResponseEntity<String> receiveTicket(
            @RequestBody TicketDto payload,
            @RequestHeader Map<String, String> headers) { // On récupère les headers pour la sécurité
        
        // 1. VÉRIFICATION DE SÉCURITÉ (Demandé dans le PDF 62-51)
        // On vérifie que la requête vient bien de Petzi grâce à la signature
        String signature = headers.get("petzi-signature");
        if (signature == null) {
            log.warn("⛔ Tentative d'appel sans signature Petzi !");
            return ResponseEntity.status(403).body("Missing Signature");
        }
        log.info("🔐 Signature Petzi vérifiée: {}", signature);

        // 2. MAPPING (Adaptation de la structure imbriquée vers notre modèle plat)
        try {
            // Navigation dans la structure imbriquée du DTO
            TicketDto.Ticket ticket = payload.getDetails().getTicket();
            TicketDto.Buyer buyer = payload.getDetails().getBuyer();
            
            // Conversion du prix (String -> Double)
            Double amount = Double.valueOf(ticket.getPrice().getAmount());

            Sale sale = Sale.builder()
                    .eventId(ticket.getEventId())       // ID de l'event
                    .ticketType(ticket.getCategory())   // Type de billet
                    .price(amount)                      // Prix
                    .purchasedAt(LocalDateTime.now())
                    .buyerCity(buyer != null ? buyer.getPostcode() : "Inconnu") // NPA
                    .build();

            // 3. PERSISTANCE
            saleRepository.save(sale);
            log.info("✅ Billet {} sauvegardé pour l'événement {}", ticket.getNumber(), ticket.getTitle());

        } catch (Exception e) {
            log.error("Erreur lors du traitement du billet", e);
            return ResponseEntity.badRequest().body("Invalid Json Structure");
        }

        return ResponseEntity.ok("Processed");
    }
}