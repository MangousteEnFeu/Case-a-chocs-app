package ch.casachocs.connector.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class HealthStatus {
    private String status;
    private boolean heedsConnection;
    private boolean petziConnection;
    private int latency;
}