-- ============================================
-- Case à Chocs Connector - Oracle Database Schema
-- ============================================

-- Drop tables si elles existent (ignorer les erreurs si elles n'existent pas)
BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE sync_logs CASCADE CONSTRAINTS';
EXCEPTION
    WHEN OTHERS THEN NULL;
END;
/

BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE sales CASCADE CONSTRAINTS';
EXCEPTION
    WHEN OTHERS THEN NULL;
END;
/

BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE artists CASCADE CONSTRAINTS';
EXCEPTION
    WHEN OTHERS THEN NULL;
END;
/

BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE events CASCADE CONSTRAINTS';
EXCEPTION
    WHEN OTHERS THEN NULL;
END;
/

-- Créer les tables
CREATE TABLE events (
                        id VARCHAR2(50) PRIMARY KEY,
                        name VARCHAR2(200) NOT NULL,
                        event_date DATE NOT NULL,  -- ✅ CHANGÉ: "date" → "event_date"
                        ticket_sold NUMBER DEFAULT 0,
                        revenue NUMBER(10,2) DEFAULT 0.00
);

CREATE TABLE sales (
                       id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                       event_id VARCHAR2(50) NOT NULL,
                       ticket_type VARCHAR2(100),
                       price NUMBER(10,2),
                       purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       buyer_city VARCHAR2(100),
                       CONSTRAINT fk_sales_event FOREIGN KEY (event_id) REFERENCES events(id)
);

CREATE TABLE sync_logs (
                           id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                           log_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- ✅ CHANGÉ: "timestamp" → "log_timestamp"
                           status VARCHAR2(50),
                           message CLOB,
                           records_synced NUMBER DEFAULT 0
);

CREATE TABLE artists (
                         id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                         name VARCHAR2(200) NOT NULL,
                         genre VARCHAR2(100),
                         booking_fee NUMBER(10,2)
);

-- Index pour performance
CREATE INDEX idx_sales_event ON sales(event_id);
CREATE INDEX idx_sales_date ON sales(purchased_at);

COMMIT;