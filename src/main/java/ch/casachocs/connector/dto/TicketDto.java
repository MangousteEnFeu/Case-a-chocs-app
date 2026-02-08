package ch.casachocs.connector.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class TicketDto {
    private String event;
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
        private String number;
        private String type;
        private String title;
        private String category;
        private String event;

        // ✅ SOLUTION : Utiliser directement String et laisser Jackson convertir Integer → String
        @JsonProperty("eventId")
        private String eventId;  // Jackson convertira automatiquement Integer en String

        private String cancellationReason;
        private String generatedAt;
        private Price price;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Price {
        private String amount;
        private String currency;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Buyer {
        private String role;
        private String firstName;
        private String lastName;
        private String postcode;
    }
}