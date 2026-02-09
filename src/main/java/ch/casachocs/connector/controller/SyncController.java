package ch.casachocs.connector.controller;

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
}