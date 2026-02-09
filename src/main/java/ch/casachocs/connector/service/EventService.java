package ch.casachocs.connector.service;

import ch.casachocs.connector.model.Event;
import ch.casachocs.connector.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class EventService {

    private final EventRepository eventRepository;

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    // NOUVEAU
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

    public Event updateEvent(String id, Event eventDetails) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found: " + id));

        event.setTitle(eventDetails.getTitle());
        event.setDate(eventDetails.getDate());
        event.setTicketSold(eventDetails.getTicketSold());
        event.setRevenue(eventDetails.getRevenue());
        // Ajoute les autres champs si nécessaire
        event.setStatus(eventDetails.getStatus());

        return eventRepository.save(event);
    }

    public void deleteEvent(String id) {
        eventRepository.deleteById(id);
        log.info("Deleted event: {}", id);
    }

    public List<Event> getUpcomingEvents() {
        return eventRepository.findByDateAfter(LocalDate.now());
    }

    public List<Event> searchEventsByName(String name) {
        return eventRepository.findByTitleContainingIgnoreCase(name);
    }
}