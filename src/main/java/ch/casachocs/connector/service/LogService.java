package ch.casachocs.connector.service;

import ch.casachocs.connector.model.SyncLog;
import ch.casachocs.connector.repository.SyncLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class LogService {

    private final SyncLogRepository syncLogRepository;

    public List<SyncLog> getAllLogs() {
        return syncLogRepository.findAllOrderByTimestampDesc();
    }

    public List<SyncLog> getLogsByStatus(String status) {
        return syncLogRepository.findByStatus(status);
    }

    public List<SyncLog> getRecentLogs(int hours) {
        LocalDateTime since = LocalDateTime.now().minusHours(hours);
        return syncLogRepository.findByTimestampAfter(since);
    }

    public SyncLog createLog(String status, String message, Integer recordsSynced) {
        SyncLog log = SyncLog.builder()
                .timestamp(LocalDateTime.now())
                .status(status)
                .message(message)
                .recordsSynced(recordsSynced != null ? recordsSynced : 0)
                .build();

        return syncLogRepository.save(log);
    }

    public Long countLogsByStatus(String status) {
        return syncLogRepository.countByStatus(status);
    }

    public void deleteOldLogs(int daysOld) {
        LocalDateTime cutoff = LocalDateTime.now().minusDays(daysOld);
        List<SyncLog> oldLogs = syncLogRepository.findByTimestampAfter(cutoff);
        syncLogRepository.deleteAll(oldLogs);
        log.info("Deleted {} old logs", oldLogs.size());
    }
}