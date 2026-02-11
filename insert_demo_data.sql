-- ============================================
-- Case à Chocs Connector - Demo Data
-- ============================================
-- Données de démonstration pour tester l'application
-- Auto-exécuté par Docker au premier lancement
-- ============================================

-- ===========================================
-- 1. ARTISTES
-- ===========================================
INSERT INTO artists (id, name, genre, country, booking_fee) VALUES
                                                                ('art-001', 'SPFDJ', 'Techno', 'UK', 3500.00),
                                                                ('art-002', 'Ama Lou', 'Soul/R&B', 'UK', 4500.00),
                                                                ('art-003', 'Local Fest Artists', 'Various', 'CH', 8000.00),
                                                                ('art-004', 'Vitalic', 'Electro', 'FR', 12000.00),
                                                                ('art-005', 'Malik Djoudi', 'Pop/Chanson', 'FR', 5500.00),
                                                                ('art-006', 'Polo & Pan', 'Electro/House', 'FR', 15000.00)
    ON CONFLICT (id) DO NOTHING;

-- ===========================================
-- 2. ÉVÉNEMENTS (Attention: plus de colonne artist_id ici)
-- ===========================================
INSERT INTO events (id, title, event_date, time_doors, time_start, venue, capacity, price_presale, price_door, status, petzi_external_id, last_sync_at, created_at, image_url, description, subtitle, genre) VALUES
                                                                                                                                                                                                                 ('evt-2024-001', 'SPFDJ - Techno Night', '2026-03-15', '21:00', '22:00', 'Grande Salle', 750, 25.00, 30.00, 'SYNCED', 'petzi-98234', '2026-02-07 12:10:59', '2026-01-10 12:10:59', 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800', 'Une nuit techno inoubliable avec SPFDJ', 'Techno Night', 'Techno'),
                                                                                                                                                                                                                 ('evt-2024-002', 'Ama Lou - Soul Session', '2026-03-22', '20:00', '21:00', 'QKC', 100, 35.00, 40.00, 'SYNCED', 'petzi-409bc088', '2026-02-09 15:42:33', '2026-01-25 12:10:59', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800', 'Session soul intimiste', 'Soul Session', 'Soul'),
                                                                                                                                                                                                                 ('evt-2024-003', 'Local Fest 2026', '2026-04-12', '16:00', '17:00', 'Grande Salle', 750, 45.00, 55.00, 'DRAFT', NULL, NULL, '2026-02-04 12:10:59', 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800', 'Festival des talents locaux', 'Edition 2026', 'Various'),
                                                                                                                                                                                                                 ('evt-2024-004', 'Vitalic Live', '2026-04-05', '21:00', '22:30', 'Grande Salle', 750, 38.00, 45.00, 'SYNCED', 'petzi-98456', '2026-01-30 12:10:59', '2025-12-26 12:10:59', 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800', 'Vitalic en live - tournée 2026', 'Live Show', 'Electro'),
                                                                                                                                                                                                                 ('evt-2024-005', 'Malik Djoudi - Intimiste', '2026-04-18', '19:30', '20:30', 'Interlope', 80, 28.00, 32.00, 'CONFIRMED', NULL, NULL, '2026-02-01 12:10:59', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800', 'Concert intimiste de Malik Djoudi', 'Intimiste', 'Pop'),
                                                                                                                                                                                                                 ('evt-2024-006', 'Polo & Pan', '2026-02-28', '21:00', '22:00', 'Grande Salle', 750, 42.00, 50.00, 'SYNCED', 'petzi-97123', '2026-01-20 12:10:59', '2025-12-11 12:10:59', 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800', 'Le duo français en concert', 'World Tour', 'Electro')
    ON CONFLICT (id) DO NOTHING;

-- ===========================================
-- 3. LIAISON ÉVÉNEMENTS - ARTISTES (NOUVEAU)
-- ===========================================
INSERT INTO event_artists (event_id, artist_id, display_order) VALUES
                                                                   ('evt-2024-001', 'art-001', 1), -- SPFDJ
                                                                   ('evt-2024-002', 'art-002', 1), -- Ama Lou
                                                                   ('evt-2024-003', 'art-003', 1), -- Local Fest
                                                                   ('evt-2024-004', 'art-004', 1), -- Vitalic
                                                                   ('evt-2024-005', 'art-005', 1), -- Malik Djoudi
                                                                   ('evt-2024-006', 'art-006', 1)  -- Polo & Pan
    ON CONFLICT (event_id, artist_id) DO NOTHING;

-- ===========================================
-- 4. VENTES - Polo & Pan (evt-2024-006)
-- ===========================================
INSERT INTO sales (id, event_id, category, quantity, unit_price, total_amount, buyer_location, sale_date) VALUES
                                                                                                              ('sale-polo-1', 'evt-2024-006', 'Prélocation', 1, 42.00, 42.00, '2316', '2026-01-23 08:08:45'),
                                                                                                              ('sale-polo-2', 'evt-2024-006', 'Prélocation', 2, 42.00, 84.00, '2300', '2026-01-23 13:47:30'),
                                                                                                              ('sale-polo-3', 'evt-2024-006', 'Prélocation', 1, 42.00, 42.00, '2037', '2026-01-23 13:50:18'),
                                                                                                              ('sale-polo-4', 'evt-2024-006', 'VIP', 2, 42.00, 84.00, '2502', '2026-01-20 09:19:03'),
                                                                                                              ('sale-polo-5', 'evt-2024-006', 'Prélocation', 2, 42.00, 84.00, '1400', '2026-01-19 17:46:24'),
                                                                                                              ('sale-polo-6', 'evt-2024-006', 'Prélocation', 1, 42.00, 42.00, '2400', '2026-01-24 04:46:05'),
                                                                                                              ('sale-polo-7', 'evt-2024-006', 'Prélocation', 1, 42.00, 42.00, '1200', '2026-01-20 15:59:41'),
                                                                                                              ('sale-polo-8', 'evt-2024-006', 'Prélocation', 2, 42.00, 84.00, '2000', '2026-01-23 19:45:06'),
                                                                                                              ('sale-polo-9', 'evt-2024-006', 'Prélocation', 2, 42.00, 84.00, '2000', '2026-01-18 15:23:33'),
                                                                                                              ('sale-polo-10', 'evt-2024-006', 'Prélocation', 1, 42.00, 42.00, '2300', '2026-01-21 06:35:30'),
                                                                                                              ('sale-polo-11', 'evt-2024-006', 'VIP', 2, 42.00, 84.00, '2000', '2026-01-22 15:19:32'),
                                                                                                              ('sale-polo-12', 'evt-2024-006', 'Prélocation', 1, 42.00, 42.00, '2034', '2026-01-19 05:43:03'),
                                                                                                              ('sale-polo-13', 'evt-2024-006', 'Prélocation', 2, 42.00, 84.00, '2300', '2026-01-18 14:44:30'),
                                                                                                              ('sale-polo-14', 'evt-2024-006', 'Prélocation', 1, 42.00, 42.00, '1200', '2026-01-24 00:39:45'),
                                                                                                              ('sale-polo-15', 'evt-2024-006', 'VIP', 1, 42.00, 42.00, '1200', '2026-01-23 14:53:30'),
                                                                                                              ('sale-polo-16', 'evt-2024-006', 'Prélocation', 1, 42.00, 42.00, '2000', '2026-01-23 19:17:07'),
                                                                                                              ('sale-polo-17', 'evt-2024-006', 'VIP', 1, 42.00, 42.00, '2502', '2026-01-20 19:57:23'),
                                                                                                              ('sale-polo-18', 'evt-2024-006', 'VIP', 1, 42.00, 42.00, '2000', '2026-01-22 01:45:50'),
                                                                                                              ('sale-polo-19', 'evt-2024-006', 'Prélocation', 1, 42.00, 42.00, '1400', '2026-01-21 22:55:15'),
                                                                                                              ('sale-polo-20', 'evt-2024-006', 'VIP', 1, 42.00, 42.00, '1200', '2026-01-21 05:50:30'),
                                                                                                              ('sale-polo-21', 'evt-2024-006', 'VIP', 1, 42.00, 42.00, '2300', '2026-01-21 12:26:25'),
                                                                                                              ('sale-polo-22', 'evt-2024-006', 'VIP', 1, 42.00, 42.00, '1400', '2026-01-19 22:01:15'),
                                                                                                              ('sale-polo-23', 'evt-2024-006', 'Prélocation', 1, 42.00, 42.00, '1200', '2026-01-22 16:12:55'),
                                                                                                              ('sale-polo-24', 'evt-2024-006', 'VIP', 1, 42.00, 42.00, '2000', '2026-01-21 16:13:01'),
                                                                                                              ('sale-polo-25', 'evt-2024-006', 'Prélocation', 2, 42.00, 84.00, '2400', '2026-01-18 10:18:53'),
                                                                                                              ('sale-polo-26', 'evt-2024-006', 'Prélocation', 2, 42.00, 84.00, '1400', '2026-01-18 03:54:00'),
                                                                                                              ('sale-polo-27', 'evt-2024-006', 'Prélocation', 1, 42.00, 42.00, '1000', '2026-01-21 12:29:29'),
                                                                                                              ('sale-polo-28', 'evt-2024-006', 'Prélocation', 2, 42.00, 84.00, '2300', '2026-01-20 05:07:39'),
                                                                                                              ('sale-polo-29', 'evt-2024-006', 'Prélocation', 1, 42.00, 42.00, '1700', '2026-01-21 01:14:12'),
                                                                                                              ('sale-polo-30', 'evt-2024-006', 'VIP', 1, 42.00, 42.00, '1700', '2026-01-22 02:25:13')
    ON CONFLICT (id) DO NOTHING;

-- ===========================================
-- 5. VENTES - SPFDJ (evt-2024-001)
-- ===========================================
INSERT INTO sales (id, event_id, category, quantity, unit_price, total_amount, buyer_location, sale_date) VALUES
                                                                                                              ('sale-spfdj-1', 'evt-2024-001', 'Prélocation', 2, 25.00, 50.00, '2000', '2026-02-01 10:15:00'),
                                                                                                              ('sale-spfdj-2', 'evt-2024-001', 'Prélocation', 1, 25.00, 25.00, '2037', '2026-02-01 14:30:00'),
                                                                                                              ('sale-spfdj-3', 'evt-2024-001', 'VIP', 2, 25.00, 50.00, '1200', '2026-02-02 09:45:00'),
                                                                                                              ('sale-spfdj-4', 'evt-2024-001', 'Prélocation', 1, 25.00, 25.00, '2300', '2026-02-02 16:20:00'),
                                                                                                              ('sale-spfdj-5', 'evt-2024-001', 'Prélocation', 3, 25.00, 75.00, '3006', '2026-02-03 11:00:00'),
                                                                                                              ('sale-spfdj-6', 'evt-2024-001', 'VIP', 1, 25.00, 25.00, '2000', '2026-02-03 19:30:00'),
                                                                                                              ('sale-spfdj-7', 'evt-2024-001', 'Prélocation', 2, 25.00, 50.00, '1400', '2026-02-04 08:15:00'),
                                                                                                              ('sale-spfdj-8', 'evt-2024-001', 'Prélocation', 1, 25.00, 25.00, '2034', '2026-02-04 12:45:00'),
                                                                                                              ('sale-spfdj-9', 'evt-2024-001', 'Prélocation', 2, 25.00, 50.00, '1012', '2026-02-05 15:00:00'),
                                                                                                              ('sale-spfdj-10', 'evt-2024-001', 'VIP', 1, 25.00, 25.00, '1700', '2026-02-05 20:30:00'),
                                                                                                              ('sale-spfdj-11', 'evt-2024-001', 'Prélocation', 1, 25.00, 25.00, '2502', '2026-02-06 09:00:00'),
                                                                                                              ('sale-spfdj-12', 'evt-2024-001', 'Prélocation', 2, 25.00, 50.00, '2000', '2026-02-06 14:15:00'),
                                                                                                              ('sale-spfdj-13', 'evt-2024-001', 'Prélocation', 1, 25.00, 25.00, '1200', '2026-02-07 10:30:00'),
                                                                                                              ('sale-spfdj-14', 'evt-2024-001', 'VIP', 2, 25.00, 50.00, '2300', '2026-02-07 17:45:00'),
                                                                                                              ('sale-spfdj-15', 'evt-2024-001', 'Prélocation', 1, 25.00, 25.00, '3006', '2026-02-08 11:20:00')
    ON CONFLICT (id) DO NOTHING;

-- ===========================================
-- 6. VENTES - Ama Lou (evt-2024-002)
-- ===========================================
INSERT INTO sales (id, event_id, category, quantity, unit_price, total_amount, buyer_location, sale_date) VALUES
                                                                                                              ('sale-ama-1', 'evt-2024-002', 'Prélocation', 2, 35.00, 70.00, '2000', '2026-02-01 09:00:00'),
                                                                                                              ('sale-ama-2', 'evt-2024-002', 'Prélocation', 1, 35.00, 35.00, '1008', '2026-02-02 11:30:00'),
                                                                                                              ('sale-ama-3', 'evt-2024-002', 'VIP', 2, 35.00, 70.00, '1200', '2026-02-03 14:00:00'),
                                                                                                              ('sale-ama-4', 'evt-2024-002', 'Prélocation', 1, 35.00, 35.00, '2300', '2026-02-04 10:15:00'),
                                                                                                              ('sale-ama-5', 'evt-2024-002', 'Prélocation', 2, 35.00, 70.00, '2000', '2026-02-05 16:45:00'),
                                                                                                              ('sale-ama-6', 'evt-2024-002', 'VIP', 1, 35.00, 35.00, '1400', '2026-02-06 12:30:00'),
                                                                                                              ('sale-ama-7', 'evt-2024-002', 'Prélocation', 1, 35.00, 35.00, '2034', '2026-02-07 09:45:00'),
                                                                                                              ('sale-ama-8', 'evt-2024-002', 'Prélocation', 2, 35.00, 70.00, '1213', '2026-02-08 15:00:00')
    ON CONFLICT (id) DO NOTHING;

-- ===========================================
-- 7. VENTES - Vitalic (evt-2024-004)
-- ===========================================
INSERT INTO sales (id, event_id, category, quantity, unit_price, total_amount, buyer_location, sale_date) VALUES
                                                                                                              ('sale-vitalic-1', 'evt-2024-004', 'Prélocation', 2, 38.00, 76.00, '2000', '2026-01-15 10:00:00'),
                                                                                                              ('sale-vitalic-2', 'evt-2024-004', 'Prélocation', 1, 38.00, 38.00, '1213', '2026-01-16 14:30:00'),
                                                                                                              ('sale-vitalic-3', 'evt-2024-004', 'VIP', 2, 38.00, 76.00, '1200', '2026-01-17 09:15:00'),
                                                                                                              ('sale-vitalic-4', 'evt-2024-004', 'Prélocation', 3, 38.00, 114.00, '2300', '2026-01-18 16:00:00'),
                                                                                                              ('sale-vitalic-5', 'evt-2024-004', 'Prélocation', 1, 38.00, 38.00, '3006', '2026-01-19 11:45:00'),
                                                                                                              ('sale-vitalic-6', 'evt-2024-004', 'VIP', 1, 38.00, 38.00, '2000', '2026-01-20 19:00:00'),
                                                                                                              ('sale-vitalic-7', 'evt-2024-004', 'Prélocation', 2, 38.00, 76.00, '1400', '2026-01-21 08:30:00'),
                                                                                                              ('sale-vitalic-8', 'evt-2024-004', 'Prélocation', 1, 38.00, 38.00, '2034', '2026-01-22 13:15:00'),
                                                                                                              ('sale-vitalic-9', 'evt-2024-004', 'Prélocation', 2, 38.00, 76.00, '2400', '2026-01-23 10:45:00'),
                                                                                                              ('sale-vitalic-10', 'evt-2024-004', 'VIP', 2, 38.00, 76.00, '1700', '2026-01-24 15:30:00'),
                                                                                                              ('sale-vitalic-11', 'evt-2024-004', 'Prélocation', 1, 38.00, 38.00, '2502', '2026-01-25 09:00:00'),
                                                                                                              ('sale-vitalic-12', 'evt-2024-004', 'Prélocation', 2, 38.00, 76.00, '2000', '2026-01-26 14:00:00')
    ON CONFLICT (id) DO NOTHING;

-- ===========================================
-- 8. LOGS DE SYNCHRONISATION
-- ===========================================
INSERT INTO sync_logs (log_timestamp, log_type, event_id, event_title, status, duration_sec, message, records_synced, json_details) VALUES
                                                                                                                                        ('2026-02-07 12:10:59', 'SYNC_EVENT', 'evt-2024-001', 'SPFDJ - Techno Night', 'SUCCESS', 0.245, 'Event synchronized to PETZI', 1, '{"action":"PUSH_TO_PETZI","eventId":"evt-2024-001","petziExternalId":"petzi-98234"}'),
                                                                                                                                        ('2026-02-09 15:42:33', 'SYNC_EVENT', 'evt-2024-002', 'Ama Lou - Soul Session', 'SUCCESS', 0.312, 'Event synchronized to PETZI', 1, '{"action":"PUSH_TO_PETZI","eventId":"evt-2024-002","petziExternalId":"petzi-409bc088"}'),
                                                                                                                                        ('2026-01-30 12:10:59', 'SYNC_EVENT', 'evt-2024-004', 'Vitalic Live', 'SUCCESS', 0.198, 'Event synchronized to PETZI', 1, '{"action":"PUSH_TO_PETZI","eventId":"evt-2024-004","petziExternalId":"petzi-98456"}'),
                                                                                                                                        ('2026-01-20 12:10:59', 'SYNC_EVENT', 'evt-2024-006', 'Polo & Pan', 'SUCCESS', 0.267, 'Event synchronized to PETZI', 1, '{"action":"PUSH_TO_PETZI","eventId":"evt-2024-006","petziExternalId":"petzi-97123"}'),
                                                                                                                                        ('2026-02-09 15:31:43', 'WEBHOOK', 'petzi-54694', 'Test To Delete', 'SUCCESS', 0.289, '18698', 1, NULL),
                                                                                                                                        ('2026-02-09 15:33:01', 'WEBHOOK', 'petzi-54694', 'Test To Delete', 'SUCCESS', 0.221, '18699', 1, NULL)
    ON CONFLICT DO NOTHING;

-- ============================================
-- Données de démonstration insérées !
-- ============================================