package ch.casachocs.connector.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TicketDto {
    // Ces champs correspondent au JSON envoyé par le simulateur Petzi
    private String id;          // ID unique du billet
    private String eventId;     // ID de l'événement
    private String type;        // "Early Bird", "Regular", etc.
    private Double price;       // Montant de la vente
    private String buyerPostcode; // Code postal
}