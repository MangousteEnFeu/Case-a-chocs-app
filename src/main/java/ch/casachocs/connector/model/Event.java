package ch.casachocs.connector.model;

import ch.casachocs.connector.model.enums.EventStatus;
import ch.casachocs.connector.model.enums.Venue;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Event {
    private String id;
    private String title;
    private String subtitle;
    private String genre;
    private LocalDate date;
    private LocalTime timeStart;
    private LocalTime timeDoors;
    private Venue venue;
    private String description;
    private List<Artist> artists;
    private Pricing pricing;
    private int capacity;
    private EventStatus status;
    private String petziExternalId;
    private LocalDateTime lastSyncAt;
    private String imageUrl;
}