package ch.casachocs.connector.controller;

import ch.casachocs.connector.dto.ApiResponse;
import ch.casachocs.connector.model.SyncLog;
import ch.casachocs.connector.model.enums.LogType;
import ch.casachocs.connector.service.LogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/logs")
@RequiredArgsConstructor
public class LogController {

    private final LogService logService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<SyncLog>>> getAllLogs(@RequestParam(required = false) LogType type) {
        return ResponseEntity.ok(ApiResponse.success(logService.getAllLogs(type)));
    }
}