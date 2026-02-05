package ch.casachocs.connector.service;

import ch.casachocs.connector.model.Event;
import ch.casachocs.connector.model.enums.EventStatus;
import ch.casachocs.connector.repository.MockDataRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {
    private final MockDataRepository repository;

    public List<Event> getAllEvents(EventStatus statusFilter) {
        List<Event> allEvents = repository.getAllEvents();
        if (statusFilter != null) {
            return allEvents.stream()
                    .filter(e -> e.getStatus() == statusFilter)
                    .collect(Collectors.toList());
        }
        return allEvents;
    }

    public Optional<Event> getEventById(String id) {
        return repository.getEventById(id);
    }
}