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

    @Column(length = 50)
    private String status;

    @Lob
    @Column(columnDefinition = "CLOB")
    private String message;

    @Column(name = "records_synced")
    @Builder.Default
    private Integer recordsSynced = 0;
}