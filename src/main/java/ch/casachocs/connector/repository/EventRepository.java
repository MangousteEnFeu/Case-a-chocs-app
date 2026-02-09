package ch.casachocs.connector.repository;

import ch.casachocs.connector.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, String> {

    List<Event> findByTitleContainingIgnoreCase(String title);

    List<Event> findByEventDateAfter(LocalDate date);

    List<Event> findByEventDateBefore(LocalDate date);

    List<Event> findByStatus(String status);
}