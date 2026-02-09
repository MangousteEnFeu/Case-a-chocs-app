package ch.casachocs.connector.service;

import ch.casachocs.connector.model.Event;
import ch.casachocs.connector.model.SyncLog;
import ch.casachocs.connector.repository.EventRepository;
import ch.casachocs.connector.repository.SyncLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class SyncService {

    private final EventRepository eventRepository;
    private final SyncLogRepository syncLogRepository;

    @Transactional
    public String syncEventsToPetzi(List<String> eventIds) {
        log.info("Starting sync of {} events to PETZI", eventIds.size());

        int synced = 0;
        StringBuilder message = new StringBuilder();

        for (String eventId : eventIds) {
            Event event = eventRepository.findById(eventId).orElse(null);
            if (event != null) {
                // Simulate sync to PETZI
                log.info("Syncing event: {} - {}", event.getId(), event.getTitle());
                synced++;
                message.append("Synced: ").append(event.getTitle()).append("\n");
            } else {
                log.warn("Event not found: {}", eventId);
                message.append("Not found: ").append(eventId).append("\n");
            }
        }

        // Create sync log
        SyncLog syncLog = SyncLog.builder()
                .timestamp(LocalDateTime.now())
                .status("SUCCESS")
                .message(message.toString())
                .recordsSynced(synced)
                .build();

        syncLogRepository.save(syncLog);

        log.info("Sync completed: {} events synced", synced);
        return "Synced " + synced + " events to PETZI";
    }

    public List<SyncLog> getAllSyncLogs() {
        return syncLogRepository.findAll();
    }

    public List<SyncLog> getRecentSyncLogs(int limit) {
        return syncLogRepository.findAll()
                .stream()
                .sorted((a, b) -> b.getTimestamp().compareTo(a.getTimestamp()))
                .limit(limit)
                .toList();
    }
}