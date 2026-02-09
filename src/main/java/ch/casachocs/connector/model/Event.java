package ch.casachocs.connector.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "events")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Event {

    @Id
    @Column(length = 50)
    private String id;

    @Column(length = 200, nullable = false)
    private String title;

    @Column(length = 200)
    private String subtitle;

    @Column(length = 100)
    private String genre;

    @Column(name = "artist_id", length = 50)
    private String artistId;

    @Column(name = "event_date", nullable = false)
    private LocalDate eventDate;

    @Column(name = "time_start", length = 10)
    private String timeStart;

    @Column(name = "time_doors", length = 10)
    private String timeDoors;

    @Column(length = 100, nullable = false)
    @Builder.Default
    private String venue = "Grande Salle";

    @Column(columnDefinition = "TEXT")
    private String description;

    @Builder.Default
    private Integer capacity = 750;

    @Column(name = "price_presale")
    private Double pricePresale;

    @Column(name = "price_door")
    private Double priceDoor;

    @Column(length = 20)
    @Builder.Default
    private String status = "DRAFT";

    @Column(name = "petzi_external_id", length = 100)
    private String petziExternalId;

    @Column(name = "last_sync_at")
    private LocalDateTime lastSyncAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Transient
    @Builder.Default
    private Integer ticketSold = 0;

    @Transient
    @Builder.Default
    private Double revenue = 0.0;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    // Alias getters/setters
    public LocalDate getDate() { return eventDate; }
    public void setDate(LocalDate d) { this.eventDate = d; }
    public String getName() { return title; }

    // Builder alias
    public static class EventBuilder {
        public EventBuilder date(LocalDate d) { this.eventDate = d; return this; }
    }
}