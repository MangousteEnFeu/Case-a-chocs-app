package ch.casachocs.connector.service;

import ch.casachocs.connector.model.*;
import ch.casachocs.connector.repository.EventRepository;
import ch.casachocs.connector.repository.SaleRepository;
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

    @Transactional
    public void recordSale(String eventId, String ticketType, Double price, String buyerCity) {
        // Create sale
        Sale sale = Sale.builder()
                .eventId(eventId)
                .ticketType(ticketType)
                .price(price)
                .purchasedAt(LocalDateTime.now())
                .buyerCity(buyerCity)
                .build();

        saleRepository.save(sale);

        // Update event statistics
        Event event = eventRepository.findById(eventId).orElse(null);
        if (event != null) {
            event.setTicketSold(event.getTicketSold() + 1);
            event.setRevenue(event.getRevenue() + price);
            eventRepository.save(event);
            log.info("Sale recorded for event: {}", event.getTitle());
        } else {
            log.warn("Event not found: {}", eventId);
        }
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

    // --- NOUVELLE MÉTHODE POUR LE RAPPORT ---
    public SalesReport getSalesReport(String eventId) {
        // 1. Récupérer l'événement
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found: " + eventId));

        // 2. Récupérer toutes les ventes pour cet événement
        List<Sale> sales = saleRepository.findByEventId(eventId);

        // 3. Calculs globaux
        int totalSold = sales.size();
        double totalRevenue = sales.stream().mapToDouble(Sale::getPrice).sum();

        // 4. Agrégation par Catégorie (Ticket Type)
        Map<String, SalesCategory> catMap = new HashMap<>();
        for (Sale s : sales) {
            String catName = s.getTicketType() != null ? s.getTicketType() : "Standard";
            catMap.putIfAbsent(catName, new SalesCategory(catName, 0, 0.0));

            SalesCategory sc = catMap.get(catName);
            sc.setSold(sc.getSold() + 1);
            sc.setRevenue(sc.getRevenue() + s.getPrice());
        }

        // 5. Agrégation par Jour (DailySales)
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

        // 6. Agrégation par Ville (BuyerLocation)
        Map<String, Integer> cityMap = new HashMap<>();
        for (Sale s : sales) {
            String city = s.getBuyerCity() != null && !s.getBuyerCity().isEmpty() ? s.getBuyerCity() : "Inconnu";
            cityMap.merge(city, 1, Integer::sum);
        }
        List<BuyerLocation> locations = cityMap.entrySet().stream()
                .map(e -> new BuyerLocation(e.getKey(), e.getValue()))
                .sorted((a, b) -> b.getCount() - a.getCount()) // Tri descendant (plus grand au plus petit)
                .collect(Collectors.toList());

        // 7. Construction du rapport final
        return SalesReport.builder()
                .eventId(event.getId())
                .eventTitle(event.getTitle())
                .eventDate(event.getDate())
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
}