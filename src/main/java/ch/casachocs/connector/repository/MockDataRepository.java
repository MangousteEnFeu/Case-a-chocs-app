package ch.casachocs.connector.repository;

import ch.casachocs.connector.model.*;
import ch.casachocs.connector.model.enums.*;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public class MockDataRepository {
    private final List<Event> events = new ArrayList<>();
    private final List<SyncLog> logs = new ArrayList<>();

    @PostConstruct
    public void init() {
        initEvents();
        initLogs();
    }

    private void initEvents() {
        events.add(Event.builder()
                .id("evt-2024-001")
                .title("SPFDJ")
                .subtitle("Raw Techno Night")
                .genre("Techno")
                .date(LocalDate.of(2024, 6, 15))
                .timeStart(LocalTime.of(23, 0))
                .timeDoors(LocalTime.of(22, 0))
                .venue(Venue.GRANDE_SALLE)
                .description("Raw techno energy from Berlin.")
                .artists(List.of(new Artist("SPFDJ", "Techno")))
                .pricing(new Pricing(25.0, 30.0))
                .capacity(750)
                .status(EventStatus.SYNCED)
                .petziExternalId("petzi-8832")
                .lastSyncAt(LocalDateTime.now().minusDays(1))
                .imageUrl("https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=800&auto=format&fit=crop")
                .build());

        events.add(Event.builder()
                .id("evt-2024-002")
                .title("ANTIGONE")
                .subtitle("Live Modular Set")
                .genre("Electro")
                .date(LocalDate.of(2024, 6, 22))
                .timeStart(LocalTime.of(22, 0))
                .timeDoors(LocalTime.of(21, 0))
                .venue(Venue.QKC)
                .description("Live modular journey.")
                .artists(List.of(new Artist("Antigone", "Electro")))
                .pricing(new Pricing(15.0, 20.0))
                .capacity(100)
                .status(EventStatus.CONFIRMED)
                .imageUrl("https://images.unsplash.com/photo-1514525253440-b393452e8d26?q=80&w=800&auto=format&fit=crop")
                .build());

        events.add(Event.builder()
                .id("evt-2024-003")
                .title("LOCAL FEST")
                .subtitle("Scène Émergente Neuchâteloise")
                .genre("Rock/Punk")
                .date(LocalDate.of(2024, 6, 29))
                .timeStart(LocalTime.of(18, 0))
                .timeDoors(LocalTime.of(17, 0))
                .venue(Venue.GRANDE_SALLE)
                .description("Support your local scene.")
                .artists(List.of(new Artist("Various", "Rock/Pop")))
                .pricing(new Pricing(10.0, 15.0))
                .capacity(750)
                .status(EventStatus.DRAFT)
                .imageUrl("https://images.unsplash.com/photo-1501612780327-45045538702b?q=80&w=800&auto=format&fit=crop")
                .build());

        events.add(Event.builder()
                .id("evt-2024-004")
                .title("NUIT JAZZ")
                .subtitle("Trio Neuchâtel + Guests")
                .genre("Jazz")
                .date(LocalDate.of(2024, 7, 5))
                .timeStart(LocalTime.of(20, 30))
                .timeDoors(LocalTime.of(20, 0))
                .venue(Venue.INTERLOPE)
                .description("Smooth jazz vibes overlooking the lake.")
                .artists(List.of(new Artist("Trio Neuch", "Jazz")))
                .pricing(new Pricing(20.0, 25.0))
                .capacity(80)
                .status(EventStatus.CONFIRMED)
                .imageUrl("https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=800&auto=format&fit=crop")
                .build());
        
        events.add(Event.builder()
                .id("evt-2024-005")
                .title("LOTO ALTERNO")
                .subtitle("Drag Bingo Fundraiser")
                .genre("Event")
                .date(LocalDate.of(2024, 7, 12))
                .timeStart(LocalTime.of(19, 0))
                .timeDoors(LocalTime.of(18, 30))
                .venue(Venue.GRANDE_SALLE)
                .description("Support fundraiser event.")
                .artists(List.of(new Artist("Various", "Event")))
                .pricing(new Pricing(15.0, 20.0))
                .capacity(400)
                .status(EventStatus.CONFIRMED)
                .imageUrl("https://images.unsplash.com/photo-1561489401-fc2876ced162?q=80&w=800&auto=format&fit=crop")
                .build());

        events.add(Event.builder()
                .id("evt-2024-006")
                .title("ABSTRAL COMPOST")
                .subtitle("Release Party")
                .genre("Experimental")
                .date(LocalDate.of(2024, 7, 19))
                .timeStart(LocalTime.of(21, 0))
                .timeDoors(LocalTime.of(20, 30))
                .venue(Venue.QKC)
                .description("Album release party.")
                .artists(List.of(new Artist("Abstral Compost", "Experimental")))
                .pricing(new Pricing(12.0, 15.0))
                .capacity(100)
                .status(EventStatus.DRAFT)
                .imageUrl("https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=800&auto=format&fit=crop")
                .build());
    }

    private void initLogs() {
        logs.add(SyncLog.builder()
                .id("log-001")
                .timestamp(LocalDateTime.now().minusMinutes(2))
                .type(LogType.SYSTEM)
                .status(LogStatus.SUCCESS)
                .duration(0.1)
                .details("Connection to HEEDS API established")
                .build());
                
        logs.add(SyncLog.builder()
                .id("log-002")
                .timestamp(LocalDateTime.now().minusMinutes(5))
                .type(LogType.FETCH_SALES)
                .eventId("evt-2024-001")
                .eventTitle("SPFDJ")
                .status(LogStatus.SUCCESS)
                .duration(0.8)
                .details("Fetched 523 sales records from PETZI API")
                .build());
                
        logs.add(SyncLog.builder()
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

    public List<Event> getAllEvents() {
        return events;
    }

    public Optional<Event> getEventById(String id) {
        return events.stream().filter(e -> e.getId().equals(id)).findFirst();
    }
    
    public void updateEvent(Event event) {
        // Since we return references in mock, in-place update works, 
        // but let's be safe for structure
        for (int i = 0; i < events.size(); i++) {
            if (events.get(i).getId().equals(event.getId())) {
                events.set(i, event);
                return;
            }
        }
    }

    public List<SyncLog> getAllLogs() {
        return logs;
    }
    
    public void addLog(SyncLog log) {
        logs.add(0, log); // Add to top
    }
}