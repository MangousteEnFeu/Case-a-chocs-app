package ch.casachocs.connector.model;

import ch.casachocs.connector.model.enums.EventStatus;
import ch.casachocs.connector.model.enums.Venue;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Entity
@Table(name = "events")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Event {
    @Id
    private String id;
    
    private String title;
    private String subtitle;
    private String genre;
    private LocalDate date;
    
    @Column(name = "time_start")
    private LocalTime timeStart;
    
    @Column(name = "time_doors")
    private LocalTime timeDoors;
    
    @Enumerated(EnumType.STRING)
    private Venue venue;
    
    @Column(length = 1000)
    private String description;
    
    private int capacity;
    
    @Enumerated(EnumType.STRING)
    private EventStatus status;
    
    @Column(name = "petzi_external_id")
    private String petziExternalId;
    
    @Column(name = "last_sync_at")
    private LocalDateTime lastSyncAt;
    
    @Column(name = "image_url")
    private String imageUrl;

    // Flattened Pricing
    @Column(name = "presale_price")
    private double presalePrice;

    @Column(name = "door_price")
    private double doorPrice;

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<Artist> artists;
    
    /**
     * Virtual property 'pricing' to match frontend expectations.
     * The frontend expects { pricing: { presale: X, door: Y } }.
     */
    @Transient
    @JsonProperty("pricing")
    public Pricing getPricing() {
        return Pricing.builder()
                .presale(this.presalePrice)
                .door(this.doorPrice)
                .build();
    }
}