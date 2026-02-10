import { HeedsEvent, SalesReport, SyncLog, SystemHealth, EventStatus, Venue } from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || `HTTP ${response.status}`);
    }
    return response.json();
};

// Transformer les données du backend vers le format frontend
const transformEvent = (backendEvent: any): HeedsEvent => {
    return {
        id: backendEvent.id,
        title: backendEvent.title,
        subtitle: backendEvent.subtitle || '',
        genre: backendEvent.genre || '',
        date: backendEvent.date,
        timeStart: backendEvent.timeStart || '22:00',
        timeDoors: backendEvent.timeDoors || '21:00',
        venue: (backendEvent.venue as Venue) || Venue.GRANDE_SALLE,
        description: backendEvent.description || '',
        artists: backendEvent.artists || [],
        pricing: {
            presale: backendEvent.pricePresale || 0,
            door: backendEvent.priceDoor || 0
        },
        capacity: backendEvent.capacity || 750,
        status: (backendEvent.status as EventStatus) || EventStatus.DRAFT,
        petziExternalId: backendEvent.petziExternalId,
        lastSyncAt: backendEvent.lastSyncAt,
        imageUrl: backendEvent.imageUrl
    };
};

const transformLog = (backendLog: any): SyncLog => {
    return {
        id: String(backendLog.id),
        timestamp: backendLog.timestamp,
        type: backendLog.type || 'SYSTEM',
        eventId: backendLog.eventId,
        eventTitle: backendLog.eventTitle,
        status: backendLog.status || 'SUCCESS',
        duration: backendLog.duration || 0,
        details: backendLog.details || backendLog.message || '',
        recordsSynced: backendLog.recordsSynced || 0
    };
};

export const api = {
    // --- EVENTS ---

    getEvents: async (status?: string): Promise<HeedsEvent[]> => {
        const url = status && status !== 'ALL'
            ? `${API_BASE_URL}/events?status=${status}`
            : `${API_BASE_URL}/events`;

        const response = await fetch(url);
        const data = await handleResponse(response);
        return Array.isArray(data) ? data.map(transformEvent) : [];
    },

    getEvent: async (id: string): Promise<HeedsEvent> => {
        const response = await fetch(`${API_BASE_URL}/events/${id}`);
        const data = await handleResponse(response);
        return transformEvent(data);
    },

    createEvent: async (eventData: any): Promise<HeedsEvent> => {
        const response = await fetch(`${API_BASE_URL}/events`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(eventData)
        });
        const data = await handleResponse(response);
        return transformEvent(data);
    },

    /**
     * Met à jour un événement existant
     * @param event - L'objet HeedsEvent complet avec les modifications
     */
    updateEvent: async (event: HeedsEvent): Promise<HeedsEvent> => {
        // ✅ CORRIGÉ: Mapping correct des champs vers le backend
        const backendData = {
            id: event.id,
            title: event.title,
            subtitle: event.subtitle || '',
            genre: event.genre || '',
            date: event.date,
            timeStart: event.timeStart,
            timeDoors: event.timeDoors,
            venue: event.venue,
            description: event.description || '',
            capacity: event.capacity,
            pricePresale: event.pricing.presale,  // ✅ Corrigé (était presalePrice)
            priceDoor: event.pricing.door,         // ✅ Corrigé (était doorPrice)
            status: event.status,
            imageUrl: event.imageUrl || null
        };

        const response = await fetch(`${API_BASE_URL}/events/${event.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(backendData)
        });

        const data = await handleResponse(response);
        return transformEvent(data);
    },

    deleteEvent: async (id: string): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/events/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
    },

    // --- SYNC ---

    syncEvent: async (id: string): Promise<HeedsEvent> => {
        const response = await fetch(`${API_BASE_URL}/sync/events`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ eventIds: [id] })
        });
        const result = await handleResponse(response);
        const event = Array.isArray(result) ? result[0] : result;
        return transformEvent(event);
    },

    syncAll: async (): Promise<HeedsEvent[]> => {
        const response = await fetch(`${API_BASE_URL}/sync/events/all`, {
            method: 'POST'
        });
        const data = await handleResponse(response);
        return Array.isArray(data) ? data.map(transformEvent) : [];
    },

    // --- SALES ---

    getSalesReport: async (eventId: string): Promise<SalesReport> => {
        const response = await fetch(`${API_BASE_URL}/sales/report/${eventId}`);
        return handleResponse(response);
    },

    recordSale: async (eventId: string, ticketType: string, price: number, buyerCity: string): Promise<void> => {
        const params = new URLSearchParams({
            eventId,
            ticketType,
            price: price.toString(),
            buyerCity
        });
        const response = await fetch(`${API_BASE_URL}/sales/record?${params}`, {
            method: 'POST'
        });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
    },

    // --- LOGS ---

    getLogs: async (type?: string): Promise<SyncLog[]> => {
        const url = type && type !== 'ALL'
            ? `${API_BASE_URL}/sync/logs?type=${type}`
            : `${API_BASE_URL}/sync/logs`;

        const response = await fetch(url);
        const data = await handleResponse(response);
        return Array.isArray(data) ? data.map(transformLog) : [];
    },

    // --- SYSTEM ---

    checkHealth: async (): Promise<SystemHealth> => {
        const response = await fetch(`${API_BASE_URL}/health`);
        return handleResponse(response);
    },
};