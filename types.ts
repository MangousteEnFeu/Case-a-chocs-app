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
  petziExternalId?: string; // Reference if synced
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
}