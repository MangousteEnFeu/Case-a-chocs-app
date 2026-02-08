package ch.casachocs.connector.repository;

import ch.casachocs.connector.model.Event;
import ch.casachocs.connector.model.Sale;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

@Component
@RequiredArgsConstructor
@Slf4j
public class MockDataRepository {

    private final EventRepository eventRepository;
    private final SaleRepository saleRepository;

    @EventListener(ApplicationReadyEvent.class)
    public void initMockData() {
        log.info("Initializing Mock Data...");

        // Create mock events
        List<Event> events = Arrays.asList(
                Event.builder()
                        .id("evt-2024-001")
                        .name("SPFDJ")
                        .date(LocalDate.of(2024, 6, 15))
                        .ticketSold(0)
                        .revenue(0.0)
                        .build(),
                Event.builder()
                        .id("evt-2024-002")
                        .name("ANTIGONE")
                        .date(LocalDate.of(2024, 7, 20))
                        .ticketSold(0)
                        .revenue(0.0)
                        .build(),
                Event.builder()
                        .id("evt-2024-003")
                        .name("NUIT JAZZ")
                        .date(LocalDate.of(2024, 8, 10))
                        .ticketSold(0)
                        .revenue(0.0)
                        .build(),
                Event.builder()
                        .id("evt-2024-004")
                        .name("LOTO ALTERNO")
                        .date(LocalDate.of(2024, 9, 5))
                        .ticketSold(0)
                        .revenue(0.0)
                        .build()
        );

        eventRepository.saveAll(events);

        // Generate mock sales
        Random random = new Random();
        List<String> ticketTypes = Arrays.asList("Prévente", "Plein tarif", "Étudiant", "Abonné");
        List<String> cities = Arrays.asList("2000", "2300", "2400", "2500", "2800");

        for (Event event : events) {
            int salesCount = 20 + random.nextInt(500);
            double totalRevenue = 0.0;

            for (int i = 0; i < salesCount; i++) {
                double price = 15.0 + (random.nextDouble() * 35.0);
                totalRevenue += price;

                Sale sale = Sale.builder()
                        .eventId(event.getId())
                        .ticketType(ticketTypes.get(random.nextInt(ticketTypes.size())))
                        .price(Math.round(price * 100.0) / 100.0)
                        .purchasedAt(LocalDateTime.now().minusDays(random.nextInt(30)))
                        .buyerCity(cities.get(random.nextInt(cities.size())))
                        .build();

                saleRepository.save(sale);
            }

            event.setTicketSold(salesCount);
            event.setRevenue(Math.round(totalRevenue * 100.0) / 100.0);
            eventRepository.save(event);

            log.info("Generated {} sales for event {}", salesCount, event.getName());
        }

        log.info("Mock Data Initialization Complete.");
    }
}