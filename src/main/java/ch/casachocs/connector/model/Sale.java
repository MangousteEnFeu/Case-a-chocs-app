package ch.casachocs.connector.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "sales")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Sale {

    @Id
    @Column(name = "id", length = 50)
    private String id;

    @Column(name = "event_id", length = 50, nullable = false)
    private String eventId;

    @Column(name = "category", length = 50)
    private String category;

    @Builder.Default
    private Integer quantity = 1;

    @Column(name = "unit_price")
    private Double unitPrice;

    @Column(name = "total_amount")
    private Double totalAmount;

    @Column(name = "buyer_location", length = 100)
    private String buyerLocation;

    @Column(name = "sale_date")
    private LocalDateTime saleDate;

    @PrePersist
    protected void onCreate() {
        if (id == null) {
            id = "sale-" + System.currentTimeMillis();
        }
        if (saleDate == null) {
            saleDate = LocalDateTime.now();
        }
    }

    // Alias pour compatibilité avec le code existant
    public String getTicketType() { return category; }
    public void setTicketType(String t) { this.category = t; }
    public Double getPrice() { return unitPrice; }
    public void setPrice(Double p) { this.unitPrice = p; this.totalAmount = p * (quantity != null ? quantity : 1); }
    public String getBuyerCity() { return buyerLocation; }
    public void setBuyerCity(String c) { this.buyerLocation = c; }
    public LocalDateTime getPurchasedAt() { return saleDate; }
    public void setPurchasedAt(LocalDateTime d) { this.saleDate = d; }

    // Builder aliases pour compatibilité
    public static class SaleBuilder {
        public SaleBuilder ticketType(String t) { this.category = t; return this; }
        public SaleBuilder price(Double p) { this.unitPrice = p; return this; }
        public SaleBuilder buyerCity(String c) { this.buyerLocation = c; return this; }
        public SaleBuilder purchasedAt(LocalDateTime d) { this.saleDate = d; return this; }
    }
}