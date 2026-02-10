package ch.casachocs.connector.controller;

import ch.casachocs.connector.model.Event;
import ch.casachocs.connector.model.SyncLog;
import ch.casachocs.connector.repository.SyncLogRepository;
import ch.casachocs.connector.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ch.casachocs.connector.model.enums.LogType;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EventController {

    private final EventService eventService;
    private final SyncLogRepository syncLogRepository;

    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents(@RequestParam(required = false) String status) {
        if (status != null && !status.equals("ALL")) {
            return ResponseEntity.ok(eventService.getEventsByStatus(status));
        }
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable String id) {
        return eventService.getEventById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<Event>> getUpcomingEvents() {
        return ResponseEntity.ok(eventService.getUpcomingEvents());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Event>> searchEvents(@RequestParam String name) {
        return ResponseEntity.ok(eventService.searchEventsByName(name));
    }

    @PostMapping
    public ResponseEntity<Event> createEvent(@RequestBody Map<String, Object> eventData) {
        Event event = eventService.createEventFromMap(eventData);
        
        // Log the creation
        String jsonDetails = String.format(
            "{\"action\":\"EVENT_CREATED\",\"eventId\":\"%s\",\"title\":\"%s\",\"venue\":\"%s\",\"date\":\"%s\",\"status\":\"%s\",\"createdAt\":\"%s\"}",
            event.getId(), event.getTitle(), event.getVenue(), event.getDate(), event.getStatus(), LocalDateTime.now()
        );
        
        SyncLog log = SyncLog.builder()
            .timestamp(LocalDateTime.now())
            .status("SUCCESS")
            .type(LogType.SYSTEM)
            .eventId(event.getId())
            .eventTitle(event.getTitle())
            .message(jsonDetails)
            .recordsSynced(1)
            .duration(0.1)
            .build();
        syncLogRepository.save(log);
        
        return ResponseEntity.ok(event);
    }

    /**
     * Met à jour un événement existant
     */
    @PutMapping("/{id}")
    public ResponseEntity<Event> updateEvent(@PathVariable String id, @RequestBody Map<String, Object> eventData) {
        Event event = eventService.updateEventFromMap(id, eventData);

        // Log the update
        String jsonDetails = String.format(
                "{\"action\":\"EVENT_UPDATED\",\"eventId\":\"%s\",\"title\":\"%s\",\"changes\":\"updated\",\"updatedAt\":\"%s\"}",
                event.getId(), event.getTitle(), LocalDateTime.now()
        );

        SyncLog log = SyncLog.builder()
                .timestamp(LocalDateTime.now())
                .status("SUCCESS")
                .type(LogType.SYSTEM)
                .eventId(event.getId())
                .eventTitle(event.getTitle())
                .message(jsonDetails)
                .recordsSynced(1)
                .duration(0.1)
                .build();
        syncLogRepository.save(log);

        return ResponseEntity.ok(event);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable String id) {
        Event event = eventService.getEventById(id).orElse(null);
        String eventTitle = event != null ? event.getTitle() : "Unknown";
        
        eventService.deleteEvent(id);
        
        // Log the deletion
        String jsonDetails = String.format(
            "{\"action\":\"EVENT_DELETED\",\"eventId\":\"%s\",\"title\":\"%s\",\"deletedAt\":\"%s\"}",
            id, eventTitle, LocalDateTime.now()
        );
        
        SyncLog log = SyncLog.builder()
            .timestamp(LocalDateTime.now())
            .status("WARNING")
            .type(LogType.SYSTEM)
            .eventId(id)
            .eventTitle(eventTitle)
            .message(jsonDetails)
            .recordsSynced(0)
            .duration(0.1)
            .build();
        syncLogRepository.save(log);
        
        return ResponseEntity.noContent().build();
    }

}
