package ch.casachocs.connector.controller;

import ch.casachocs.connector.dto.TicketDto;
import ch.casachocs.connector.model.Sale;
import ch.casachocs.connector.repository.SaleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/webhooks")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*") // Important pour accepter les requêtes du script python local ou simulateur
public class WebhookController {

    private final SaleRepository saleRepository;

    /**
     * Endpoint imposé par le cours : Réceptionne une vente Petzi en temps réel.
     * URL à configurer dans le simulateur : http://localhost:8080/api/webhooks/petzi
     */
    @PostMapping("/petzi")
    public ResponseEntity<String> receiveTicket(@RequestBody TicketDto ticketDto) {
        log.info("🔔 Webhook Petzi reçu ! Vente du billet: {}", ticketDto.getId());

        // 1. Transformation du DTO (JSON externe) vers notre Entité (Interne)
        // Utilisation du Builder Lombok généré dans l'entité Sale
        Sale sale = Sale.builder()
                .eventId(ticketDto.getEventId())
                .ticketType(ticketDto.getType())      // Mapping "type" -> "ticketType"
                .price(ticketDto.getPrice())
                .purchasedAt(LocalDateTime.now())     // L'heure de réception = heure de vente
                .buyerCity(ticketDto.getBuyerPostcode()) // On stocke le NPA dans buyerCity pour l'instant
                .build();

        // 2. Persistance (Exigence critique du cours)
        saleRepository.save(sale);

        log.info("✅ Vente sauvegardée en base de données via le connecteur.");

        return ResponseEntity.ok("Ticket received and processed");
    }
}