package ch.casachocs.connector.service;

import ch.casachocs.connector.model.*;
import ch.casachocs.connector.repository.EventRepository;
import ch.casachocs.connector.repository.SaleRepository;
import ch.casachocs.connector.repository.projection.BuyerLocationProjection;
import ch.casachocs.connector.repository.projection.DailySalesProjection;
import ch.casachocs.connector.repository.projection.SalesCategoryProjection;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SalesService {
    private final SaleRepository saleRepository;
    private final EventRepository eventRepository;

    public SalesReport getSalesReport(String eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        // Fetch Aggregated Data from DB
        long totalSold = saleRepository.countByEventId(eventId);
        Double revenue = saleRepository.sumRevenueByEventId(eventId);
        double totalRevenue = revenue != null ? revenue : 0.0;
        
        double fillRate = event.getCapacity() > 0 
                ? ((double) totalSold / event.getCapacity()) * 100 
                : 0.0;

        List<SalesCategoryProjection> categoryProjections = saleRepository.findSalesByCategory(eventId);
        List<SalesCategory> categories = categoryProjections.stream()
                .map(p -> SalesCategory.builder()
                        .category(p.getCategory())
                        .sold(p.getSold().intValue())
                        .revenue(p.getRevenue())
                        .build())
                .collect(Collectors.toList());

        List<DailySalesProjection> dailyProjections = saleRepository.findSalesByDay(eventId);
        List<DailySales> salesCurve = dailyProjections.stream()
                .map(p -> DailySales.builder()
                        .date(p.getDate())
                        .sold(p.getSold().intValue())
                        .build())
                .collect(Collectors.toList());

        List<BuyerLocationProjection> locProjections = saleRepository.findSalesByCity(eventId);
        List<BuyerLocation> locations = locProjections.stream()
                .map(p -> BuyerLocation.builder()
                        .city(p.getCity())
                        .count(p.getCount().intValue())
                        .build())
                .collect(Collectors.toList());

        return SalesReport.builder()
                .eventId(event.getId())
                .eventTitle(event.getTitle())
                .eventDate(event.getDate())
                .venue(event.getVenue().getDisplayName())
                .capacity(event.getCapacity())
                .totalSold((int) totalSold)
                .totalRevenue(totalRevenue)
                .fillRate(fillRate)
                .salesByCategory(categories)
                .salesByDay(salesCurve)
                .buyerLocations(locations)
                .lastUpdated(LocalDateTime.now())
                .build();
    }
}