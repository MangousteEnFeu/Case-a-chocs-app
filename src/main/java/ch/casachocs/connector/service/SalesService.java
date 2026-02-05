package ch.casachocs.connector.service;

import ch.casachocs.connector.model.*;
import ch.casachocs.connector.repository.MockDataRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SalesService {
    private final MockDataRepository repository;

    public SalesReport getSalesReport(String eventId) {
        Event event = repository.getEventById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        // Determine Fill Rate logic based on event for demo variety
        double fillRatePercentage = eventId.equals("evt-2024-001") ? 0.72 : 0.45;
        if(event.getId().equals("evt-2024-002")) fillRatePercentage = 0.85;

        int totalSold = (int) (event.getCapacity() * fillRatePercentage);
        int presaleSold = (int) (totalSold * 0.9);
        int doorSold = totalSold - presaleSold;

        double presaleRevenue = presaleSold * event.getPricing().getPresale();
        double doorRevenue = doorSold * event.getPricing().getDoor();
        double totalRevenue = presaleRevenue + doorRevenue;

        List<SalesCategory> categories = new ArrayList<>();
        categories.add(new SalesCategory("Prévente", presaleSold, presaleRevenue));
        categories.add(new SalesCategory("Sur place", doorSold, doorRevenue));

        List<DailySales> salesCurve = generateSalesCurve(30, totalSold);

        List<BuyerLocation> locations = new ArrayList<>();
        locations.add(new BuyerLocation("Neuchâtel", (int)(totalSold * 0.45)));
        locations.add(new BuyerLocation("La Chaux-de-Fonds", (int)(totalSold * 0.20)));
        locations.add(new BuyerLocation("Bienne", (int)(totalSold * 0.15)));
        locations.add(new BuyerLocation("Yverdon", (int)(totalSold * 0.10)));
        locations.add(new BuyerLocation("Autres", (int)(totalSold * 0.10)));

        return SalesReport.builder()
                .eventId(event.getId())
                .eventTitle(event.getTitle())
                .eventDate(event.getDate())
                .venue(event.getVenue().getDisplayName())
                .capacity(event.getCapacity())
                .totalSold(totalSold)
                .totalRevenue(totalRevenue)
                .fillRate(fillRatePercentage * 100)
                .salesByCategory(categories)
                .salesByDay(salesCurve)
                .buyerLocations(locations)
                .lastUpdated(LocalDateTime.now())
                .build();
    }

    private List<DailySales> generateSalesCurve(int days, int totalExpected) {
        List<DailySales> data = new ArrayList<>();
        LocalDate now = LocalDate.now();
        
        // Distribution weights logic
        for (int i = days; i >= 0; i--) {
            LocalDate date = now.minusDays(i);
            
            // Non-linear weight: more sales closer to date (simple exponential simulation)
            double normalizedTime = 1.0 - ((double) i / days); // 0.0 (past) to 1.0 (today)
            double weight = Math.pow(normalizedTime, 3); // Cubic growth
            
            // Randomize slightly
            int dailySold = (int) ((totalExpected / (double)days) * weight * 2.5);
            // Ensure we don't negative
            dailySold = Math.max(0, dailySold);
            
            data.add(new DailySales(date, dailySold));
        }
        return data;
    }
}