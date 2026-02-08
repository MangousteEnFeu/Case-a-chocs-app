package ch.casachocs.connector.repository;

import ch.casachocs.connector.model.*;
import ch.casachocs.connector.model.enums.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class MockDataRepository implements CommandLineRunner {

    private final EventRepository eventRepository;
    private final SyncLogRepository syncLogRepository;
    private final SaleRepository saleRepository;
    
    private final Random random = new Random();

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        log.info("initializing Mock Data...");
        initEvents();
        initLogs();
        generateSales();
        log.info("Mock Data Initialization Complete.");
    }

    private void initEvents() {
        createAndSaveEvent("evt-2024-001", "SPFDJ", "Raw Techno Night", "Techno",
                LocalDate.of(2024, 6, 15), LocalTime.of(23, 0), Venue.GRANDE_SALLE, 
                "Raw techno energy from Berlin.", "SPFDJ", 25.0, 30.0, 750, EventStatus.SYNCED, "petzi-8832", 
                "https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=800&auto=format&fit=crop");

        createAndSaveEvent("evt-2024-002", "ANTIGONE", "Live Modular Set", "Electro",
                LocalDate.of(2024, 6, 22), LocalTime.of(22, 0), Venue.QKC, 
                "Live modular journey.", "Antigone", 15.0, 20.0, 100, EventStatus.CONFIRMED, null, 
                "https://images.unsplash.com/photo-1514525253440-b393452e8d26?q=80&w=800&auto=format&fit=crop");

        createAndSaveEvent("evt-2024-003", "LOCAL FEST", "Scène Émergente Neuchâteloise", "Rock/Punk",
                LocalDate.of(2024, 6, 29), LocalTime.of(18, 0), Venue.GRANDE_SALLE, 
                "Support your local scene.", "Various", 10.0, 15.0, 750, EventStatus.DRAFT, null, 
                "https://images.unsplash.com/photo-1501612780327-45045538702b?q=80&w=800&auto=format&fit=crop");

        createAndSaveEvent("evt-2024-004", "NUIT JAZZ", "Trio Neuchâtel + Guests", "Jazz",
                LocalDate.of(2024, 7, 5), LocalTime.of(20, 30), Venue.INTERLOPE, 
                "Smooth jazz vibes overlooking the lake.", "Trio Neuch", 20.0, 25.0, 80, EventStatus.CONFIRMED, null, 
                "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=800&auto=format&fit=crop");

        createAndSaveEvent("evt-2024-005", "LOTO ALTERNO", "Drag Bingo Fundraiser", "Event",
                LocalDate.of(2024, 7, 12), LocalTime.of(19, 0), Venue.GRANDE_SALLE, 
                "Support fundraiser event.", "Various", 15.0, 20.0, 400, EventStatus.CONFIRMED, null, 
                "https://images.unsplash.com/photo-1561489401-fc2876ced162?q=80&w=800&auto=format&fit=crop");

        createAndSaveEvent("evt-2024-006", "ABSTRAL COMPOST", "Release Party", "Experimental",
                LocalDate.of(2024, 7, 19), LocalTime.of(21, 0), Venue.QKC, 
                "Album release party.", "Abstral Compost", 12.0, 15.0, 100, EventStatus.DRAFT, null, 
                "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=800&auto=format&fit=crop");
    }

    private void createAndSaveEvent(String id, String title, String subtitle, String genre, LocalDate date, 
                                    LocalTime time, Venue venue, String desc, String artistName, 
                                    double presale, double door, int cap, EventStatus status, String petziId, String img) {
        
        Event event = Event.builder()
                .id(id)
                .title(title)
                .subtitle(subtitle)
                .genre(genre)
                .date(date)
                .timeStart(time)
                .timeDoors(time.minusMinutes(30))
                .venue(venue)
                .description(desc)
                .presalePrice(presale)
                .doorPrice(door)
                .capacity(cap)
                .status(status)
                .petziExternalId(petziId)
                .lastSyncAt(status == EventStatus.SYNCED ? LocalDateTime.now().minusDays(1) : null)
                .imageUrl(img)
                .artists(new ArrayList<>())
                .build();

        Artist artist = Artist.builder()
                .name(artistName)
                .genre(genre)
                .event(event) // Maintain Bidirectional relationship
                .build();
        
        event.getArtists().add(artist);
        
        eventRepository.save(event);
    }

    private void initLogs() {
        syncLogRepository.save(SyncLog.builder()
                .id("log-001")
                .timestamp(LocalDateTime.now().minusMinutes(2))
                .type(LogType.SYSTEM)
                .status(LogStatus.SUCCESS)
                .duration(0.1)
                .details("Connection to HEEDS API established")
                .build());
                
        syncLogRepository.save(SyncLog.builder()
                .id("log-002")
                .timestamp(LocalDateTime.now().minusMinutes(5))
                .type(LogType.FETCH_SALES)
                .eventId("evt-2024-001")
                .eventTitle("SPFDJ")
                .status(LogStatus.SUCCESS)
                .duration(0.8)
                .details("Fetched 523 sales records from PETZI API")
                .build());
                
        syncLogRepository.save(SyncLog.builder()
                .id("log-003")
                .timestamp(LocalDateTime.now().minusHours(2))
                .type(LogType.SYNC_EVENT)
                .eventId("evt-2024-001")
                .eventTitle("SPFDJ")
                .status(LogStatus.SUCCESS)
                .duration(1.2)
                .details("Event SPFDJ synced to PETZI")
                .build());
    }
    
    private void generateSales() {
        List<Event> events = eventRepository.findAll();
        String[] cities = {"Neuchâtel", "La Chaux-de-Fonds", "Bienne", "Yverdon", "Lausanne", "Bern", "Fribourg", "Genève"};
        
        for (Event event : events) {
            // Only generate sales for Confirmed/Synced events
            if (event.getStatus() == EventStatus.DRAFT || event.getStatus() == EventStatus.CANCELLED) continue;
            
            // Random sales count between 10% and 95% of capacity
            int salesCount = random.nextInt((int)(event.getCapacity() * 0.85)) + (int)(event.getCapacity() * 0.1);
            if (event.getId().equals("evt-2024-001")) salesCount = 523; // Fixed for consistent demo
            
            List<Sale> salesBatch = new ArrayList<>();
            LocalDate saleStartDate = event.getDate().minusDays(45);
            
            for (int i = 0; i < salesCount; i++) {
                boolean isPresale = random.nextDouble() > 0.15; // 85% presale
                String type = isPresale ? "Prévente" : "Sur place";
                double price = isPresale ? event.getPresalePrice() : event.getDoorPrice();
                
                // Random purchase date
                long days = event.getDate().toEpochDay() - saleStartDate.toEpochDay();
                LocalDate purchaseDate = saleStartDate.plusDays(random.nextInt((int)days + 1));
                
                // City weighting
                String city = cities[random.nextInt(cities.length)];
                if (random.nextDouble() > 0.6) city = "Neuchâtel"; // Higher weight for local
                
                salesBatch.add(Sale.builder()
                        .eventId(event.getId())
                        .ticketType(type)
                        .price(price)
                        .purchasedAt(purchaseDate.atTime(random.nextInt(23), random.nextInt(59)))
                        .buyerCity(city)
                        .build());
            }
            
            saleRepository.saveAll(salesBatch);
            log.info("Generated {} sales for event {}", salesBatch.size(), event.getTitle());
        }
    }
}