import React, { useState } from 'react';
import { MOCK_EVENTS } from '../constants';
import { HeedsEvent, EventStatus, Venue } from '../types';
import { RefreshCw, CheckCircle2, AlertCircle, Calendar, MapPin, Search } from 'lucide-react';

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<HeedsEvent[]>(MOCK_EVENTS);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSync = (id: string) => {
    setSyncingId(id);
    // Simulate API call to Java backend
    setTimeout(() => {
      setEvents(prev => prev.map(evt => {
        if (evt.id === id) {
          return { ...evt, status: EventStatus.SYNCED, petziExternalId: `petzi-${Math.floor(Math.random() * 10000)}` };
        }
        return evt;
      }));
      setSyncingId(null);
    }, 1500);
  };

  const getStatusBadge = (status: EventStatus) => {
    switch (status) {
      case EventStatus.SYNCED:
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"><CheckCircle2 size={12} /> Synced</span>;
      case EventStatus.CONFIRMED:
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-500 border border-blue-500/20">Confirmed</span>;
      case EventStatus.DRAFT:
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-500/10 text-slate-400 border border-slate-500/20">Draft</span>;
      case EventStatus.CANCELLED:
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/20">Cancelled</span>;
    }
  };

  const filteredEvents = events.filter(e => 
    e.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.venue.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Event Synchronization</h1>
          <p className="text-slate-400">Push HEEDS events to PETZI ticketing platform</p>
        </div>
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
                type="text" 
                placeholder="Search events..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-slate-200 pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none w-64"
            />
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-slate-800 bg-slate-900/50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <div className="col-span-4">Event</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-2">Venue</div>
          <div className="col-span-2">Pricing (Pre/Door)</div>
          <div className="col-span-2 text-right">Action</div>
        </div>

        <div className="divide-y divide-slate-800">
          {filteredEvents.map((evt) => (
            <div key={evt.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-slate-800/50 transition-colors">
              <div className="col-span-4">
                <div className="flex items-center gap-3">
                    <div className={`w-1 h-12 rounded-full ${evt.status === EventStatus.SYNCED ? 'bg-emerald-500' : 'bg-slate-700'}`}></div>
                    <div>
                        <h3 className="font-bold text-white text-base">{evt.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                            {getStatusBadge(evt.status)}
                            <span className="text-xs text-slate-500 font-mono">{evt.id}</span>
                        </div>
                    </div>
                </div>
              </div>
              
              <div className="col-span-2 flex items-center gap-2 text-slate-400 text-sm">
                <Calendar size={14} />
                {evt.date} <span className="text-slate-600">|</span> {evt.timeStart}
              </div>

              <div className="col-span-2 flex items-center gap-2 text-slate-400 text-sm">
                <MapPin size={14} />
                {evt.venue === Venue.GRANDE_SALLE ? 'Grande Salle' : evt.venue}
              </div>

              <div className="col-span-2 text-sm text-slate-300">
                CHF {evt.pricing.presale} <span className="text-slate-600">/</span> CHF {evt.pricing.door}
              </div>

              <div className="col-span-2 flex justify-end">
                {evt.status === EventStatus.DRAFT ? (
                     <button disabled className="flex items-center gap-2 px-3 py-1.5 rounded bg-slate-800 text-slate-500 text-sm cursor-not-allowed">
                        <AlertCircle size={16} /> Incomplete
                     </button>
                ) : (
                    <button 
                        onClick={() => handleSync(evt.id)}
                        disabled={syncingId === evt.id || evt.status === EventStatus.SYNCED}
                        className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-all ${
                            evt.status === EventStatus.SYNCED
                            ? 'bg-transparent text-emerald-500 hover:bg-emerald-500/10'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                        } ${syncingId === evt.id ? 'opacity-75 cursor-wait' : ''}`}
                    >
                        {syncingId === evt.id ? (
                            <>
                                <RefreshCw size={16} className="animate-spin" /> Syncing...
                            </>
                        ) : evt.status === EventStatus.SYNCED ? (
                            <>
                                <RefreshCw size={16} /> Re-Sync
                            </>
                        ) : (
                            <>
                                <RefreshCw size={16} /> Push to Petzi
                            </>
                        )}
                    </button>
                )}
              </div>
            </div>
          ))}

          {filteredEvents.length === 0 && (
            <div className="p-12 text-center text-slate-500">
                <p>No events found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventsPage;