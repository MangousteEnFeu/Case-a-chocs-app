package ch.casachocs.connector.service;

import ch.casachocs.connector.model.Event;
import ch.casachocs.connector.model.SyncLog;
import ch.casachocs.connector.model.enums.EventStatus;
import ch.casachocs.connector.model.enums.LogStatus;
import ch.casachocs.connector.model.enums.LogType;
import ch.casachocs.connector.repository.MockDataRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SyncService {
    private final MockDataRepository repository;
    private final LogService logService;

    public Event syncEvent(String eventId) {
        Event event = repository.getEventById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        try {
            // Simulate network delay
            Thread.sleep(1200);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        // Update Event
        event.setStatus(EventStatus.SYNCED);
        event.setLastSyncAt(LocalDateTime.now());
        if (event.getPetziExternalId() == null) {
            event.setPetziExternalId("petzi-" + ThreadLocalRandom.current().nextInt(1000, 9999));
        }
        repository.updateEvent(event);

        // Add Log
        SyncLog log = SyncLog.builder()
                .id("log-" + UUID.randomUUID().toString().substring(0, 8))
                .timestamp(LocalDateTime.now())
                .type(LogType.SYNC_EVENT)
                .eventId(event.getId())
                .eventTitle(event.getTitle())
                .status(LogStatus.SUCCESS)
                .duration(1.2)
                .details("Manual sync: Event pushed to PETZI successfully.")
                .build();
        
        logService.addLog(log);

        return event;
    }

    public List<Event> syncAllConfirmed() {
        List<Event> confirmedEvents = repository.getAllEvents().stream()
                .filter(e -> e.getStatus() == EventStatus.CONFIRMED)
                .collect(Collectors.toList());
        
        return confirmedEvents.stream()
                .map(e -> syncEvent(e.getId()))
                .collect(Collectors.toList());
    }
}