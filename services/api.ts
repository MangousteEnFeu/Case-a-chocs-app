import { HeedsEvent, SalesReport, SyncLog, SystemHealth, EventStatus } from '../types';
import { MOCK_EVENTS, MOCK_SALES_REPORT } from '../constants';

// --- MOCK STATE MANAGEMENT ---
let localEvents = [...MOCK_EVENTS];

// Initialisation des logs en mémoire pour qu'ils persistent entre les pages
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
    await simulateDelay(600); // Simulation latence réseau
    
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

    // Mise à jour de l'état mocké
    const updatedEvent = {
        ...event,
        status: EventStatus.SYNCED,
        petziExternalId: event.petziExternalId || `petzi-mock-${Math.floor(Math.random() * 9999)}`,
        lastSyncAt: new Date().toISOString()
    };

    localEvents[index] = updatedEvent;

    // Ajout du log dynamique
    const newLog: SyncLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'SYNC_EVENT',
        eventId: updatedEvent.id,
        eventTitle: updatedEvent.title,
        status: 'SUCCESS',
        duration: 1.1, // Simulation temps
        details: `Manual sync: Event ${updatedEvent.title} pushed to PETZI successfully.`
    };
    localLogs.unshift(newLog); // Ajout au début de la liste

    return updatedEvent;
  },

  syncAll: async (): Promise<HeedsEvent[]> => {
    await simulateDelay(1500);
    
    let count = 0;
    // Simule la synchro de tous les événements CONFIRMED
    localEvents = localEvents.map(e => {
        if (e.status === EventStatus.CONFIRMED) {
            count++;
            return {
                ...e,
                status: EventStatus.SYNCED,
                petziExternalId: e.petziExternalId || `petzi-mock-${Math.floor(Math.random() * 9999)}`,
                lastSyncAt: new Date().toISOString()
            };
        }
        return e;
    });

    if (count > 0) {
        // Ajout du log de batch
        const newLog: SyncLog = {
            id: `log-batch-${Date.now()}`,
            timestamp: new Date().toISOString(),
            type: 'SYNC_EVENT',
            status: 'SUCCESS',
            duration: 2.4,
            details: `Batch sync executed: ${count} events pushed to PETZI.`
        };
        localLogs.unshift(newLog);
    }

    return [...localEvents];
  },

  // --- SALES ---

  getSalesReport: async (eventId: string): Promise<SalesReport> => {
    await simulateDelay(800);
    
    // Si on a un rapport mocké spécifique pour cet ID, on le retourne
    const report = MOCK_SALES_REPORT[eventId];
    if (report) return report;

    // Sinon, on génère un rapport vide ou générique pour éviter le crash
    // Basé sur le premier rapport mock disponible
    const baseReport = Object.values(MOCK_SALES_REPORT)[0];
    const event = localEvents.find(e => e.id === eventId);
    
    return {
        ...baseReport,
        eventId: eventId,
        eventTitle: event?.title || "Unknown Event",
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