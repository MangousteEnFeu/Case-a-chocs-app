-- ============================================
-- Case a Chocs Connector - Oracle Database Schema
-- Version complete alignee avec le frontend
-- ============================================

-- Drop tables si elles existent (dans l'ordre des FK)
BEGIN EXECUTE IMMEDIATE 'DROP TABLE sales CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE sync_logs CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE event_artists CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE events CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE artists CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/

-- ============================================
-- TABLE: ARTISTS
-- ============================================
CREATE TABLE artists (
                         id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                         name VARCHAR2(200) NOT NULL,
                         genre VARCHAR2(100),
                         booking_fee NUMBER(10,2)
);

-- ============================================
-- TABLE: EVENTS
-- ============================================
CREATE TABLE events (
                        id VARCHAR2(50) PRIMARY KEY,
                        title VARCHAR2(200) NOT NULL,
                        subtitle VARCHAR2(200),
                        genre VARCHAR2(100),
                        event_date DATE NOT NULL,
                        time_start VARCHAR2(10),
                        time_doors VARCHAR2(10),
                        venue VARCHAR2(50) DEFAULT 'Grande Salle',
                        description CLOB,
                        capacity NUMBER DEFAULT 750,
                        price_presale NUMBER(10,2),
                        price_door NUMBER(10,2),
                        status VARCHAR2(20) DEFAULT 'DRAFT',
                        petzi_external_id VARCHAR2(100),
                        last_sync_at TIMESTAMP,
                        image_url VARCHAR2(500),
                        ticket_sold NUMBER DEFAULT 0,
                        revenue NUMBER(10,2) DEFAULT 0.00,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        CONSTRAINT chk_event_status CHECK (status IN ('DRAFT', 'CONFIRMED', 'SYNCED', 'CANCELLED')),
                        CONSTRAINT chk_event_venue CHECK (venue IN ('Grande Salle', 'QKC', 'Interlope'))
);

-- ============================================
-- TABLE: EVENT_ARTISTS (relation N-N)
-- ============================================
CREATE TABLE event_artists (
                               event_id VARCHAR2(50) NOT NULL,
                               artist_id NUMBER NOT NULL,
                               CONSTRAINT pk_event_artists PRIMARY KEY (event_id, artist_id),
                               CONSTRAINT fk_ea_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
                               CONSTRAINT fk_ea_artist FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE
);

-- ============================================
-- TABLE: SALES
-- ============================================
CREATE TABLE sales (
                       id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                       event_id VARCHAR2(50) NOT NULL,
                       ticket_type VARCHAR2(100),
                       price NUMBER(10,2),
                       purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       buyer_city VARCHAR2(100),
                       CONSTRAINT fk_sales_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- ============================================
-- TABLE: SYNC_LOGS
-- ============================================
CREATE TABLE sync_logs (
                           id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                           log_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                           log_type VARCHAR2(50),
                           event_id VARCHAR2(50),
                           event_title VARCHAR2(200),
                           status VARCHAR2(20),
                           duration_sec NUMBER(10,3),
                           message CLOB,
                           records_synced NUMBER DEFAULT 0,
                           CONSTRAINT chk_log_type CHECK (log_type IN ('SYSTEM', 'SYNC_EVENT', 'FETCH_SALES', 'WEBHOOK', 'ERROR')),
                           CONSTRAINT chk_log_status CHECK (status IN ('SUCCESS', 'ERROR', 'WARNING'))
);

-- ============================================
-- INDEX pour performance
-- ============================================
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_events_venue ON events(venue);
CREATE INDEX idx_sales_event ON sales(event_id);
CREATE INDEX idx_sales_date ON sales(purchased_at);
CREATE INDEX idx_logs_timestamp ON sync_logs(log_timestamp);
CREATE INDEX idx_logs_type ON sync_logs(log_type);

COMMIT;

-- Verification
SELECT 'Schema created successfully' AS result FROM dual;