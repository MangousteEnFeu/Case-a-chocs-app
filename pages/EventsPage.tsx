import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { HeedsEvent } from '../types';
import EventCard from '../components/EventCard';
import { Search, Plus } from 'lucide-react';

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<HeedsEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<'ALL' | 'DRAFT' | 'CONFIRMED' | 'SYNCED'>('ALL');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    setLoading(true);
    api.getEvents()
      .then(setEvents)
      .finally(() => setLoading(false));
  };

  const handleSync = async (id: string) => {
    setSyncingId(id);
    try {
      const updatedEvent = await api.syncEvent(id);
      setEvents(prev => prev.map(e => e.id === id ? updatedEvent : e));
    } catch (error) {
      console.error("Sync failed", error);
    } finally {
      setSyncingId(null);
    }
  };

  const filteredEvents = events.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'ALL' || e.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 lg:p-10 max-w-[1600px] mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 font-['Outfit']">Events Manager</h1>
          <p className="text-gray-400">Sync HEEDS events to PETZI ticketing</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                    type="text" 
                    placeholder="Search events..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#141414] border border-[#2a2a2a] text-white pl-10 pr-4 py-2.5 rounded-xl focus:ring-2 focus:ring-[#ff3366] focus:border-transparent outline-none transition-all"
                />
            </div>
            <button className="bg-white text-black p-2.5 rounded-xl hover:bg-[#ff3366] hover:text-white transition-colors">
                <Plus size={20} />
            </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {['ALL', 'SYNCED', 'CONFIRMED', 'DRAFT'].map((f) => (
            <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wider transition-colors ${
                    filter === f 
                    ? 'bg-[#ff3366] text-white' 
                    : 'bg-[#141414] text-gray-400 border border-[#2a2a2a] hover:border-gray-500'
                }`}
            >
                {f}
            </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => (
                <div key={i} className="h-64 bg-[#141414] rounded-2xl animate-pulse border border-[#2a2a2a]"></div>
            ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEvents.map(event => (
                <EventCard 
                    key={event.id} 
                    event={event} 
                    onSync={handleSync}
                    isSyncing={syncingId === event.id}
                />
            ))}
        </div>
      )}
    </div>
  );
};

export default EventsPage;