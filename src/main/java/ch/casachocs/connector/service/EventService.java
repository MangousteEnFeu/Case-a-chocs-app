package ch.casachocs.connector.service;

import ch.casachocs.connector.model.Event;
import ch.casachocs.connector.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class EventService {

    private final EventRepository eventRepository;

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public List<Event> getEventsByStatus(String status) {
        return eventRepository.findByStatus(status);
    }

    public Optional<Event> getEventById(String id) {
        return eventRepository.findById(id);
    }

    public Event createEvent(Event event) {
        log.info("Creating event: {}", event.getTitle());
        return eventRepository.save(event);
    }

    public Event createEventFromMap(Map<String, Object> data) {
        String id = "evt-" + UUID.randomUUID().toString().substring(0, 8);

        Event event = Event.builder()
                .id(id)
                .title((String) data.get("title"))
                .subtitle((String) data.getOrDefault("subtitle", ""))
                .genre((String) data.getOrDefault("genre", ""))
                .eventDate(LocalDate.parse((String) data.get("date")))
                .timeStart((String) data.getOrDefault("timeStart", "22:00"))
                .timeDoors((String) data.getOrDefault("timeDoors", "21:00"))
                .venue((String) data.getOrDefault("venue", "Grande Salle"))
                .description((String) data.getOrDefault("description", ""))
                .capacity(data.get("capacity") != null ? ((Number) data.get("capacity")).intValue() : 750)
                .pricePresale(data.get("pricePresale") != null ? ((Number) data.get("pricePresale")).doubleValue() : 25.0)
                .priceDoor(data.get("priceDoor") != null ? ((Number) data.get("priceDoor")).doubleValue() : 30.0)
                .status((String) data.getOrDefault("status", "DRAFT"))
                .imageUrl((String) data.getOrDefault("imageUrl", null))
                .createdAt(LocalDateTime.now())
                .build();

        log.info("Creating new event: {} ({})", event.getTitle(), id);
        return eventRepository.save(event);
    }

    /**
     * Met à jour un événement existant à partir d'une Map
     * ✅ CORRIGÉ: Gestion correcte des champs pricePresale et priceDoor
     */
    public Event updateEventFromMap(String id, Map<String, Object> data) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found: " + id));

        // Sauvegarder l'ancien statut AVANT modification
        String oldStatus = event.getStatus();

        // Mise à jour des champs de base
        if (data.containsKey("title")) event.setTitle((String) data.get("title"));
        if (data.containsKey("subtitle")) event.setSubtitle((String) data.get("subtitle"));
        if (data.containsKey("genre")) event.setGenre((String) data.get("genre"));
        if (data.containsKey("date")) event.setEventDate(LocalDate.parse((String) data.get("date")));
        if (data.containsKey("timeStart")) event.setTimeStart((String) data.get("timeStart"));
        if (data.containsKey("timeDoors")) event.setTimeDoors((String) data.get("timeDoors"));
        if (data.containsKey("venue")) event.setVenue((String) data.get("venue"));
        if (data.containsKey("description")) event.setDescription((String) data.get("description"));
        if (data.containsKey("capacity")) event.setCapacity(((Number) data.get("capacity")).intValue());
        if (data.containsKey("imageUrl")) event.setImageUrl((String) data.get("imageUrl"));

        // ✅ CORRIGÉ: Gestion des prix avec les bons noms de champs
        if (data.containsKey("pricePresale")) {
            event.setPricePresale(((Number) data.get("pricePresale")).doubleValue());
        }
        if (data.containsKey("priceDoor")) {
            event.setPriceDoor(((Number) data.get("priceDoor")).doubleValue());
        }

        // NE PAS permettre de changer le statut manuellement via l'API update
        // Si l'événement était SYNCED, le repasser en CONFIRMED (données modifiées = plus synchronisé)
        if ("SYNCED".equals(oldStatus)) {
            event.setStatus("CONFIRMED");
            log.info("Event {} was SYNCED, now CONFIRMED (needs re-sync to PETZI)", event.getTitle());
        }
        // Sinon garder l'ancien statut (DRAFT reste DRAFT, CONFIRMED reste CONFIRMED)

        log.info("Updating event: {} - pricePresale={}, priceDoor={}",
                event.getTitle(), event.getPricePresale(), event.getPriceDoor());
        return eventRepository.save(event);
    }

    public Event updateEvent(String id, Event eventDetails) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found: " + id));

        event.setTitle(eventDetails.getTitle());
        event.setEventDate(eventDetails.getEventDate());

        return eventRepository.save(event);
    }

    public void deleteEvent(String id) {
        eventRepository.deleteById(id);
        log.info("Deleted event: {}", id);
    }

    public List<Event> getUpcomingEvents() {
        return eventRepository.findByEventDateAfter(LocalDate.now());
    }

    public List<Event> searchEventsByName(String name) {
        return eventRepository.findByTitleContainingIgnoreCase(name);
    }
}