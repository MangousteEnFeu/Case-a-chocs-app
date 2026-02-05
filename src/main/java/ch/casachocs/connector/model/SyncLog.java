package ch.casachocs.connector.model;

import ch.casachocs.connector.model.enums.LogStatus;
import ch.casachocs.connector.model.enums.LogType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SyncLog {
    private String id;
    private LocalDateTime timestamp;
    private LogType type;
    private String eventId;
    private String eventTitle;
    private LogStatus status;
    private double duration;
    private String details;
}