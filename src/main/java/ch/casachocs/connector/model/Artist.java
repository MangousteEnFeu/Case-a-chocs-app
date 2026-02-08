package ch.casachocs.connector.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "artists")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Artist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 200, nullable = false)
    private String name;

    @Column(length = 100)
    private String genre;

    // ✅ ENLEVÉ: precision et scale
    @Column(name = "booking_fee")
    private Double bookingFee;
}