package ch.casachocs.connector.service;

import ch.casachocs.connector.model.SyncLog;
import ch.casachocs.connector.model.enums.LogType;
import ch.casachocs.connector.repository.MockDataRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LogService {
    private final MockDataRepository repository;

    public List<SyncLog> getAllLogs(LogType typeFilter) {
        List<SyncLog> logs = repository.getAllLogs();
        if (typeFilter != null) {
            return logs.stream()
                    .filter(l -> l.getType() == typeFilter)
                    .collect(Collectors.toList());
        }
        return logs;
    }

    public void addLog(SyncLog log) {
        repository.addLog(log);
    }
}