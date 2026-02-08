package ch.casachocs.connector.controller;

import ch.casachocs.connector.model.SyncLog;
import ch.casachocs.connector.service.LogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/logs")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class LogController {

    private final LogService logService;

    @GetMapping
    public ResponseEntity<List<SyncLog>> getAllLogs() {
        return ResponseEntity.ok(logService.getAllLogs());
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<SyncLog>> getLogsByStatus(@PathVariable String status) {
        return ResponseEntity.ok(logService.getLogsByStatus(status));
    }

    @GetMapping("/recent")
    public ResponseEntity<List<SyncLog>> getRecentLogs(@RequestParam(defaultValue = "24") int hours) {
        return ResponseEntity.ok(logService.getRecentLogs(hours));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getLogStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("total", logService.getAllLogs().size());
        stats.put("success", logService.countLogsByStatus("SUCCESS"));
        stats.put("error", logService.countLogsByStatus("ERROR"));
        stats.put("warning", logService.countLogsByStatus("WARNING"));

        return ResponseEntity.ok(stats);
    }

    @PostMapping
    public ResponseEntity<SyncLog> createLog(
            @RequestParam String status,
            @RequestParam String message,
            @RequestParam(required = false) Integer recordsSynced) {

        SyncLog log = logService.createLog(status, message, recordsSynced);
        return ResponseEntity.ok(log);
    }

    @DeleteMapping("/cleanup")
    public ResponseEntity<String> cleanupOldLogs(@RequestParam(defaultValue = "30") int daysOld) {
        logService.deleteOldLogs(daysOld);
        return ResponseEntity.ok("Old logs deleted successfully");
    }
}