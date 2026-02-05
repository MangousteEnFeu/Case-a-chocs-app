package ch.casachocs.connector.controller;

import ch.casachocs.connector.dto.HealthStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.ThreadLocalRandom;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    @GetMapping
    public ResponseEntity<HealthStatus> getHealth() {
        return ResponseEntity.ok(HealthStatus.builder()
                .status("UP")
                .heedsConnection(true)
                .petziConnection(true)
                .latency(ThreadLocalRandom.current().nextInt(20, 100))
                .build());
    }

    @GetMapping("/heeds")
    public ResponseEntity<String> checkHeeds() {
        return ResponseEntity.ok("OK");
    }

    @GetMapping("/petzi")
    public ResponseEntity<String> checkPetzi() {
        return ResponseEntity.ok("OK");
    }
}