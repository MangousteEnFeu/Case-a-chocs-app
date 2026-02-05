package ch.casachocs.connector.controller;

import ch.casachocs.connector.dto.ApiResponse;
import ch.casachocs.connector.model.Event;
import ch.casachocs.connector.model.enums.EventStatus;
import ch.casachocs.connector.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {
    
    private final EventService eventService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Event>>> getAllEvents(@RequestParam(required = false) EventStatus status) {
        return ResponseEntity.ok(ApiResponse.success(eventService.getAllEvents(status)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Event>> getEventById(@PathVariable String id) {
        return eventService.getEventById(id)
                .map(event -> ResponseEntity.ok(ApiResponse.success(event)))
                .orElse(ResponseEntity.notFound().build());
    }
}