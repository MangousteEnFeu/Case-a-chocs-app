package ch.casachocs.connector.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// This class is no longer an Entity but can be used as a DTO or Embeddable if we wanted.
// For now, let's keep it simple to avoid compilation errors if other parts of the code import it,
// but the Logic has moved to Event fields.
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Pricing {
    private double presale;
    private double door;
}