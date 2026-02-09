package ch.casachocs.connector.repository;

import ch.casachocs.connector.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, String> {

    // Trouver les événements par nom
    List<Event> findByNameContainingIgnoreCase(String title);

    // Trouver les événements après une certaine date
    List<Event> findByDateAfter(LocalDate date);

    // Trouver les événements avant une certaine date
    List<Event> findByDateBefore(LocalDate date);
}