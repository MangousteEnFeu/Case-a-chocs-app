-- ============================================
-- Case a Chocs Connector - Données de démonstration
-- Exécuter après create_table.sql
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
-- EVENEMENTS (avec images Unsplash)
-- ============================================

-- SPFDJ - SYNCED
INSERT INTO events (id, title, subtitle, genre, event_date, time_start, time_doors, venue, description, capacity, price_presale, price_door, status, petzi_external_id, last_sync_at, image_url, ticket_sold, revenue, created_at)
VALUES ('evt-2024-001', 'SPFDJ', 'Techno Night', 'Techno', TO_DATE('2026-03-15', 'YYYY-MM-DD'), '22:00', '21:00', 'Grande Salle', 
'Soirée techno avec la DJ berlinoise SPFDJ, figure incontournable de la scène underground.', 
750, 25.00, 30.00, 'SYNCED', 'petzi-98234', SYSTIMESTAMP - INTERVAL '2' DAY, 
'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=800', 
523, 13390.00, SYSTIMESTAMP - INTERVAL '30' DAY);

-- Ama Lou - CONFIRMED
INSERT INTO events (id, title, subtitle, genre, event_date, time_start, time_doors, venue, description, capacity, price_presale, price_door, status, petzi_external_id, last_sync_at, image_url, ticket_sold, revenue, created_at)
VALUES ('evt-2024-002', 'Ama Lou', 'Soul Session', 'R&B / Soul', TO_DATE('2026-03-22', 'YYYY-MM-DD'), '21:00', '20:00', 'QKC', 
'Concert intimiste de la chanteuse britannique Ama Lou, révélation soul de 2025.', 
100, 35.00, 40.00, 'CONFIRMED', NULL, NULL, 
'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800', 
0, 0.00, SYSTIMESTAMP - INTERVAL '15' DAY);

-- Local Fest - DRAFT
INSERT INTO events (id, title, subtitle, genre, event_date, time_start, time_doors, venue, description, capacity, price_presale, price_door, status, petzi_external_id, last_sync_at, image_url, ticket_sold, revenue, created_at)
VALUES ('evt-2024-003', 'Local Fest 2026', 'Edition Printemps', 'Various', TO_DATE('2026-04-12', 'YYYY-MM-DD'), '17:00', '16:00', 'Grande Salle', 
'Festival annuel mettant en avant les talents locaux neuchâtelois.', 
750, 45.00, 55.00, 'DRAFT', NULL, NULL, 
'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800', 
0, 0.00, SYSTIMESTAMP - INTERVAL '5' DAY);

-- Vitalic - SYNCED
INSERT INTO events (id, title, subtitle, genre, event_date, time_start, time_doors, venue, description, capacity, price_presale, price_door, status, petzi_external_id, last_sync_at, image_url, ticket_sold, revenue, created_at)
VALUES ('evt-2024-004', 'Vitalic', 'Live Show', 'Electro', TO_DATE('2026-04-05', 'YYYY-MM-DD'), '22:30', '21:00', 'Grande Salle', 
'Le maître de l''électro française en concert live avec son nouveau show audiovisuel.', 
750, 38.00, 45.00, 'SYNCED', 'petzi-98456', SYSTIMESTAMP - INTERVAL '10' DAY, 
'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800', 
412, 15985.00, SYSTIMESTAMP - INTERVAL '45' DAY);

-- Malik Djoudi - CONFIRMED
INSERT INTO events (id, title, subtitle, genre, event_date, time_start, time_doors, venue, description, capacity, price_presale, price_door, status, petzi_external_id, last_sync_at, image_url, ticket_sold, revenue, created_at)
VALUES ('evt-2024-005', 'Malik Djoudi', 'Intimiste', 'Pop', TO_DATE('2026-04-18', 'YYYY-MM-DD'), '20:30', '19:30', 'Interlope', 
'Concert acoustique du chanteur français Malik Djoudi dans la salle intimiste.', 
80, 28.00, 32.00, 'CONFIRMED', NULL, NULL, 
'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800', 
0, 0.00, SYSTIMESTAMP - INTERVAL '8' DAY);

-- Polo & Pan - SYNCED (SOLD OUT)
INSERT INTO events (id, title, subtitle, genre, event_date, time_start, time_doors, venue, description, capacity, price_presale, price_door, status, petzi_external_id, last_sync_at, image_url, ticket_sold, revenue, created_at)
VALUES ('evt-2024-006', 'Polo & Pan', 'World Tour 2026', 'Electro Pop', TO_DATE('2026-02-28', 'YYYY-MM-DD'), '22:00', '21:00', 'Grande Salle', 
'Le duo français Polo & Pan de retour avec leur univers onirique et tropical.', 
750, 42.00, 50.00, 'SYNCED', 'petzi-97123', SYSTIMESTAMP - INTERVAL '20' DAY, 
'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800', 
750, 31740.00, SYSTIMESTAMP - INTERVAL '60' DAY);

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
-- VENTES - SPFDJ (sample)
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
-- VENTES - Vitalic (sample)
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
-- VENTES - Polo & Pan (sample)
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
-- LOGS DE SYNCHRONISATION (avec JSON détaillé)
-- ============================================
INSERT INTO sync_logs (log_timestamp, log_type, event_id, event_title, status, duration_sec, message, records_synced)
VALUES (SYSTIMESTAMP - INTERVAL '30' DAY, 'SYSTEM', NULL, NULL, 'SUCCESS', 0.12, 
'{"action":"SYSTEM_STARTUP","message":"Connector initialized","database":"Oracle","status":"connected"}', 0);

INSERT INTO sync_logs (log_timestamp, log_type, event_id, event_title, status, duration_sec, message, records_synced)
VALUES (SYSTIMESTAMP - INTERVAL '28' DAY, 'SYNC_EVENT', 'evt-2024-001', 'SPFDJ', 'SUCCESS', 0.85, 
'{"action":"PUSH_TO_PETZI","eventId":"evt-2024-001","petziExternalId":"petzi-98234","title":"SPFDJ","venue":"Grande Salle","date":"2026-03-15","capacity":750,"pricePresale":25.00,"priceDoor":30.00}', 1);

INSERT INTO sync_logs (log_timestamp, log_type, event_id, event_title, status, duration_sec, message, records_synced)
VALUES (SYSTIMESTAMP - INTERVAL '25' DAY, 'FETCH_SALES', 'evt-2024-001', 'SPFDJ', 'SUCCESS', 0.42, 
'{"action":"FETCH_SALES_DATA","eventId":"evt-2024-001","source":"PETZI","ticketsFetched":180,"totalRevenue":4500.00}', 180);

INSERT INTO sync_logs (log_timestamp, log_type, event_id, event_title, status, duration_sec, message, records_synced)
VALUES (SYSTIMESTAMP - INTERVAL '40' DAY, 'SYNC_EVENT', 'evt-2024-004', 'Vitalic', 'SUCCESS', 0.92, 
'{"action":"PUSH_TO_PETZI","eventId":"evt-2024-004","petziExternalId":"petzi-98456","title":"Vitalic","venue":"Grande Salle","date":"2026-04-05","capacity":750,"pricePresale":38.00,"priceDoor":45.00}', 1);

INSERT INTO sync_logs (log_timestamp, log_type, event_id, event_title, status, duration_sec, message, records_synced)
VALUES (SYSTIMESTAMP - INTERVAL '21' DAY, 'FETCH_SALES', 'evt-2024-004', 'Vitalic', 'SUCCESS', 0.51, 
'{"action":"FETCH_SALES_DATA","eventId":"evt-2024-004","source":"PETZI","ticketsFetched":365,"totalRevenue":13870.00}', 365);

INSERT INTO sync_logs (log_timestamp, log_type, event_id, event_title, status, duration_sec, message, records_synced)
VALUES (SYSTIMESTAMP - INTERVAL '55' DAY, 'SYNC_EVENT', 'evt-2024-006', 'Polo & Pan', 'SUCCESS', 0.78, 
'{"action":"PUSH_TO_PETZI","eventId":"evt-2024-006","petziExternalId":"petzi-97123","title":"Polo & Pan","venue":"Grande Salle","date":"2026-02-28","capacity":750,"pricePresale":42.00,"priceDoor":50.00}', 1);

INSERT INTO sync_logs (log_timestamp, log_type, event_id, event_title, status, duration_sec, message, records_synced)
VALUES (SYSTIMESTAMP - INTERVAL '30' DAY, 'FETCH_SALES', 'evt-2024-006', 'Polo & Pan', 'SUCCESS', 0.65, 
'{"action":"FETCH_SALES_DATA","eventId":"evt-2024-006","source":"PETZI","ticketsFetched":750,"status":"SOLD_OUT","totalRevenue":31740.00}', 750);

INSERT INTO sync_logs (log_timestamp, log_type, event_id, event_title, status, duration_sec, message, records_synced)
VALUES (SYSTIMESTAMP - INTERVAL '12' DAY, 'SYNC_EVENT', 'evt-2024-003', 'Local Fest 2026', 'ERROR', 2.30, 
'{"action":"PUSH_TO_PETZI","eventId":"evt-2024-003","error":"VALIDATION_FAILED","reason":"Event status DRAFT not allowed. Must be CONFIRMED before sync."}', 0);

INSERT INTO sync_logs (log_timestamp, log_type, event_id, event_title, status, duration_sec, message, records_synced)
VALUES (SYSTIMESTAMP - INTERVAL '5' DAY, 'WEBHOOK', 'evt-2024-001', 'SPFDJ', 'SUCCESS', 0.08, 
'{"action":"PETZI_WEBHOOK","event":"ticket_created","ticketNumber":"XXXX2941J6SABA","eventId":"evt-2024-001","category":"Prevente","price":{"amount":25.00,"currency":"CHF"},"buyer":{"firstName":"Jean","lastName":"Dupont","postcode":"2000"}}', 1);

INSERT INTO sync_logs (log_timestamp, log_type, event_id, event_title, status, duration_sec, message, records_synced)
VALUES (SYSTIMESTAMP - INTERVAL '4' DAY, 'WEBHOOK', 'evt-2024-001', 'SPFDJ', 'SUCCESS', 0.06, 
'{"action":"PETZI_WEBHOOK","event":"ticket_created","ticketNumber":"XXXX5832K7TBCD","eventId":"evt-2024-001","category":"Prevente","price":{"amount":25.00,"currency":"CHF"},"buyer":{"firstName":"Marie","lastName":"Martin","postcode":"1000"}}', 1);

INSERT INTO sync_logs (log_timestamp, log_type, event_id, event_title, status, duration_sec, message, records_synced)
VALUES (SYSTIMESTAMP - INTERVAL '3' DAY, 'WEBHOOK', 'evt-2024-004', 'Vitalic', 'SUCCESS', 0.07, 
'{"action":"PETZI_WEBHOOK","event":"ticket_created","ticketNumber":"XXXX9921M8VDEF","eventId":"evt-2024-004","category":"Prevente","price":{"amount":38.00,"currency":"CHF"},"buyer":{"firstName":"Pierre","lastName":"Blanc","postcode":"2300"}}', 1);

INSERT INTO sync_logs (log_timestamp, log_type, event_id, event_title, status, duration_sec, message, records_synced)
VALUES (SYSTIMESTAMP - INTERVAL '2' DAY, 'FETCH_SALES', 'evt-2024-001', 'SPFDJ', 'SUCCESS', 0.44, 
'{"action":"FETCH_SALES_DATA","eventId":"evt-2024-001","source":"PETZI","ticketsFetched":523,"totalRevenue":13390.00,"fillRate":"69.7%"}', 523);

INSERT INTO sync_logs (log_timestamp, log_type, event_id, event_title, status, duration_sec, message, records_synced)
VALUES (SYSTIMESTAMP - INTERVAL '1' DAY, 'WEBHOOK', 'evt-2024-001', 'SPFDJ', 'ERROR', 0.02, 
'{"action":"WEBHOOK_ERROR","error":"Invalid signature","rawBodyLength":1024,"timestamp":"2026-02-08T14:30:00"}', 0);

INSERT INTO sync_logs (log_timestamp, log_type, event_id, event_title, status, duration_sec, message, records_synced)
VALUES (SYSTIMESTAMP - INTERVAL '1' HOUR, 'SYSTEM', NULL, NULL, 'SUCCESS', 0.05, 
'{"action":"HEALTH_CHECK","status":"OK","heedsConnection":true,"petziConnection":true,"latency":45}', 0);

COMMIT;

-- ============================================
-- VERIFICATION
-- ============================================
SELECT 'Artists: ' || COUNT(*) AS result FROM artists;
SELECT 'Events: ' || COUNT(*) AS result FROM events;
SELECT 'Event-Artists: ' || COUNT(*) AS result FROM event_artists;
SELECT 'Sales: ' || COUNT(*) AS result FROM sales;
SELECT 'Sync Logs: ' || COUNT(*) AS result FROM sync_logs;
