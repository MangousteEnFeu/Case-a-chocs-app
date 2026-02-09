package ch.casachocs.connector.model;

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

    @Column(name = "log_timestamp")
    private LocalDateTime timestamp;

    @Column(name = "log_type", length = 50)
    private String type;

    @Column(name = "event_id", length = 50)
    private String eventId;

    @Column(name = "event_title", length = 200)
    private String eventTitle;

    @Column(length = 20)
    private String status;

    @Column(name = "duration_sec")
    private Double duration;

    @Lob
    @Column(columnDefinition = "CLOB")
    private String message;

    @Column(name = "records_synced")
    @Builder.Default
    private Integer recordsSynced = 0;

    // Alias pour compatibilite avec le frontend qui attend "details"
    public String getDetails() {
        return message;
    }

    public void setDetails(String details) {
        this.message = details;
    }

    @PrePersist
    protected void onCreate() {
        if (timestamp == null) {
            timestamp = LocalDateTime.now();
        }
    }
}