package ch.casachocs.connector.controller;

import ch.casachocs.connector.model.Sale;
import ch.casachocs.connector.model.SalesReport;
import ch.casachocs.connector.service.SalesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sales")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SalesController {

    private final SalesService salesService;

    @GetMapping
    public ResponseEntity<List<Sale>> getAllSales() {
        return ResponseEntity.ok(salesService.getAllSales());
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<Map<String, Object>> getSalesByEvent(@PathVariable String eventId) {
        List<Sale> sales = salesService.getSalesByEventId(eventId);
        Double revenue = salesService.getTotalRevenueByEventId(eventId);

        Map<String, Object> response = new HashMap<>();
        response.put("sales", sales);
        response.put("totalRevenue", revenue != null ? revenue : 0.0);
        response.put("count", sales.size());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/report/{eventId}")
    public ResponseEntity<SalesReport> getSalesReport(@PathVariable String eventId) {
        SalesReport report = salesService.getSalesReport(eventId);
        return ResponseEntity.ok(report);
    }

    @PostMapping("/record")
    public ResponseEntity<Sale> recordSale(
            @RequestParam String eventId,
            @RequestParam String ticketType,
            @RequestParam Double price,
            @RequestParam String buyerCity) {

        Sale sale = salesService.recordSale(eventId, ticketType, price, buyerCity);
        return ResponseEntity.ok(sale);
    }
}
