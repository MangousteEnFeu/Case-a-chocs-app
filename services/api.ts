import { HeedsEvent, SalesReport, SyncLog, SystemHealth, EventStatus } from '../types';
import { MOCK_EVENTS, MOCK_SALES_REPORT } from '../constants';

// --- MOCK STATE MANAGEMENT ---
// We keep these in memory so they persist while the app is running (without page reload)
let localEvents = [...MOCK_EVENTS];

let localLogs: SyncLog[] = [
    {
        id: "log-mock-001",
        timestamp: new Date().toISOString(),
        type: 'SYSTEM',
        status: 'SUCCESS',
        duration: 0.1,
        details: "Mock API System Initialized"
    },
    {
        id: "log-mock-002",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        type: 'FETCH_SALES',
        eventId: 'evt-2024-001',
        eventTitle: 'Concert SPFDJ',
        status: 'SUCCESS',
        duration: 0.45,
        details: "Auto-fetch sales complete"
    },
    {
        id: "log-mock-003",
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        type: 'SYNC_EVENT',
        eventId: 'evt-2024-003',
        eventTitle: 'Local Fest',
        status: 'ERROR',
        duration: 1.2,
        details: "Connection refused by PETZI (Simulation)"
    }
];

const simulateDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // --- EVENTS ---

  getEvents: async (status?: string): Promise<HeedsEvent[]> => {
    await simulateDelay(600); // Network latency simulation
    
    if (status && status !== 'ALL') {
      return localEvents.filter(e => e.status === status);
    }
    return [...localEvents];
  },

  getEvent: async (id: string): Promise<HeedsEvent> => {
    await simulateDelay(300);
    const event = localEvents.find(e => e.id === id);
    if (!event) throw new Error("Event not found");
    return event;
  },

  // --- SYNC ---

  syncEvent: async (id: string): Promise<HeedsEvent> => {
    await simulateDelay(1000); 
    
    const index = localEvents.findIndex(e => e.id === id);
    if (index === -1) throw new Error("Event not found");

    const event = localEvents[index];

    // Update mock state
    const updatedEvent = {
        ...event,
        status: EventStatus.SYNCED,
        petziExternalId: event.petziExternalId || `petzi-mock-${Math.floor(Math.random() * 9999)}`,
        lastSyncAt: new Date().toISOString()
    };

    localEvents[index] = updatedEvent;

    // Generate dynamic log
    const newLog: SyncLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'SYNC_EVENT',
        eventId: updatedEvent.id,
        eventTitle: updatedEvent.title,
        status: 'SUCCESS',
        duration: 0.8,
        details: `Manual sync: Event ${updatedEvent.title} pushed to PETZI successfully.`
    };
    localLogs.unshift(newLog);

    return updatedEvent;
  },

  syncAll: async (): Promise<HeedsEvent[]> => {
    await simulateDelay(2000); // Longer delay for batch
    
    let syncedCount = 0;
    
    // Update all CONFIRMED events to SYNCED
    localEvents = localEvents.map(e => {
        if (e.status === EventStatus.CONFIRMED) {
            syncedCount++;
            return {
                ...e,
                status: EventStatus.SYNCED,
                petziExternalId: e.petziExternalId || `petzi-mock-${Math.floor(Math.random() * 9999)}`,
                lastSyncAt: new Date().toISOString()
            };
        }
        return e;
    });

    if (syncedCount > 0) {
        // Generate batch log
        const newLog: SyncLog = {
            id: `log-batch-${Date.now()}`,
            timestamp: new Date().toISOString(),
            type: 'SYNC_EVENT',
            status: 'SUCCESS',
            duration: 2.5,
            details: `Batch operation: Synced ${syncedCount} CONFIRMED events to PETZI.`
        };
        localLogs.unshift(newLog);
    }

    return [...localEvents];
  },

  // --- SALES ---

  getSalesReport: async (eventId: string): Promise<SalesReport> => {
    await simulateDelay(800);
    
    // Return specific mock report if exists
    const report = MOCK_SALES_REPORT[eventId];
    if (report) return report;

    // Otherwise return empty report structure to prevent crash
    const event = localEvents.find(e => e.id === eventId);
    return {
        eventId: eventId,
        eventTitle: event?.title || "Unknown",
        eventDate: event?.date || "",
        venue: event?.venue || "",
        capacity: event?.capacity || 0,
        totalSold: 0,
        totalRevenue: 0,
        fillRate: 0,
        salesByCategory: [
            { category: "Prévente", sold: 0, revenue: 0 },
            { category: "Sur place", sold: 0, revenue: 0 }
        ],
        salesByDay: [],
        buyerLocations: [],
        lastUpdated: new Date().toISOString()
    };
  },

  // --- LOGS ---

  getLogs: async (type?: string): Promise<SyncLog[]> => {
    await simulateDelay(500);
    
    if (type && type !== 'ALL') {
        return localLogs.filter(l => l.type === type);
    }
    return [...localLogs];
  },

  // --- SYSTEM ---

  checkHealth: async (): Promise<SystemHealth> => {
    await simulateDelay(300);
    return {
        status: 'UP',
        heedsConnection: true,
        petziConnection: true,
        latency: 24 // ms
    };
  },
};