import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { HeedsEvent, Venue } from '../types';
import EventCard from '../components/EventCard';
import SyncModal from '../components/SyncModal';
import CreateEventModal from '../components/CreateEventModal';
import { Search, Plus, RefreshCw } from 'lucide-react';
import Button from '../components/Button';
import { useToast } from '../hooks/useToast';

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<HeedsEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [isBatchSyncing, setIsBatchSyncing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<'ALL' | 'DRAFT' | 'CONFIRMED' | 'SYNCED'>('ALL');
  
  // Modal States
  const [syncModalOpen, setSyncModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<HeedsEvent | null>(null);
  
  const { showToast } = useToast();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    setLoading(true);
    api.getEvents()
      .then(setEvents)
      .finally(() => setLoading(false));
  };

  const handleSyncClick = (event: HeedsEvent) => {
    setSelectedEvent(event);
    setSyncModalOpen(true);
  };

  const handleConfirmSync = async () => {
    if (!selectedEvent) return;
    
    setSyncModalOpen(false);
    setSyncingId(selectedEvent.id);
    
    try {
      const updatedEvent = await api.syncEvent(selectedEvent.id);
      setEvents(prev => prev.map(e => e.id === selectedEvent.id ? updatedEvent : e));
      showToast('success', `${selectedEvent.title} synced to PETZI!`);
    } catch (error) {
      console.error("Sync failed", error);
      showToast('error', `Failed to sync ${selectedEvent.title}`);
    } finally {
      setSyncingId(null);
      setSelectedEvent(null);
    }
  };

  const handleSyncAllConfirmed = async () => {
    const confirmedEventsCount = events.filter(e => e.status === 'CONFIRMED').length;
    
    if (confirmedEventsCount === 0) {
        showToast('info', "No CONFIRMED events to sync.");
        return;
    }

    setIsBatchSyncing(true);
    try {
        const updatedEvents = await api.syncAll();
        // Merge updated events into state
        setEvents(prev => prev.map(e => {
            const updated = updatedEvents.find(u => u.id === e.id);
            return updated || e;
        }));
        showToast('success', `Batch sync complete: ${updatedEvents.length} events pushed to PETZI.`);
    } catch (error) {
        console.error("Batch sync failed", error);
        showToast('error', "Batch sync failed. Check logs.");
    } finally {
        setIsBatchSyncing(false);
    }
  };

  const handleCreateEvent = async (eventData: any) => {
    try {
      const newEvent = await api.createEvent(eventData);
      setEvents(prev => [newEvent, ...prev]);
      setCreateModalOpen(false);
      showToast('success', `Event "${newEvent.title}" created!`);
    } catch (error) {
      console.error("Create failed", error);
      showToast('error', "Failed to create event");
    }
  };

  const filteredEvents = events.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'ALL' || e.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-[1600px] mx-auto min-h-screen">
      <SyncModal 
        isOpen={syncModalOpen}
        onClose={() => setSyncModalOpen(false)}
        onConfirm={handleConfirmSync}
        event={selectedEvent}
      />

      <CreateEventModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreate={handleCreateEvent}
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6 border-b-4 border-white pb-6">
        <div>
          <h1 className="text-6xl text-white mb-2 leading-none">EVENTS</h1>
          <p className="text-[#E91E63] font-mono font-bold uppercase tracking-widest">HEEDS &gt;&gt; PETZI SYNC</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto items-stretch md:items-end">
            <div className="relative">
                <input 
                    type="text" 
                    placeholder="SEARCH..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-black border-2 border-white text-white pl-4 pr-10 py-2 w-full md:w-64 font-mono uppercase focus:outline-none focus:border-[#E91E63] focus:shadow-[4px_4px_0px_0px_#E91E63] transition-all"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            </div>
            
            <div className="flex gap-2">
                <Button 
                    variant="outline" 
                    className="flex items-center justify-center gap-2"
                    onClick={handleSyncAllConfirmed}
                    disabled={isBatchSyncing || loading}
                >
                    <RefreshCw size={18} className={isBatchSyncing ? "animate-spin" : ""} /> 
                    SYNC ALL
                </Button>
                
                <Button 
                    variant="secondary" 
                    className="flex items-center justify-center gap-2"
                    onClick={() => setCreateModalOpen(true)}
                >
                    <Plus size={20} /> NEW
                </Button>
            </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-10">
        {['ALL', 'SYNCED', 'CONFIRMED', 'DRAFT'].map((f) => (
            <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-6 py-2 border-2 text-sm font-bold font-mono uppercase tracking-widest transition-all ${
                    filter === f 
                    ? 'bg-white text-black border-white shadow-[4px_4px_0px_0px_#E91E63] translate-x-[-2px] translate-y-[-2px]' 
                    : 'bg-black text-white border-white hover:bg-gray-900'
                }`}
            >
                {f}
            </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1,2,3,4].map(i => (
                <div key={i} className="h-96 bg-[#111] border-2 border-white animate-pulse"></div>
            ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredEvents.map(event => (
                <EventCard 
                    key={event.id} 
                    event={event} 
                    onSync={handleSyncClick}
                    isSyncing={syncingId === event.id || isBatchSyncing}
                />
            ))}
        </div>
      )}

      {!loading && filteredEvents.length === 0 && (
        <div className="text-center py-20 border-2 border-dashed border-gray-800">
          <p className="text-gray-500 font-mono uppercase">No events found</p>
        </div>
      )}
    </div>
  );
};

export default EventsPage;
