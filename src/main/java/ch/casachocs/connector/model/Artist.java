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
    @Column(name = "id", length = 50)
    private String id;

    @Column(length = 200, nullable = false)
    private String name;

    @Column(length = 100)
    private String genre;

    @Column(length = 50)
    private String country;

    @Column(name = "booking_fee")
    private Double bookingFee;
}