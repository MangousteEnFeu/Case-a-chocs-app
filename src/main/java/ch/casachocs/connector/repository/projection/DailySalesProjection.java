package ch.casachocs.connector.repository.projection;

import java.time.LocalDate;

public interface DailySalesProjection {
    LocalDate getDate(); // Ensure this matches DB type cast in query
    Long getSold();
}