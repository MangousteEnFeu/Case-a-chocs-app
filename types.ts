export enum Venue {
  GRANDE_SALLE = "Grande Salle",
  QKC = "QKC",
  INTERLOPE = "Interlope"
}

export enum EventStatus {
  DRAFT = "DRAFT",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  SYNCED = "SYNCED"
}

export interface Artist {
  name: string;
  genre: string;
}

export interface Pricing {
  presale: number;
  door: number;
}

export interface HeedsEvent {
  id: string;
  title: string;
  date: string;
  timeStart: string;
  timeDoors: string;
  venue: Venue;
  description: string;
  artists: Artist[];
  pricing: Pricing;
  capacity: number;
  status: EventStatus;
  petziExternalId?: string;
  lastSyncAt?: string;
  imageUrl?: string;
}

export interface SalesCategory {
  category: string;
  sold: number;
  revenue: number;
}

export interface DailySales {
  date: string;
  sold: number;
}

export interface BuyerLocation {
  city: string;
  count: number;
}

export interface SalesReport {
  eventId: string;
  eventTitle: string;
  eventDate: string;
  venue: string;
  capacity: number;
  totalSold: number;
  totalRevenue: number;
  fillRate: number;
  salesByCategory: SalesCategory[];
  salesByDay: DailySales[];
  buyerLocations: BuyerLocation[];
  lastUpdated: string;
}

export interface SyncLog {
  id: string;
  timestamp: string;
  type: 'SYNC_EVENT' | 'FETCH_SALES' | 'ERROR' | 'SYSTEM';
  eventId?: string;
  eventTitle?: string;
  status: 'SUCCESS' | 'ERROR' | 'WARNING';
  duration: number;
  details: string;
}

export interface SystemHealth {
  status: 'UP' | 'DOWN' | 'DEGRADED';
  heedsConnection: boolean;
  petziConnection: boolean;
  latency: number;
}