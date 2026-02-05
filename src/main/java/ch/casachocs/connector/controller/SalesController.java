package ch.casachocs.connector.controller;

import ch.casachocs.connector.dto.ApiResponse;
import ch.casachocs.connector.model.SalesReport;
import ch.casachocs.connector.service.SalesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/sales")
@RequiredArgsConstructor
public class SalesController {

    private final SalesService salesService;

    @GetMapping("/{eventId}")
    public ResponseEntity<ApiResponse<SalesReport>> getSalesReport(@PathVariable String eventId) {
        try {
            return ResponseEntity.ok(ApiResponse.success(salesService.getSalesReport(eventId)));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}