import React from 'react';
import { HeedsEvent, EventStatus } from '../types';
import { Calendar, MapPin, Users, RefreshCw, Check, Ticket, Music } from 'lucide-react';
import { clsx } from 'clsx';
import Button from './Button';

interface EventCardProps {
  event: HeedsEvent;
  onSync: (event: HeedsEvent) => void;
  isSyncing: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ event, onSync, isSyncing }) => {
  
  const statusStyles = {
    [EventStatus.SYNCED]: "bg-[#00FF00] text-black border-black",
    [EventStatus.CONFIRMED]: "bg-[#00FFFF] text-black border-black",
    [EventStatus.DRAFT]: "bg-gray-600 text-white border-white",
    [EventStatus.CANCELLED]: "bg-red-600 text-white border-white",
  };

  return (
    <div className="bg-[#111] border-2 border-white flex flex-col group hover:shadow-[8px_8px_0px_0px_#FFFF00] transition-all duration-200">
      {/* Image / Header Area */}
      <div className="h-40 bg-gray-900 relative border-b-2 border-white overflow-hidden">
        {event.imageUrl ? (
            <div className="w-full h-full relative">
                 <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-500" />
                 <div className="absolute inset-0 bg-[#E91E63] mix-blend-multiply opacity-40 group-hover:opacity-0 transition-opacity"></div>
            </div>
        ) : (
            <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/black-felt.png')] bg-[#222]"></div>
        )}
        
        {/* Date Sticker */}
        <div className="absolute top-0 left-0 bg-white text-black p-2 border-r-2 border-b-2 border-white font-mono text-center leading-none z-10">
            <span className="block text-xs font-bold">{new Date(event.date).toLocaleString('default', { month: 'short' }).toUpperCase()}</span>
            <span className="block text-xl font-black">{new Date(event.date).getDate()}</span>
        </div>

        {/* Status Tag */}
        <div className={clsx("absolute bottom-3 right-3 px-2 py-1 text-xs font-bold font-mono uppercase border-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]", statusStyles[event.status])}>
            {event.status}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col gap-4">
        <div>
            <h3 className="text-2xl text-white leading-none uppercase mb-1 font-['Anton'] tracking-wide">{event.title}</h3>
            {event.subtitle && <p className="text-white text-sm font-bold uppercase mb-2">{event.subtitle}</p>}
            <div className="flex justify-between items-center">
                <p className="text-[#E91E63] font-mono text-xs uppercase font-bold">{event.venue}</p>
                {event.genre && <span className="text-gray-500 text-[10px] font-mono border border-gray-700 px-1 uppercase">{event.genre}</span>}
            </div>
        </div>
        
        <div className="space-y-2 border-t border-dashed border-gray-700 pt-4">
            <div className="flex justify-between items-center text-sm font-mono text-gray-300">
                <span className="flex items-center gap-2"><Calendar size={14}/> DOORS</span>
                <span>{event.timeDoors}</span>
            </div>
            <div className="flex justify-between items-center text-sm font-mono text-gray-300">
                <span className="flex items-center gap-2"><Users size={14}/> CAP</span>
                <span>{event.capacity}</span>
            </div>
            <div className="flex justify-between items-center text-sm font-mono text-gray-300">
                <span className="flex items-center gap-2"><Ticket size={14}/> PRICE</span>
                <span>CHF {event.pricing.presale}.-</span>
            </div>
        </div>

        <div className="mt-auto pt-4">
            {event.status !== EventStatus.DRAFT ? (
                <Button 
                    variant={event.status === EventStatus.SYNCED ? 'outline' : 'primary'}
                    className="w-full flex items-center justify-center gap-2"
                    onClick={() => onSync(event)}
                    disabled={isSyncing || event.status === EventStatus.SYNCED}
                >
                    {isSyncing ? (
                        <><RefreshCw size={16} className="animate-spin"/> PROCESSING</>
                    ) : event.status === EventStatus.SYNCED ? (
                        <><Check size={16}/> SYNCED</>
                    ) : (
                        <><RefreshCw size={16}/> PUSH TO PETZI</>
                    )}
                </Button>
            ) : (
                 <div className="text-center font-mono text-xs text-gray-500 py-2 border-2 border-dashed border-gray-800 uppercase">
                    Draft - Incomplete
                 </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;