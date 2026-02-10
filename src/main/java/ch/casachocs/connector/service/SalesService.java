package ch.casachocs.connector.service;

import ch.casachocs.connector.model.*;
import ch.casachocs.connector.model.enums.LogType;
import ch.casachocs.connector.repository.EventRepository;
import ch.casachocs.connector.repository.SaleRepository;
import ch.casachocs.connector.repository.SyncLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SalesService {

    private final SaleRepository saleRepository;
    private final EventRepository eventRepository;
    private final SyncLogRepository syncLogRepository;

    @Transactional
    public Sale recordSale(String eventId, String ticketType, Double price, String buyerCity) {
        Sale sale = Sale.builder()
                .eventId(eventId)
                .ticketType(ticketType)
                .price(price)
                .purchasedAt(LocalDateTime.now())
                .buyerCity(buyerCity)
                .build();

        sale = saleRepository.save(sale);

        Event event = eventRepository.findById(eventId).orElse(null);
        String eventTitle = "Unknown Event";

        if (event != null) {
            eventTitle = event.getTitle();
            log.info("Sale recorded for event: {}", event.getTitle());
        } else {
            log.warn("Event not found: {}", eventId);
        }

        String jsonDetails = String.format(
                "{\"action\":\"TICKET_PURCHASE\",\"saleId\":\"%s\",\"eventId\":\"%s\",\"eventTitle\":\"%s\",\"ticketType\":\"%s\",\"price\":%.2f,\"currency\":\"CHF\",\"buyerCity\":\"%s\",\"timestamp\":\"%s\"}",
                sale.getId(), eventId, eventTitle, ticketType, price, buyerCity, LocalDateTime.now()
        );

        SyncLog logEntry = SyncLog.builder()
                .timestamp(LocalDateTime.now())
                .status("SUCCESS")
                .type(LogType.WEBHOOK)
                .eventId(eventId)
                .eventTitle(eventTitle)
                .message(jsonDetails)
                .recordsSynced(1)
                .duration(0.05)
                .build();

        syncLogRepository.save(logEntry);

        return sale;
    }

    public List<Sale> getAllSales() {
        return saleRepository.findAll();
    }

    public List<Sale> getSalesByEventId(String eventId) {
        return saleRepository.findByEventId(eventId);
    }

    public Double getTotalRevenueByEventId(String eventId) {
        return saleRepository.sumPriceByEventId(eventId);
    }

    public SalesReport getSalesReport(String eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found: " + eventId));

        List<Sale> sales = saleRepository.findByEventId(eventId);

        int totalSold = sales.size();
        double totalRevenue = sales.stream().mapToDouble(Sale::getPrice).sum();

        Map<String, SalesCategory> catMap = new HashMap<>();
        for (Sale s : sales) {
            String catName = s.getTicketType() != null ? s.getTicketType() : "Standard";
            catMap.putIfAbsent(catName, new SalesCategory(catName, 0, 0.0));
            SalesCategory sc = catMap.get(catName);
            sc.setSold(sc.getSold() + 1);
            sc.setRevenue(sc.getRevenue() + s.getPrice());
        }

        Map<LocalDate, Integer> dayMap = new HashMap<>();
        for (Sale s : sales) {
            if (s.getPurchasedAt() != null) {
                LocalDate date = s.getPurchasedAt().toLocalDate();
                dayMap.merge(date, 1, Integer::sum);
            }
        }
        List<DailySales> dailySales = dayMap.entrySet().stream()
                .map(e -> new DailySales(e.getKey(), e.getValue()))
                .sorted((a, b) -> a.getDate().compareTo(b.getDate()))
                .collect(Collectors.toList());

        Map<String, Integer> cityMap = new HashMap<>();
        for (Sale s : sales) {
            String city = s.getBuyerCity() != null && !s.getBuyerCity().isEmpty() ? s.getBuyerCity() : "Inconnu";
            cityMap.merge(city, 1, Integer::sum);
        }
        List<BuyerLocation> locations = cityMap.entrySet().stream()
                .map(e -> new BuyerLocation(e.getKey(), e.getValue()))
                .sorted((a, b) -> b.getCount() - a.getCount())
                .collect(Collectors.toList());

        return SalesReport.builder()
                .eventId(event.getId())
                .eventTitle(event.getTitle())
                .eventDate(event.getEventDate())
                .venue(event.getVenue())
                .capacity(event.getCapacity())
                .totalSold(totalSold)
                .totalRevenue(totalRevenue)
                .fillRate(event.getCapacity() > 0 ? (double) totalSold / event.getCapacity() * 100 : 0)
                .salesByCategory(new ArrayList<>(catMap.values()))
                .salesByDay(dailySales)
                .buyerLocations(locations)
                .lastUpdated(LocalDateTime.now())
                .build();
    }
    public List<Sale> getRecentSales() {
        return saleRepository.findTop20ByOrderBySaleDateDesc();
    }
}