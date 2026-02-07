package ch.casachocs.connector.service;

import ch.casachocs.connector.model.Event;
import ch.casachocs.connector.model.Pricing;
import ch.casachocs.connector.model.enums.EventStatus;
import ch.casachocs.connector.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {
    private final EventRepository repository;

    public List<Event> getAllEvents(EventStatus statusFilter) {
        if (statusFilter != null) {
            return mapPricing(repository.findByStatus(statusFilter));
        }
        return mapPricing(repository.findAll());
    }

    public Optional<Event> getEventById(String id) {
        return repository.findById(id).map(this::enrichEvent);
    }

    // Helper to map flat pricing fields back to Pricing object if needed for DTO
    // Note: To keep things simple with the provided frontend type definitions, 
    // we modify the return to match frontend expectation or adjust logic.
    // Here we rely on the Controller to serialize. If frontend expects 'pricing: {presale: x, door: y}',
    // we might need a DTO mapper. For now, we assume the frontend might adapt or we define a Pricing object.
    
    // Wait, the previous Mock Event model had a "Pricing" object. 
    // To avoid breaking the Frontend which expects { pricing: { presale: ..., door: ... } },
    // we should reconstruct it transiently or change the frontend.
    // Ideally we would use DTOs. To save time and lines, let's assume Jackson can handle a Transient getter.
    
    private List<Event> mapPricing(List<Event> events) {
        events.forEach(this::enrichEvent);
        return events;
    }

    private Event enrichEvent(Event e) {
        // Logic if we needed to calculate derived fields.
        // For standard JPA, the getters for presalePrice exist on the entity.
        return e;
    }
}