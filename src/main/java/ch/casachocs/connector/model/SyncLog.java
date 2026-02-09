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

    @Column(name = "log_timestamp", nullable = false)
    private LocalDateTime timestamp;

    @Enumerated(EnumType.STRING)
    @Column(name = "log_type", length = 50)
    private LogType type;

    @Column(length = 20)
    private String status;

    @Column(name = "event_id", length = 100)
    private String eventId;

    @Column(name = "event_title", length = 255)
    private String eventTitle;

    // PostgreSQL: utiliser TEXT au lieu de CLOB
    @Column(columnDefinition = "TEXT")
    private String message;

    // Colonne pour stocker le JSON détaillé du webhook
    @Column(name = "json_details", columnDefinition = "TEXT")
    private String jsonDetails;

    @Transient
    public String getDetails() {
        return jsonDetails != null ? jsonDetails : message;
    }

    public void setDetails(String details) {
        this.jsonDetails = details;
    }

    @Column(name = "records_synced")
    @Builder.Default
    private Integer recordsSynced = 0;

    @Column(name = "duration_sec")
    private Double duration;

    @PrePersist
    protected void onCreate() {
        if (timestamp == null) {
            timestamp = LocalDateTime.now();
        }
    }
}