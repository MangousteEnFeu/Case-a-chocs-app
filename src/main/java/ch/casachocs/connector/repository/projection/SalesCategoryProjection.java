package ch.casachocs.connector.repository.projection;

public interface SalesCategoryProjection {
    String getCategory();
    Long getSold();
    Double getRevenue();
}