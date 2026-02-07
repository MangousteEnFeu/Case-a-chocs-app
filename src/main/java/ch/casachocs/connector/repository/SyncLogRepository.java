package ch.casachocs.connector.repository;

import ch.casachocs.connector.model.SyncLog;
import ch.casachocs.connector.model.enums.LogType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SyncLogRepository extends JpaRepository<SyncLog, String> {
    List<SyncLog> findByTypeOrderByTimestampDesc(LogType type);
    List<SyncLog> findAllByOrderByTimestampDesc();
}