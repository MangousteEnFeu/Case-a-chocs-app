package ch.casachocs.connector.model.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum Venue {
    GRANDE_SALLE("Grande Salle"),
    QKC("QKC"),
    INTERLOPE("Interlope");
    
    @JsonValue
    private final String displayName;
}