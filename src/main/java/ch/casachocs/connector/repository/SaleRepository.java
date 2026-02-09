package ch.casachocs.connector.repository;

import ch.casachocs.connector.model.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SaleRepository extends JpaRepository<Sale, String> {

    List<Sale> findByEventId(String eventId);

    @Query("SELECT SUM(s.unitPrice) FROM Sale s WHERE s.eventId = :eventId")
    Double sumPriceByEventId(@Param("eventId") String eventId);
}