package ch.casachocs.connector.model;

import ch.casachocs.connector.model.enums.LogType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "sync_logs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SyncLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Mappe la colonne "log_timestamp"
    @Column(name = "log_timestamp", nullable = false)
    private LocalDateTime timestamp;

    // Mappe la colonne "log_type" et convertit l'Enum en String pour la base
    @Enumerated(EnumType.STRING)
    @Column(name = "log_type", length = 50)
    private LogType type;

    // Mappe la colonne "status"
    @Column(length = 20)
    private String status;

    // Mappe la colonne "event_id" (peut être null)
    @Column(name = "event_id", length = 50)
    private String eventId;

    // Mappe la colonne "event_title" (peut être null)
    @Column(name = "event_title", length = 200)
    private String eventTitle;

    // Mappe la colonne "message" (Type CLOB dans Oracle)
    @Lob
    @Column(columnDefinition = "CLOB")
    private String message;

    // "details" n'existe pas en base, on utilise "message" à la place.
    // Cette astuce permet au frontend (qui demande "details") de fonctionner sans erreur.
    @Transient
    public String getDetails() {
        return message;
    }

    public void setDetails(String details) {
        this.message = details;
    }

    // Mappe la colonne "records_synced"
    @Column(name = "records_synced")
    @Builder.Default
    private Integer recordsSynced = 0;

    // Mappe la colonne "duration_sec"
    @Column(name = "duration_sec")
    private Double duration;

    @PrePersist
    protected void onCreate() {
        if (timestamp == null) {
            timestamp = LocalDateTime.now();
        }
    }
}