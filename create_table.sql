-- ============================================
-- Case à Chocs Connector - Database Schema
-- ============================================
-- Compatible: PostgreSQL 14+
-- Auto-exécuté par Docker au premier lancement
-- ============================================

-- Table des artistes
CREATE TABLE IF NOT EXISTS artists (
                                       id VARCHAR(255) PRIMARY KEY,
                                       name VARCHAR(255) NOT NULL,
                                       genre VARCHAR(255),
                                       country VARCHAR(255),
                                       booking_fee NUMERIC(10, 2)
);

-- Table des événements
CREATE TABLE IF NOT EXISTS events (
                                      id VARCHAR(255) PRIMARY KEY,
                                      title VARCHAR(255) NOT NULL,
                                      artist_id VARCHAR(255),
                                      event_date DATE NOT NULL,
                                      time_doors VARCHAR(10),
                                      time_start VARCHAR(10),
                                      venue VARCHAR(255) NOT NULL,
                                      capacity INTEGER DEFAULT 0,
                                      price_presale NUMERIC(10, 2),
                                      price_door NUMERIC(10, 2),
                                      status VARCHAR(50) DEFAULT 'DRAFT',
                                      petzi_external_id VARCHAR(255),
                                      last_sync_at TIMESTAMP,
                                      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                      image_url VARCHAR(500),
                                      description TEXT,
                                      subtitle VARCHAR(255),
                                      genre VARCHAR(100),
                                      CONSTRAINT fk_artist FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE SET NULL
);

-- Table des ventes
CREATE TABLE IF NOT EXISTS sales (
                                     id VARCHAR(255) PRIMARY KEY,
                                     event_id VARCHAR(255) NOT NULL,
                                     category VARCHAR(100),
                                     quantity INTEGER DEFAULT 1,
                                     unit_price NUMERIC(10, 2),
                                     total_amount NUMERIC(10, 2),
                                     buyer_location VARCHAR(50),
                                     buyer_name VARCHAR(200),
                                     buyer_email VARCHAR(255),
                                     ticket_number VARCHAR(100),
                                     sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                     CONSTRAINT fk_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- Table des logs de synchronisation
CREATE TABLE IF NOT EXISTS sync_logs (
                                         id BIGSERIAL PRIMARY KEY,
                                         log_timestamp TIMESTAMP DEFAULT NOW(),
                                         log_type VARCHAR(50),
                                         event_id VARCHAR(255),
                                         event_title VARCHAR(255),
                                         status VARCHAR(50),
                                         duration_sec DOUBLE PRECISION,
                                         message TEXT,
                                         records_synced INTEGER DEFAULT 0,
                                         json_details TEXT
);

-- Index pour performances
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_sales_event_id ON sales(event_id);
CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(sale_date);
CREATE INDEX IF NOT EXISTS idx_sync_logs_timestamp ON sync_logs(log_timestamp);
CREATE INDEX IF NOT EXISTS idx_sync_logs_event_id ON sync_logs(event_id);

-- ============================================
-- Schéma créé avec succès !
-- ============================================