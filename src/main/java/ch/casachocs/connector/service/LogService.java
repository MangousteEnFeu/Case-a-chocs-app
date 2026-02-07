package ch.casachocs.connector.service;

import ch.casachocs.connector.model.SyncLog;
import ch.casachocs.connector.model.enums.LogType;
import ch.casachocs.connector.repository.SyncLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LogService {
    private final SyncLogRepository repository;

    public List<SyncLog> getAllLogs(LogType typeFilter) {
        if (typeFilter != null) {
            return repository.findByTypeOrderByTimestampDesc(typeFilter);
        }
        return repository.findAllByOrderByTimestampDesc();
    }

    public void addLog(SyncLog log) {
        repository.save(log);
    }
}