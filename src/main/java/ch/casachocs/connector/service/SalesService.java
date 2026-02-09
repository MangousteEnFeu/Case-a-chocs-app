package ch.casachocs.connector.service;

import ch.casachocs.connector.model.Event;
import ch.casachocs.connector.model.Sale;
import ch.casachocs.connector.repository.EventRepository;
import ch.casachocs.connector.repository.SaleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

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
}