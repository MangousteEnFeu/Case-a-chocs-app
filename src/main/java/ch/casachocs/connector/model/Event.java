package ch.casachocs.connector.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "events")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Event {

    @Id
    @Column(length = 50)
    private String id;

    @Column(length = 200, nullable = false)
    private String name;

    @Column(name = "event_date", nullable = false)
    private LocalDate date;

    @Column(name = "ticket_sold")
    private Integer ticketSold = 0;

    @Column(precision = 10, scale = 2)
    private Double revenue = 0.0;
}