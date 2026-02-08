package ch.casachocs.connector.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class TicketDto {
    private String event;   // "ticket_created", etc.
    private Details details;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Details {
        private Ticket ticket;
        private Buyer buyer;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Ticket {
        private String number;    // ID unique du billet
        private String title;     // Titre de l'événement
        private String category;  // Type (Early bird, etc.)
        private String eventId;   // ID de l'événement
        private Price price;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Price {
        private String amount;   // Attention: Petzi envoie un String "25.00"
        private String currency;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Buyer {
        private String postcode;  // Code postal
        private String role;
    }
}