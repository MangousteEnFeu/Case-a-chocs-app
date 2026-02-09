package ch.casachocs.connector.controller;

import ch.casachocs.connector.model.Event;
import ch.casachocs.connector.model.SyncLog;
import ch.casachocs.connector.model.enums.LogType;
import ch.casachocs.connector.service.SyncService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sync")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SyncController {

    private final SyncService syncService;

    /**
     * Sync specific events to PETZI
     * Body: { "eventIds": ["evt-001", "evt-002"] }
     */
    @PostMapping("/events")
    public ResponseEntity<List<Event>> syncEvents(@RequestBody Map<String, List<String>> request) {
        List<String> eventIds = request.get("eventIds");
        if (eventIds == null || eventIds.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        List<Event> syncedEvents = syncService.syncEventsToPetzi(eventIds);
        return ResponseEntity.ok(syncedEvents);
    }

    /**
     * Sync ALL confirmed events to PETZI
     */
    @PostMapping("/events/all")
    public ResponseEntity<List<Event>> syncAllConfirmedEvents() {
        List<Event> syncedEvents = syncService.syncAllConfirmedEvents();
        return ResponseEntity.ok(syncedEvents);
    }

    /**
     * Get all sync logs
     */
    @GetMapping("/logs")
    public ResponseEntity<List<SyncLog>> getAllLogs(@RequestParam(required = false) String type) {
        if (type != null && !type.equals("ALL")) {
            try {
                LogType logType = LogType.valueOf(type);
                return ResponseEntity.ok(syncService.getSyncLogsByType(logType));
            } catch (IllegalArgumentException e) {
                // Type invalide, retourne tous les logs
                return ResponseEntity.ok(syncService.getAllSyncLogs());
            }
        }
        return ResponseEntity.ok(syncService.getAllSyncLogs());
    }

    /**
     * Get recent sync logs with limit
     */
    @GetMapping("/logs/recent")
    public ResponseEntity<List<SyncLog>> getRecentLogs(@RequestParam(defaultValue = "20") int limit) {
        return ResponseEntity.ok(syncService.getRecentSyncLogs(limit));
    }
}