import { HeedsEvent, SalesReport, SyncLog, EventStatus, Venue } from '../types';

// --- MOCK DATA GENERATORS ---

const generateSalesCurve = (days: number, totalExpected: number) => {
  const data = [];
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    
    // Non-linear random distribution (more sales closer to date)
    const weight = Math.pow((days - i + 1) / days, 3); 
    const daily = Math.floor(Math.random() * (totalExpected / days) * weight * 2);
    
    data.push({
      date: d.toISOString().split('T')[0],
      sold: Math.max(0, daily)
    });
  }
  return data;
};

// Initial Mock Data
let MOCK_EVENTS: HeedsEvent[] = [
  {
    id: "evt-2024-001",
    title: "Concert SPFDJ",
    date: "2024-06-15",
    timeStart: "23:00",
    timeDoors: "22:00",
    venue: Venue.GRANDE_SALLE,
    description: "Raw techno energy from Berlin.",
    artists: [{ name: "SPFDJ", genre: "Techno" }],
    pricing: { presale: 25.00, door: 30.00 },
    capacity: 750,
    status: EventStatus.SYNCED,
    petziExternalId: "petzi-8832",
    lastSyncAt: new Date().toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "evt-2024-002",
    title: "Antigone Live",
    date: "2024-06-22",
    timeStart: "22:00",
    timeDoors: "21:00",
    venue: Venue.QKC,
    description: "Live modular journey.",
    artists: [{ name: "Antigone", genre: "Electro" }],
    pricing: { presale: 15.00, door: 20.00 },
    capacity: 100,
    status: EventStatus.CONFIRMED,
    imageUrl: "https://images.unsplash.com/photo-1514525253440-b393452e8d26?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "evt-2024-003",
    title: "Local Fest",
    date: "2024-06-29",
    timeStart: "18:00",
    timeDoors: "17:00",
    venue: Venue.GRANDE_SALLE,
    description: "Support your local scene.",
    artists: [{ name: "Various", genre: "Rock/Pop" }],
    pricing: { presale: 10.00, door: 15.00 },
    capacity: 750,
    status: EventStatus.DRAFT,
    imageUrl: "https://images.unsplash.com/photo-1501612780327-45045538702b?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "evt-2024-004",
    title: "Soirée Jazz",
    date: "2024-07-05",
    timeStart: "20:30",
    timeDoors: "20:00",
    venue: Venue.INTERLOPE,
    description: "Smooth jazz vibes overlooking the lake.",
    artists: [{ name: "Trio Neuch", genre: "Jazz" }],
    pricing: { presale: 20.00, door: 25.00 },
    capacity: 80,
    status: EventStatus.CONFIRMED,
    imageUrl: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=800&auto=format&fit=crop"
  }
];

let MOCK_LOGS: SyncLog[] = [
  {
    id: "log-002",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    type: "FETCH_SALES",
    eventId: "evt-2024-001",
    eventTitle: "Concert SPFDJ",
    status: "SUCCESS",
    duration: 0.8,
    details: "Fetched 523 sales records from PETZI API."
  },
  {
    id: "log-001",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    type: "SYNC_EVENT",
    eventId: "evt-2024-001",
    eventTitle: "Concert SPFDJ",
    status: "SUCCESS",
    duration: 1.2,
    details: "Event synced to PETZI. Updated pricing categories."
  }
];

// Helper to simulate network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- API IMPLEMENTATION ---

export const api = {
  // Events
  getEvents: async (): Promise<HeedsEvent[]> => {
    await delay(600);
    return [...MOCK_EVENTS];
  },

  getEvent: async (id: string): Promise<HeedsEvent | undefined> => {
    await delay(300);
    return MOCK_EVENTS.find(e => e.id === id);
  },

  // Sync
  syncEvent: async (id: string): Promise<HeedsEvent> => {
    await delay(1500); // Simulate processing
    const eventIndex = MOCK_EVENTS.findIndex(e => e.id === id);
    if (eventIndex === -1) throw new Error("Event not found");

    const updatedEvent = {
      ...MOCK_EVENTS[eventIndex],
      status: EventStatus.SYNCED,
      petziExternalId: MOCK_EVENTS[eventIndex].petziExternalId || `petzi-${Math.floor(Math.random() * 10000)}`,
      lastSyncAt: new Date().toISOString()
    };
    
    MOCK_EVENTS[eventIndex] = updatedEvent;
    
    // Add Log
    const newLog: SyncLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'SYNC_EVENT',
      eventId: updatedEvent.id,
      eventTitle: updatedEvent.title,
      status: 'SUCCESS',
      duration: 1.4,
      details: 'Manual synchronization triggered. Event pushed to PETZI.'
    };
    MOCK_LOGS.unshift(newLog);

    return updatedEvent;
  },

  // Sales
  getSalesReport: async (eventId: string): Promise<SalesReport> => {
    await delay(800);
    const event = MOCK_EVENTS.find(e => e.id === eventId);
    if (!event) throw new Error("Event not found");

    // Generate dynamic report based on event capacity
    const totalSold = Math.floor(event.capacity * (event.id === 'evt-2024-001' ? 0.72 : 0.4));
    const presaleCount = Math.floor(totalSold * 0.9);
    const doorCount = totalSold - presaleCount;
    
    return {
      eventId: event.id,
      eventTitle: event.title,
      eventDate: event.date,
      venue: event.venue,
      capacity: event.capacity,
      totalSold: totalSold,
      totalRevenue: (presaleCount * event.pricing.presale) + (doorCount * event.pricing.door),
      fillRate: (totalSold / event.capacity) * 100,
      salesByCategory: [
        { category: "Prévente", sold: presaleCount, revenue: presaleCount * event.pricing.presale },
        { category: "Sur place", sold: doorCount, revenue: doorCount * event.pricing.door }
      ],
      salesByDay: generateSalesCurve(30, totalSold),
      buyerLocations: [
        { city: "Neuchâtel", count: Math.floor(totalSold * 0.45) },
        { city: "La Chaux-de-Fonds", count: Math.floor(totalSold * 0.2) },
        { city: "Bienne", count: Math.floor(totalSold * 0.15) },
        { city: "Yverdon", count: Math.floor(totalSold * 0.1) },
        { city: "Autres", count: Math.floor(totalSold * 0.1) }
      ],
      lastUpdated: new Date().toISOString()
    };
  },

  // Logs
  getLogs: async (filter?: string): Promise<SyncLog[]> => {
    await delay(400);
    if (filter && filter !== 'ALL') {
      return MOCK_LOGS.filter(l => l.type === filter);
    }
    return [...MOCK_LOGS];
  },

  // Health
  checkHealth: async () => {
    await delay(200);
    return {
      status: 'UP',
      heedsConnection: true,
      petziConnection: true,
      latency: 45
    };
  }
};