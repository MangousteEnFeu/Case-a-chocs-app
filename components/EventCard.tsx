import React from 'react';
import { HeedsEvent, EventStatus } from '../types';
import { Calendar, MapPin, Users, RefreshCw, CheckCircle2 } from 'lucide-react';
import { clsx } from 'clsx';

interface EventCardProps {
  event: HeedsEvent;
  onSync: (id: string) => void;
  isSyncing: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ event, onSync, isSyncing }) => {
  
  const statusColors = {
    [EventStatus.SYNCED]: "text-[#00d4aa] bg-[#00d4aa]/10 border-[#00d4aa]/20",
    [EventStatus.CONFIRMED]: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    [EventStatus.DRAFT]: "text-gray-400 bg-gray-400/10 border-gray-400/20",
    [EventStatus.CANCELLED]: "text-red-400 bg-red-400/10 border-red-400/20",
  };

  return (
    <div className="group bg-[#141414] border border-[#2a2a2a] rounded-2xl overflow-hidden hover:border-[#ff3366]/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.5)] flex flex-col">
      {/* Image Header */}
      <div className="h-32 bg-gray-800 relative overflow-hidden">
        {event.imageUrl ? (
            <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500 scale-105 group-hover:scale-100" />
        ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]" />
        )}
        <div className="absolute top-3 right-3">
             <span className={clsx("px-2.5 py-1 rounded-full text-xs font-bold border backdrop-blur-md", statusColors[event.status])}>
                {event.status}
             </span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-white font-['Outfit'] leading-tight group-hover:text-[#ff3366] transition-colors">{event.title}</h3>
        </div>
        
        <div className="space-y-2 mt-2 mb-6">
            <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Calendar size={14} className="text-[#ff3366]" />
                <span>{event.date} • {event.timeStart}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
                <MapPin size={14} className="text-[#ff3366]" />
                <span>{event.venue}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Users size={14} className="text-[#ff3366]" />
                <span>Cap: {event.capacity}</span>
            </div>
        </div>

        <div className="mt-auto pt-4 border-t border-[#2a2a2a] flex items-center justify-between">
            <div className="text-xs text-gray-500">
                ID: <span className="font-mono text-gray-300">{event.id}</span>
            </div>
            
            {event.status !== EventStatus.DRAFT && (
                <button
                    onClick={() => onSync(event.id)}
                    disabled={isSyncing || event.status === EventStatus.SYNCED}
                    className={clsx(
                        "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-all",
                        event.status === EventStatus.SYNCED
                            ? "text-[#00d4aa] cursor-default"
                            : "bg-white text-black hover:bg-[#ff3366] hover:text-white"
                    )}
                >
                    {isSyncing ? (
                        <RefreshCw size={16} className="animate-spin" />
                    ) : event.status === EventStatus.SYNCED ? (
                        <>
                         <CheckCircle2 size={16} /> Synced
                        </>
                    ) : (
                        <>
                         <RefreshCw size={16} /> Sync
                        </>
                    )}
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;