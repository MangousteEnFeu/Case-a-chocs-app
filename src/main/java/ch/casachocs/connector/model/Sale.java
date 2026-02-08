package ch.casachocs.connector.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "sales")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Sale {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "event_id", length = 50, nullable = false)
    private String eventId;

    @Column(name = "ticket_type", length = 100)
    private String ticketType;

    // ✅ ENLEVÉ: precision et scale
    private Double price;

    @Column(name = "purchased_at")
    private LocalDateTime purchasedAt;

    @Column(name = "buyer_city", length = 100)
    private String buyerCity;
}