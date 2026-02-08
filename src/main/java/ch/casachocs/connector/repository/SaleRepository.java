package ch.casachocs.connector.repository;

import ch.casachocs.connector.model.Sale;
import ch.casachocs.connector.repository.projection.BuyerLocationProjection;
import ch.casachocs.connector.repository.projection.DailySalesProjection;
import ch.casachocs.connector.repository.projection.SalesCategoryProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SaleRepository extends JpaRepository<Sale, Long> {
    
    long countByEventId(String eventId);

    @Query("SELECT SUM(s.price) FROM Sale s WHERE s.eventId = :eventId")
    Double sumRevenueByEventId(@Param("eventId") String eventId);

    @Query("SELECT s.ticketType as category, COUNT(s) as sold, SUM(s.price) as revenue " +
           "FROM Sale s WHERE s.eventId = :eventId GROUP BY s.ticketType")
    List<SalesCategoryProjection> findSalesByCategory(@Param("eventId") String eventId);
    
    // Using standard JPQL 'date' type which Hibernate maps correctly to SQL DATE
    @Query("SELECT cast(s.purchasedAt as date) as date, COUNT(s) as sold " +
           "FROM Sale s WHERE s.eventId = :eventId " +
           "GROUP BY cast(s.purchasedAt as date) ORDER BY cast(s.purchasedAt as date)")
    List<DailySalesProjection> findSalesByDay(@Param("eventId") String eventId);
    
    @Query("SELECT s.buyerCity as city, COUNT(s) as count " +
           "FROM Sale s WHERE s.eventId = :eventId AND s.buyerCity IS NOT NULL " +
           "GROUP BY s.buyerCity ORDER BY COUNT(s) DESC")
    List<BuyerLocationProjection> findSalesByCity(@Param("eventId") String eventId);
}