import { HeedsEvent, Venue, EventStatus, SalesReport } from './types';

export const APP_NAME = "HEEDS ↔ PETZI Connector";

export const MOCK_EVENTS: HeedsEvent[] = [
  {
    id: "evt-2024-001",
    title: "Concert SPFDJ",
    date: "2024-06-15",
    timeStart: "21:00",
    timeDoors: "20:30",
    venue: Venue.GRANDE_SALLE,
    description: "Soirée techno avec SPFDJ...",
    artists: [{ name: "SPFDJ", genre: "Techno" }],
    pricing: { presale: 25.00, door: 30.00 },
    capacity: 750,
    status: EventStatus.SYNCED,
    petziExternalId: "petzi-evt-8832"
  },
  {
    id: "evt-2024-002",
    title: "Antigone Live",
    date: "2024-06-22",
    timeStart: "22:00",
    timeDoors: "21:00",
    venue: Venue.QKC,
    description: "Live modular set by Antigone.",
    artists: [{ name: "Antigone", genre: "Electro" }],
    pricing: { presale: 15.00, door: 20.00 },
    capacity: 100,
    status: EventStatus.CONFIRMED
  },
  {
    id: "evt-2024-003",
    title: "Local Fest",
    date: "2024-06-29",
    timeStart: "18:00",
    timeDoors: "17:00",
    venue: Venue.GRANDE_SALLE,
    description: "Support local bands night.",
    artists: [{ name: "Various", genre: "Rock/Pop" }],
    pricing: { presale: 10.00, door: 15.00 },
    capacity: 750,
    status: EventStatus.DRAFT
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
    status: EventStatus.CONFIRMED
  },
  {
    id: "evt-2024-005",
    title: "LOTO ALTERNO",
    date: "2024-07-12",
    timeStart: "19:00",
    timeDoors: "18:00",
    venue: Venue.GRANDE_SALLE,
    description: "Drag Bingo Fundraiser pour des œuvres caritatives locales.",
    artists: [{ name: "Various", genre: "Event" }],
    pricing: { presale: 15.00, door: 20.00 },
    capacity: 400,
    status: EventStatus.SYNCED,
    petziExternalId: "petzi-evt-9901"
  }
];

// Helper pour générer des dates passées
const getPastDate = (baseDateStr: string, daysAgo: number) => {
    const d = new Date(baseDateStr);
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString().split('T')[0];
};

export const MOCK_SALES_REPORT: Record<string, SalesReport> = {
  "evt-2024-001": {
    eventId: "evt-2024-001",
    eventTitle: "Concert SPFDJ",
    eventDate: "2024-06-15",
    venue: "Grande Salle",
    capacity: 750,
    totalSold: 523,
    totalRevenue: 13075.00,
    fillRate: 69.7,
    salesByCategory: [
      { category: "Prévente", sold: 485, revenue: 12125.00 },
      { category: "Sur place", sold: 38, revenue: 950.00 }
    ],
    salesByDay: Array.from({ length: 30 }, (_, i) => ({
      date: getPastDate("2024-06-15", 30 - i),
      sold: Math.floor(Math.sin(i) * 10 + 15) // Simple wave
    })),
    buyerLocations: [
      { city: "Neuchâtel", count: 234 },
      { city: "La Chaux-de-Fonds", count: 89 },
      { city: "Bienne", count: 67 },
      { city: "Yverdon", count: 45 },
      { city: "Lausanne", count: 32 }
    ],
    lastUpdated: "2024-06-16T09:00:00Z"
  },
  "evt-2024-002": {
    eventId: "evt-2024-002",
    eventTitle: "Antigone Live",
    eventDate: "2024-06-22",
    venue: "QKC",
    capacity: 100,
    totalSold: 85,
    totalRevenue: 1350.00,
    fillRate: 85.0,
    salesByCategory: [
      { category: "Prévente", sold: 70, revenue: 1050.00 },
      { category: "Sur place", sold: 15, revenue: 300.00 }
    ],
    salesByDay: Array.from({ length: 20 }, (_, i) => ({
      date: getPastDate("2024-06-22", 20 - i),
      sold: i % 3 === 0 ? 8 : 2
    })),
    buyerLocations: [
      { city: "Neuchâtel", count: 50 },
      { city: "Bern", count: 20 },
      { city: "Zurich", count: 15 }
    ],
    lastUpdated: "2024-06-23T09:00:00Z"
  },
  "evt-2024-004": {
    eventId: "evt-2024-004",
    eventTitle: "Soirée Jazz",
    eventDate: "2024-07-05",
    venue: "Interlope",
    capacity: 80,
    totalSold: 55,
    totalRevenue: 1150.00, // 45 * 20 + 10 * 25
    fillRate: 68.75,
    salesByCategory: [
      { category: "Prévente", sold: 45, revenue: 900.00 },
      { category: "Sur place", sold: 10, revenue: 250.00 }
    ],
    // Courbe lente et progressive, petites ventes journalières
    salesByDay: [0,0,1,0,1,1,2,1,2,2,1,2,3,2,1,2,3,2,1,0,1,2,3,4,5,2,1,0,5,5].map((val, i) => ({
        date: getPastDate("2024-07-05", 30 - i),
        sold: val
    })),
    buyerLocations: [
      { city: "Neuchâtel", count: 40 },
      { city: "La Chaux-de-Fonds", count: 10 },
      { city: "Yverdon", count: 5 }
    ],
    lastUpdated: "2024-07-06T10:00:00Z"
  },
  "evt-2024-005": {
    eventId: "evt-2024-005",
    eventTitle: "LOTO ALTERNO",
    eventDate: "2024-07-12",
    venue: "Grande Salle",
    capacity: 400,
    totalSold: 280,
    totalRevenue: 4350.00, // 250 * 15 + 30 * 20
    fillRate: 70.0,
    salesByCategory: [
      { category: "Prévente", sold: 250, revenue: 3750.00 },
      { category: "Sur place", sold: 30, revenue: 600.00 }
    ],
    // Courbe type "Hype" : Fort au début, plat au milieu, fort à la fin
    salesByDay: [25,20,15,10,8,6,5,5,4,5,6,5,8,10,12,12,10,8,10,12,15,15,18,20,20,10,5,0,0,16].map((val, i) => ({
        date: getPastDate("2024-07-12", 30 - i),
        sold: val
    })),
    buyerLocations: [
      { city: "Neuchâtel", count: 180 },
      { city: "La Chaux-de-Fonds", count: 60 },
      { city: "Bienne", count: 20 },
      { city: "Lausanne", count: 20 }
    ],
    lastUpdated: "2024-07-13T09:00:00Z"
  }
};