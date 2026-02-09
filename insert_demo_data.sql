-- ============================================
-- Case a Chocs Connector - Donnees de demonstration
-- Executer apres create_table.sql
-- ============================================

-- Nettoyage
DELETE FROM sales;
DELETE FROM sync_logs;
DELETE FROM event_artists;
DELETE FROM events;
DELETE FROM artists;

-- ============================================
-- ARTISTES
-- ============================================
INSERT INTO artists (name, genre, booking_fee) VALUES ('SPFDJ', 'Techno', 8500.00);
INSERT INTO artists (name, genre, booking_fee) VALUES ('Ama Lou', 'R&B / Soul', 12000.00);
INSERT INTO artists (name, genre, booking_fee) VALUES ('Local Fest Collective', 'Various', 3500.00);
INSERT INTO artists (name, genre, booking_fee) VALUES ('Vitalic', 'Electro', 15000.00);
INSERT INTO artists (name, genre, booking_fee) VALUES ('Malik Djoudi', 'Pop', 6000.00);
INSERT INTO artists (name, genre, booking_fee) VALUES ('Polo & Pan', 'Electro Pop', 22000.00);

-- ============================================
-- EVENEMENTS
-- ============================================

-- SPFDJ - SYNCED (deja synchronise avec PETZI)
INSERT INTO events (id, title, subtitle, genre, event_date, time_start, time_doors, venue, description, capacity, price_presale, price_door, status, petzi_external_id, last_sync_at, ticket_sold, revenue, created_at)
VALUES ('evt-2024-001', 'SPFDJ', 'Techno Night', 'Techno', TO_DATE('2026-03-15', 'YYYY-MM-DD'), '22:00', '21:00', 'Grande Salle', 
'Soiree techno avec la DJ berlinoise SPFDJ, figure incontournable de la scene underground.', 
750, 25.00, 30.00, 'SYNCED', 'petzi-98234', SYSTIMESTAMP - INTERVAL '2' DAY, 523, 13390.00, SYSTIMESTAMP - INTERVAL '30' DAY);

-- Ama Lou - CONFIRMED (pret a synchroniser)
INSERT INTO events (id, title, subtitle, genre, event_date, time_start, time_doors, venue, description, capacity, price_presale, price_door, status, petzi_external_id, last_sync_at, ticket_sold, revenue, created_at)
VALUES ('evt-2024-002', 'Ama Lou', 'Soul Session', 'R&B / Soul', TO_DATE('2026-03-22', 'YYYY-MM-DD'), '21:00', '20:00', 'QKC', 
'Concert intimiste de la chanteuse britannique Ama Lou, revelation soul de 2025.', 
100, 35.00, 40.00, 'CONFIRMED', NULL, NULL, 0, 0.00, SYSTIMESTAMP - INTERVAL '15' DAY);

-- Local Fest - DRAFT (brouillon)
INSERT INTO events (id, title, subtitle, genre, event_date, time_start, time_doors, venue, description, capacity, price_presale, price_door, status, petzi_external_id, last_sync_at, ticket_sold, revenue, created_at)
VALUES ('evt-2024-003', 'Local Fest 2026', 'Edition Printemps', 'Various', TO_DATE('2026-04-12', 'YYYY-MM-DD'), '17:00', '16:00', 'Grande Salle', 
'Festival annuel mettant en avant les talents locaux neuchatelois.', 
750, 45.00, 55.00, 'DRAFT', NULL, NULL, 0, 0.00, SYSTIMESTAMP - INTERVAL '5' DAY);

-- Vitalic - SYNCED
INSERT INTO events (id, title, subtitle, genre, event_date, time_start, time_doors, venue, description, capacity, price_presale, price_door, status, petzi_external_id, last_sync_at, ticket_sold, revenue, created_at)
VALUES ('evt-2024-004', 'Vitalic', 'Live Show', 'Electro', TO_DATE('2026-04-05', 'YYYY-MM-DD'), '22:30', '21:00', 'Grande Salle', 
'Le maitre de l electro francaise en concert live avec son nouveau show audiovisuel.', 
750, 38.00, 45.00, 'SYNCED', 'petzi-98456', SYSTIMESTAMP - INTERVAL '10' DAY, 412, 15985.00, SYSTIMESTAMP - INTERVAL '45' DAY);

-- Malik Djoudi - CONFIRMED
INSERT INTO events (id, title, subtitle, genre, event_date, time_start, time_doors, venue, description, capacity, price_presale, price_door, status, petzi_external_id, last_sync_at, ticket_sold, revenue, created_at)
VALUES ('evt-2024-005', 'Malik Djoudi', 'Intimiste', 'Pop', TO_DATE('2026-04-18', 'YYYY-MM-DD'), '20:30', '19:30', 'Interlope', 
'Concert acoustique du chanteur francais Malik Djoudi dans la salle intimiste.', 
80, 28.00, 32.00, 'CONFIRMED', NULL, NULL, 0, 0.00, SYSTIMESTAMP - INTERVAL '8' DAY);

-- Polo & Pan - SYNCED (SOLD OUT)
INSERT INTO events (id, title, subtitle, genre, event_date, time_start, time_doors, venue, description, capacity, price_presale, price_door, status, petzi_external_id, last_sync_at, ticket_sold, revenue, created_at)
VALUES ('evt-2024-006', 'Polo & Pan', 'World Tour 2026', 'Electro Pop', TO_DATE('2026-02-28', 'YYYY-MM-DD'), '22:00', '21:00', 'Grande Salle', 
'Le duo francais Polo & Pan de retour avec leur univers onirique et tropical.', 
750, 42.00, 50.00, 'SYNCED', 'petzi-97123', SYSTIMESTAMP - INTERVAL '20' DAY, 750, 31740.00, SYSTIMESTAMP - INTERVAL '60' DAY);

-- ============================================
-- LIAISON EVENTS <-> ARTISTS
-- ============================================
INSERT INTO event_artists (event_id, artist_id) VALUES ('evt-2024-001', 1);
INSERT INTO event_artists (event_id, artist_id) VALUES ('evt-2024-002', 2);
INSERT INTO event_artists (event_id, artist_id) VALUES ('evt-2024-003', 3);
INSERT INTO event_artists (event_id, artist_id) VALUES ('evt-2024-004', 4);
INSERT INTO event_artists (event_id, artist_id) VALUES ('evt-2024-005', 5);
INSERT INTO event_artists (event_id, artist_id) VALUES ('evt-2024-006', 6);

-- ============================================
-- VENTES - SPFDJ (523 billets)
-- ============================================
INSERT INTO sales (event_id, ticket_type, price, purchased_at, buyer_city) VALUES ('evt-2024-001', 'Prevente', 25.00, SYSTIMESTAMP - INTERVAL '25' DAY, 'Neuchatel');
INSERT INTO sales (event_id, ticket_type, price, purchased_at, buyer_city) VALUES ('evt-2024-001', 'Prevente', 25.00, SYSTIMESTAMP - INTERVAL '24' DAY, 'Neuchatel');
INSERT INTO sales (event_id, ticket_type, price, purchased_at, buyer_city) VALUES ('evt-2024-001', 'Prevente', 25.00, SYSTIMESTAMP - INTERVAL '23' DAY, 'Lausanne');
INSERT INTO sales (event_id, ticket_type, price, purchased_at, buyer_city) VALUES ('evt-2024-001', 'Prevente', 25.00, SYSTIMESTAMP - INTERVAL '22' DAY, 'Lausanne');
INSERT INTO sales (event_id, ticket_type, price, purchased_at, buyer_city) VALUES ('evt-2024-001', 'Prevente', 25.00, SYSTIMESTAMP - INTERVAL '20' DAY, 'Berne');
INSERT INTO sales (event_id, ticket_type, price, purchased_at, buyer_city) VALUES ('evt-2024-001', 'Prevente', 25.00, SYSTIMESTAMP - INTERVAL '18' DAY, 'Berne');
INSERT INTO sales (event_id, ticket_type, price, purchased_at, buyer_city) VALUES ('evt-2024-001', 'Prevente', 25.00, SYSTIMESTAMP - INTERVAL '15' DAY, 'Zurich');
INSERT INTO sales (event_id, ticket_type, price, purchased_at, buyer_city) VALUES ('evt-2024-001', 'Prevente', 25.00, SYSTIMESTAMP - INTERVAL '12' DAY, 'Geneve');
INSERT INTO sales (event_id, ticket_type, price, purchased_at, buyer_city) VALUES ('evt-2024-001', 'Prevente', 25.00, SYSTIMESTAMP - INTERVAL '10' DAY, 'Geneve');
INSERT INTO sales (event_id, ticket_type, price, purchased_at, buyer_city) VALUES ('evt-2024-001', 'Sur place', 30.00, SYSTIMESTAMP - INTERVAL '1' DAY, 'Neuchatel');
INSERT INTO sales (event_id, ticket_type, price, purchased_at, buyer_city) VALUES ('evt-2024-001', 'Sur place', 30.00, SYSTIMESTAMP - INTERVAL '1' DAY, 'Neuchatel');

-- ============================================
-- VENTES - Vitalic (412 billets)
-- ============================================
INSERT INTO sales (event_id, ticket_type, price, purchased_at, buyer_city) VALUES ('evt-2024-004', 'Prevente', 38.00, SYSTIMESTAMP - INTERVAL '35' DAY, 'Neuchatel');
INSERT INTO sales (event_id, ticket_type, price, purchased_at, buyer_city) VALUES ('evt-2024-004', 'Prevente', 38.00, SYSTIMESTAMP - INTERVAL '32' DAY, 'Neuchatel');
INSERT INTO sales (event_id, ticket_type, price, purchased_at, buyer_city) VALUES ('evt-2024-004', 'Prevente', 38.00, SYSTIMESTAMP - INTERVAL '28' DAY, 'Lausanne');
INSERT INTO sales (event_id, ticket_type, price, purchased_at, buyer_city) VALUES ('evt-2024-004', 'Prevente', 38.00, SYSTIMESTAMP - INTERVAL '25' DAY, 'Lausanne');
INSERT INTO sales (event_id, ticket_type, price, purchased_at, buyer_city) VALUES ('evt-2024-004', 'Prevente', 38.00, SYSTIMESTAMP - INTERVAL '21' DAY, 'Berne');
INSERT INTO sales (event_id, ticket_type, price, purchased_at, buyer_city) VALUES ('evt-2024-004', 'Prevente', 38.00, SYSTIMESTAMP - INTERVAL '18' DAY, 'Fribourg');
INSERT INTO sales (event_id, ticket_type, price, purchased_at, buyer_city) VALUES ('evt-2024-004', 'Sur place', 45.00, SYSTIMESTAMP - INTERVAL '1' DAY, 'Neuchatel');
INSERT INTO sales (event_id, ticket_type, price, purchased_at, buyer_city) VALUES ('evt-2024-004', 'Sur place', 45.00, SYSTIMESTAMP - INTERVAL '1' DAY, 'Neuchatel');

-- ============================================
-- VENTES - Polo & Pan (750 billets - SOLD OUT)
-- ============================================
INSERT INTO sales (event_id, ticket_type, price, purchased_at, buyer_city) VALUES ('evt-2024-006', 'Prevente', 42.00, SYSTIMESTAMP - INTERVAL '50' DAY, 'Neuchatel');
INSERT INTO sales (event_id, ticket_type, price, purchased_at, buyer_city) VALUES ('evt-2024-006', 'Prevente', 42.00, SYSTIMESTAMP - INTERVAL '48' DAY, 'Neuchatel');
INSERT INTO sales (event_id, ticket_type, price, purchased_at, buyer_city) VALUES ('evt-2024-006', 'Prevente', 42.00, SYSTIMESTAMP - INTERVAL '45' DAY, 'Lausanne');
INSERT INTO sales (event_id, ticket_type, price, purchased_at, buyer_city) VALUES ('evt-2024-006', 'Prevente', 42.00, SYSTIMESTAMP - INTERVAL '42' DAY, 'Lausanne');
INSERT INTO sales (event_id, ticket_type, price, purchased_at, buyer_city) VALUES ('evt-2024-006', 'Prevente', 42.00, SYSTIMESTAMP - INTERVAL '40' DAY, 'Geneve');
INSERT INTO sales (event_id, ticket_type, price, purchased_at, buyer_city) VALUES ('evt-2024-006', 'Prevente', 42.00, SYSTIMESTAMP - INTERVAL '38' DAY, 'Geneve');
INSERT INTO sales (event_id, ticket_type, price, purchased_at, buyer_city) VALUES ('evt-2024-006', 'Prevente', 42.00, SYSTIMESTAMP - INTERVAL '35' DAY, 'Berne');
INSERT INTO sales (event_id, ticket_type, price, purchased_at, buyer_city) VALUES ('evt-2024-006', 'Prevente', 42.00, SYSTIMESTAMP - INTERVAL '32' DAY, 'Zurich');
INSERT INTO sales (event_id, ticket_type, price, purchased_at, buyer_city) VALUES ('evt-2024-006', 'Sur place', 50.00, SYSTIMESTAMP - INTERVAL '1' DAY, 'Neuchatel');
INSERT INTO sales (event_id, ticket_type, price, purchased_at, buyer_city) VALUES ('evt-2024-006', 'Sur place', 50.00, SYSTIMESTAMP - INTERVAL '1' DAY, 'Neuchatel');

-- ============================================
-- LOGS DE SYNCHRONISATION
-- ============================================
INSERT INTO sync_logs (log_timestamp, log_type, event_id, event_title, status, duration_sec, message, records_synced)
VALUES (SYSTIMESTAMP - INTERVAL '30' DAY, 'SYSTEM', NULL, NULL, 'SUCCESS', 0.12, 'System startup - Oracle connection established', 0);

INSERT INTO sync_logs (log_timestamp, log_type, event_id, event_title, status, duration_sec, message, records_synced)
VALUES (SYSTIMESTAMP - INTERVAL '28' DAY, 'SYNC_EVENT', 'evt-2024-001', 'SPFDJ', 'SUCCESS', 0.85, 'Event pushed to PETZI successfully. External ID: petzi-98234', 1);

INSERT INTO sync_logs (log_timestamp, log_type, event_id, event_title, status, duration_sec, message, records_synced)
VALUES (SYSTIMESTAMP - INTERVAL '25' DAY, 'FETCH_SALES', 'evt-2024-001', 'SPFDJ', 'SUCCESS', 0.42, 'Sales data fetched from PETZI. 180 new tickets recorded.', 180);

INSERT INTO sync_logs (log_timestamp, log_type, event_id, event_title, status, duration_sec, message, records_synced)
VALUES (SYSTIMESTAMP - INTERVAL '40' DAY, 'SYNC_EVENT', 'evt-2024-004', 'Vitalic', 'SUCCESS', 0.92, 'Event pushed to PETZI successfully. External ID: petzi-98456', 1);

INSERT INTO sync_logs (log_timestamp, log_type, event_id, event_title, status, duration_sec, message, records_synced)
VALUES (SYSTIMESTAMP - INTERVAL '21' DAY, 'FETCH_SALES', 'evt-2024-004', 'Vitalic', 'SUCCESS', 0.51, 'Sales data fetched from PETZI. 365 tickets recorded.', 365);

INSERT INTO sync_logs (log_timestamp, log_type, event_id, event_title, status, duration_sec, message, records_synced)
VALUES (SYSTIMESTAMP - INTERVAL '55' DAY, 'SYNC_EVENT', 'evt-2024-006', 'Polo & Pan', 'SUCCESS', 0.78, 'Event pushed to PETZI successfully. External ID: petzi-97123', 1);

INSERT INTO sync_logs (log_timestamp, log_type, event_id, event_title, status, duration_sec, message, records_synced)
VALUES (SYSTIMESTAMP - INTERVAL '30' DAY, 'FETCH_SALES', 'evt-2024-006', 'Polo & Pan', 'SUCCESS', 0.65, 'Sales data fetched from PETZI. SOLD OUT - 750 tickets.', 750);

INSERT INTO sync_logs (log_timestamp, log_type, event_id, event_title, status, duration_sec, message, records_synced)
VALUES (SYSTIMESTAMP - INTERVAL '12' DAY, 'SYNC_EVENT', 'evt-2024-003', 'Local Fest 2026', 'ERROR', 2.30, 'Sync failed: Event status DRAFT not allowed. Must be CONFIRMED.', 0);

INSERT INTO sync_logs (log_timestamp, log_type, event_id, event_title, status, duration_sec, message, records_synced)
VALUES (SYSTIMESTAMP - INTERVAL '5' DAY, 'WEBHOOK', 'evt-2024-001', 'SPFDJ', 'SUCCESS', 0.08, 'PETZI webhook received: ticket_sold event processed.', 1);

INSERT INTO sync_logs (log_timestamp, log_type, event_id, event_title, status, duration_sec, message, records_synced)
VALUES (SYSTIMESTAMP - INTERVAL '2' DAY, 'FETCH_SALES', 'evt-2024-001', 'SPFDJ', 'SUCCESS', 0.44, 'Sales data fetched from PETZI. 523 total tickets.', 523);

INSERT INTO sync_logs (log_timestamp, log_type, event_id, event_title, status, duration_sec, message, records_synced)
VALUES (SYSTIMESTAMP - INTERVAL '1' HOUR, 'SYSTEM', NULL, NULL, 'SUCCESS', 0.05, 'Health check completed. All systems operational.', 0);

COMMIT;

-- ============================================
-- VERIFICATION
-- ============================================
SELECT 'Artists: ' || COUNT(*) AS result FROM artists;
SELECT 'Events: ' || COUNT(*) AS result FROM events;
SELECT 'Event-Artists: ' || COUNT(*) AS result FROM event_artists;
SELECT 'Sales: ' || COUNT(*) AS result FROM sales;
SELECT 'Sync Logs: ' || COUNT(*) AS result FROM sync_logs;
