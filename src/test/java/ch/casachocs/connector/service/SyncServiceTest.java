package ch.casachocs.connector.service;

import ch.casachocs.connector.model.Event;
import ch.casachocs.connector.model.enums.EventStatus;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class SyncServiceTest {
    
    @Autowired
    private SyncService syncService;
    
    @Test
    void syncEvent_shouldChangeStatusToSynced() {
        // Given a known confirmed event from mock repo
        String eventId = "evt-2024-002"; // ANTIGONE - CONFIRMED
        
        // When
        Event result = syncService.syncEvent(eventId);
        
        // Then
        assertThat(result.getStatus()).isEqualTo(EventStatus.SYNCED);
        assertThat(result.getPetziExternalId()).isNotNull();
        assertThat(result.getLastSyncAt()).isNotNull();
    }
}