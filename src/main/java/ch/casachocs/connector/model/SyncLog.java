package ch.casachocs.connector.model;

import ch.casachocs.connector.model.enums.LogStatus;
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
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SyncLog {
    @Id
    private String id;
    
    private LocalDateTime timestamp;
    
    @Enumerated(EnumType.STRING)
    private LogType type;
    
    @Column(name = "event_id")
    private String eventId;
    
    @Column(name = "event_title")
    private String eventTitle;
    
    @Enumerated(EnumType.STRING)
    private LogStatus status;
    
    private double duration;
    
    @Column(length = 2000)
    private String details;
}