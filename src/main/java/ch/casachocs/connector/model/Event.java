package ch.casachocs.connector.model;

import ch.casachocs.connector.model.enums.EventStatus;
import ch.casachocs.connector.model.enums.Venue;
import com.fasterxml.jackson.annotation.JsonManagedReference;
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
    
    // Helper to maintain DTO compatibility if needed, 
    // though ideally the frontend should adapt to flattened pricing or we use a DTO mapper.
    // For now, we will leave fields flat to match the Table structure requested.
}