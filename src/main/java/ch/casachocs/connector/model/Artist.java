package ch.casachocs.connector.model;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "artists")
public class Artist {
    @Id
    private String id;
    private String name;
    private String genre;

    public Artist() {
        this.id = UUID.randomUUID().toString();
    }

    public Artist(String name, String genre) {
        this();
        this.name = name;
        this.genre = genre;
    }

    // Getters & Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getGenre() { return genre; }
    public void setGenre(String genre) { this.genre = genre; }
}