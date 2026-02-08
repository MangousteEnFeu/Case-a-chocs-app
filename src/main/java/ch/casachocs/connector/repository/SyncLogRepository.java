package ch.casachocs.connector.repository;

import ch.casachocs.connector.model.SyncLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SyncLogRepository extends JpaRepository<SyncLog, Long> {

    // Trouver les logs par statut
    List<SyncLog> findByStatus(String status);

    // Trouver les logs après une certaine date
    List<SyncLog> findByTimestampAfter(LocalDateTime timestamp);

    // Trouver les logs les plus récents
    @Query("SELECT s FROM SyncLog s ORDER BY s.timestamp DESC")
    List<SyncLog> findAllOrderByTimestampDesc();

    // Statistiques
    @Query("SELECT COUNT(s) FROM SyncLog s WHERE s.status = :status")
    Long countByStatus(String status);
}