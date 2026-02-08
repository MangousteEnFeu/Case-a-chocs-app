package ch.casachocs.connector.repository;

import ch.casachocs.connector.model.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SaleRepository extends JpaRepository<Sale, Long> {

    // Trouver toutes les ventes d'un événement
    List<Sale> findByEventId(String eventId);

    // Calculer le revenu total d'un événement
    @Query("SELECT COALESCE(SUM(s.price), 0.0) FROM Sale s WHERE s.eventId = :eventId")
    Double sumPriceByEventId(@Param("eventId") String eventId);

    // Compter le nombre de ventes par événement
    @Query("SELECT COUNT(s) FROM Sale s WHERE s.eventId = :eventId")
    Long countByEventId(@Param("eventId") String eventId);

    // Statistiques de ventes par type de billet
    @Query("SELECT s.ticketType, COUNT(s), SUM(s.price) FROM Sale s WHERE s.eventId = :eventId GROUP BY s.ticketType")
    List<Object[]> getSalesStatsByEventId(@Param("eventId") String eventId);
}