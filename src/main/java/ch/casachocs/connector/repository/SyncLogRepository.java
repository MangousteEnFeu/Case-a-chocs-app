package ch.casachocs.connector.repository;

import ch.casachocs.connector.model.SyncLog;
import ch.casachocs.connector.model.enums.LogType; // Import nécessaire
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SyncLogRepository extends JpaRepository<SyncLog, Long> {

    List<SyncLog> findByStatus(String status);

    // NOUVEAU
    List<SyncLog> findByType(LogType type);

    List<SyncLog> findByTimestampAfter(LocalDateTime timestamp);

    @Query("SELECT s FROM SyncLog s ORDER BY s.timestamp DESC")
    List<SyncLog> findAllOrderByTimestampDesc();

    @Query("SELECT COUNT(s) FROM SyncLog s WHERE s.status = :status")
    Long countByStatus(String status);
}