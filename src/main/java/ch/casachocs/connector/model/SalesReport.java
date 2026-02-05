package ch.casachocs.connector.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SalesReport {
    private String eventId;
    private String eventTitle;
    private LocalDate eventDate;
    private String venue;
    private int capacity;
    private int totalSold;
    private double totalRevenue;
    private double fillRate;
    private List<SalesCategory> salesByCategory;
    private List<DailySales> salesByDay;
    private List<BuyerLocation> buyerLocations;
    private LocalDateTime lastUpdated;
}