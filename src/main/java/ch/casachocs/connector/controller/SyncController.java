package ch.casachocs.connector.controller;

import ch.casachocs.connector.model.SyncLog;
import ch.casachocs.connector.service.SyncService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sync")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SyncController {

    private final SyncService syncService;

    @PostMapping("/events")
    public ResponseEntity<String> syncEvents(@RequestBody List<String> eventIds) {
        String result = syncService.syncEventsToPetzi(eventIds);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/logs")
    public ResponseEntity<List<SyncLog>> getAllLogs() {
        return ResponseEntity.ok(syncService.getAllSyncLogs());
    }

    @GetMapping("/logs/recent")
    public ResponseEntity<List<SyncLog>> getRecentLogs(@RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(syncService.getRecentSyncLogs(limit));
    }
}