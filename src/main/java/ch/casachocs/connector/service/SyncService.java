package ch.casachocs.connector.service;

import ch.casachocs.connector.model.Event;
import ch.casachocs.connector.model.SyncLog;
import ch.casachocs.connector.model.enums.LogType;
import ch.casachocs.connector.repository.EventRepository;
import ch.casachocs.connector.repository.SyncLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class SyncService {

    private final EventRepository eventRepository;
    private final SyncLogRepository syncLogRepository;

    @Transactional
    public List<Event> syncEventsToPetzi(List<String> eventIds) {
        log.info("Starting sync of {} events to PETZI", eventIds.size());
        List<Event> syncedEvents = new ArrayList<>();

        for (String eventId : eventIds) {
            Event event = eventRepository.findById(eventId).orElse(null);

            if (event == null) {
                log.warn("Event not found: {}", eventId);
                createSyncLog("ERROR", LogType.SYNC_EVENT, eventId, null,
                        "Event not found: " + eventId, 0, 0.0);
                continue;
            }

            if ("DRAFT".equals(event.getStatus())) {
                log.warn("Cannot sync DRAFT event: {}", event.getTitle());
                createSyncLog("ERROR", LogType.SYNC_EVENT, eventId, event.getTitle(),
                        "Cannot sync event in DRAFT status. Please confirm the event first.", 0, 0.5);
                continue;
            }

            if ("SYNCED".equals(event.getStatus())) {
                log.info("Event already synced: {}", event.getTitle());
                syncedEvents.add(event);
                continue;
            }

            long startTime = System.currentTimeMillis();
            try {
                String petziId = "petzi-" + UUID.randomUUID().toString().substring(0, 8);

                event.setStatus("SYNCED");
                event.setPetziExternalId(petziId);
                event.setLastSyncAt(LocalDateTime.now());
                eventRepository.save(event);

                double duration = (System.currentTimeMillis() - startTime) / 1000.0;

                String jsonDetails = String.format(
                        "{\"action\":\"PUSH_TO_PETZI\",\"eventId\":\"%s\",\"petziExternalId\":\"%s\",\"title\":\"%s\",\"venue\":\"%s\",\"date\":\"%s\",\"capacity\":%d,\"pricePresale\":%.2f,\"priceDoor\":%.2f}",
                        event.getId(), petziId, event.getTitle(), event.getVenue(),
                        event.getDate(), event.getCapacity(),
                        event.getPricePresale() != null ? event.getPricePresale() : 0,
                        event.getPriceDoor() != null ? event.getPriceDoor() : 0
                );

                createSyncLog("SUCCESS", LogType.SYNC_EVENT, event.getId(), event.getTitle(),
                        jsonDetails, 1, duration);

                syncedEvents.add(event);
                log.info("Successfully synced event: {} -> {}", event.getTitle(), petziId);

            } catch (Exception e) {
                double duration = (System.currentTimeMillis() - startTime) / 1000.0;
                log.error("Failed to sync event: {}", event.getTitle(), e);
                createSyncLog("ERROR", LogType.ERROR, event.getId(), event.getTitle(),
                        "{\"error\":\"" + e.getMessage() + "\"}", 0, duration);
            }
        }

        return syncedEvents;
    }

    @Transactional
    public List<Event> syncAllConfirmedEvents() {
        List<Event> confirmedEvents = eventRepository.findAll().stream()
                .filter(e -> "CONFIRMED".equals(e.getStatus()))
                .toList();

        if (confirmedEvents.isEmpty()) {
            log.info("No CONFIRMED events to sync");
            createSyncLog("WARNING", LogType.SYSTEM, null, null,
                    "{\"message\":\"No CONFIRMED events found to sync\"}", 0, 0.1);
            return new ArrayList<>();
        }

        List<String> eventIds = confirmedEvents.stream().map(Event::getId).toList();
        return syncEventsToPetzi(eventIds);
    }

    public SyncLog createSyncLog(String status, LogType type, String eventId,
                                 String eventTitle, String message, int recordsSynced, double duration) {
        SyncLog syncLog = SyncLog.builder()
                .timestamp(LocalDateTime.now())
                .status(status)
                .type(type)
                .eventId(eventId)
                .eventTitle(eventTitle)
                .message(message)
                .recordsSynced(recordsSynced)
                .duration(duration)
                .build();

        return syncLogRepository.save(syncLog);
    }

    public void logTicketSale(String eventId, String eventTitle, String ticketType,
                              Double price, String buyerCity) {
        String jsonDetails = String.format(
                "{\"action\":\"TICKET_SOLD\",\"eventId\":\"%s\",\"ticketType\":\"%s\",\"price\":%.2f,\"buyerCity\":\"%s\",\"timestamp\":\"%s\"}",
                eventId, ticketType, price, buyerCity, LocalDateTime.now()
        );

        createSyncLog("SUCCESS", LogType.WEBHOOK, eventId, eventTitle, jsonDetails, 1, 0.05);
    }

    public void logSystemEvent(String status, String message) {
        createSyncLog(status, LogType.SYSTEM, null, null, message, 0, 0.01);
    }

    public List<SyncLog> getAllSyncLogs() {
        return syncLogRepository.findAllOrderByTimestampDesc();
    }

    public List<SyncLog> getSyncLogsByType(LogType type) {
        return syncLogRepository.findAllOrderByTimestampDesc().stream()
                .filter(syncLog -> type.equals(syncLog.getType()))
                .toList();
    }

    public List<SyncLog> getRecentSyncLogs(int limit) {
        return syncLogRepository.findAllOrderByTimestampDesc().stream()
                .limit(limit)
                .toList();
    }
}