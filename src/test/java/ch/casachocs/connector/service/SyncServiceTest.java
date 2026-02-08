package ch.casachocs.connector.service;

import ch.casachocs.connector.model.Event;
import ch.casachocs.connector.model.SyncLog;
import ch.casachocs.connector.repository.EventRepository;
import ch.casachocs.connector.repository.SyncLogRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class SyncServiceTest {

    @Autowired
    private SyncService syncService;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private SyncLogRepository syncLogRepository;

    @BeforeEach
    public void setup() {
        // Nettoyer les données de test
        syncLogRepository.deleteAll();
        eventRepository.deleteAll();

        // Créer des événements de test
        Event event1 = Event.builder()
                .id("test-evt-001")
                .name("Test Event 1")
                .date(LocalDate.now())
                .ticketSold(0)
                .revenue(0.0)
                .build();

        Event event2 = Event.builder()
                .id("test-evt-002")
                .name("Test Event 2")
                .date(LocalDate.now().plusDays(7))
                .ticketSold(0)
                .revenue(0.0)
                .build();

        eventRepository.saveAll(Arrays.asList(event1, event2));
    }

    @Test
    public void testSyncEventsToPetzi() {
        // Given
        List<String> eventIds = Arrays.asList("test-evt-001", "test-evt-002");

        // When
        String result = syncService.syncEventsToPetzi(eventIds);

        // Then
        assertNotNull(result);
        assertTrue(result.contains("2 events"));

        List<SyncLog> logs = syncLogRepository.findAll();
        assertEquals(1, logs.size());
        assertEquals("SUCCESS", logs.get(0).getStatus());
        assertEquals(2, logs.get(0).getRecordsSynced());
    }

    @Test
    public void testSyncNonExistentEvent() {
        // Given
        List<String> eventIds = Arrays.asList("non-existent-event");

        // When
        String result = syncService.syncEventsToPetzi(eventIds);

        // Then
        assertNotNull(result);
        assertTrue(result.contains("0 events"));
    }

    @Test
    public void testGetAllSyncLogs() {
        // Given
        syncService.syncEventsToPetzi(Arrays.asList("test-evt-001"));
        syncService.syncEventsToPetzi(Arrays.asList("test-evt-002"));

        // When
        List<SyncLog> logs = syncService.getAllSyncLogs();

        // Then
        assertEquals(2, logs.size());
    }

    @Test
    public void testGetRecentSyncLogs() {
        // Given
        syncService.syncEventsToPetzi(Arrays.asList("test-evt-001"));
        syncService.syncEventsToPetzi(Arrays.asList("test-evt-002"));
        syncService.syncEventsToPetzi(Arrays.asList("test-evt-001", "test-evt-002"));

        // When
        List<SyncLog> recentLogs = syncService.getRecentSyncLogs(2);

        // Then
        assertEquals(2, recentLogs.size());
    }
}