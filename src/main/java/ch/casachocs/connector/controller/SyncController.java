package ch.casachocs.connector.controller;

import ch.casachocs.connector.dto.ApiResponse;
import ch.casachocs.connector.model.Event;
import ch.casachocs.connector.service.SyncService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sync")
@RequiredArgsConstructor
public class SyncController {

    private final SyncService syncService;

    @PostMapping("/event/{id}")
    public ResponseEntity<ApiResponse<Event>> syncEvent(@PathVariable String id) {
        try {
            Event syncedEvent = syncService.syncEvent(id);
            return ResponseEntity.ok(ApiResponse.success(syncedEvent));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/all")
    public ResponseEntity<ApiResponse<List<Event>>> syncAll() {
        return ResponseEntity.ok(ApiResponse.success(syncService.syncAllConfirmed()));
    }
}