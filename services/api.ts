import { HeedsEvent, SalesReport, SyncLog, SystemHealth } from '../types';

// Safely access env variables with fallback using optional chaining
// This prevents crashes if import.meta.env is undefined
const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8080/api';

// Internal interface to handle backend's flattened pricing structure
interface BackendEvent extends Omit<HeedsEvent, 'pricing'> {
  presalePrice: number;
  doorPrice: number;
  pricing?: { presale: number; door: number }; // Optional fallback
}

// Wrapper for the standard ApiResponse from backend
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

// Mapper: Transforms backend flat fields into frontend nested Pricing object
const mapBackendEvent = (e: BackendEvent): HeedsEvent => {
  if (e.pricing) return e as HeedsEvent;
  
  return {
    ...e,
    pricing: {
      presale: e.presalePrice || 0,
      door: e.doorPrice || 0
    }
  } as HeedsEvent;
};

// Generic helper for fetch calls with error handling
async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error ${response.status}: ${errorText || response.statusText}`);
    }
    
    const json: ApiResponse<T> = await response.json();
    
    if (!json.success) {
      throw new Error(json.message || 'Unknown backend error');
    }
    
    return json.data;
  } catch (error: any) {
    console.error(`API Call Failed [${endpoint}]:`, error);

    // Provide a hint for common development issues
    if (error instanceof TypeError && error.message === "Failed to fetch") {
        console.warn(
            "Network Request Failed. Possible causes:\n" +
            "1. Backend is not running (check Java console).\n" +
            "2. CORS is blocking the request (check CorsConfig).\n" +
            "3. Database connection failed (check application.properties password).\n" +
            "4. Frontend/Backend port mismatch."
        );
    }
    throw error;
  }
}

export const api = {
  // --- EVENTS ---

  getEvents: async (status?: string): Promise<HeedsEvent[]> => {
    // Filter 'ALL' as it is a frontend-only concept; backend expects valid Enum or null
    const query = status && status !== 'ALL' ? `?status=${status}` : '';
    const events = await fetchApi<BackendEvent[]>(`/events${query}`);
    return events.map(mapBackendEvent);
  },

  getEvent: async (id: string): Promise<HeedsEvent> => {
    const event = await fetchApi<BackendEvent>(`/events/${id}`);
    return mapBackendEvent(event);
  },

  // --- SYNC ---

  syncEvent: async (id: string): Promise<HeedsEvent> => {
    const event = await fetchApi<BackendEvent>(`/sync/event/${id}`, { method: 'POST' });
    return mapBackendEvent(event);
  },

  syncAll: async (): Promise<HeedsEvent[]> => {
    const events = await fetchApi<BackendEvent[]>('/sync/all', { method: 'POST' });
    return events.map(mapBackendEvent);
  },

  // --- SALES ---

  getSalesReport: async (eventId: string): Promise<SalesReport> => {
    return fetchApi<SalesReport>(`/sales/${eventId}`);
  },

  // --- LOGS ---

  getLogs: async (type?: string): Promise<SyncLog[]> => {
    const query = type && type !== 'ALL' ? `?type=${type}` : '';
    return fetchApi<SyncLog[]>(`/logs${query}`);
  },

  // --- SYSTEM ---

  checkHealth: async (): Promise<SystemHealth> => {
    return fetchApi<SystemHealth>('/health');
  },
};