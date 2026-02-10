import React from 'react';
import { X, Ticket, User, MapPin, Calendar, Clock } from 'lucide-react';

interface TicketVisualProps {
    isOpen: boolean;
    onClose: () => void;
    sale: {
        id: string;
        category: string;
        unitPrice: number;
        buyerLocation: string;
        buyerName?: string;
        buyerEmail?: string;
        ticketNumber?: string;
        saleDate: string;
    } | null;
    eventTitle?: string;
}

const TicketVisual: React.FC<TicketVisualProps> = ({ isOpen, onClose, sale, eventTitle }) => {
    if (!isOpen || !sale) return null;

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleString('fr-CH', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Générer un code-barres visuel simple
    const generateBarcode = (text: string) => {
        const bars = [];
        for (let i = 0; i < 40; i++) {
            const width = Math.random() > 0.5 ? 2 : 1;
            const isBlack = i % 2 === 0;
            bars.push(
                <div
                    key={i}
                    className={`h-12 ${isBlack ? 'bg-black' : 'bg-white'}`}
                    style={{ width: `${width * 2}px` }}
                />
            );
        }
        return bars;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white w-full max-w-md shadow-[12px_12px_0px_0px_#E91E63] border-4 border-black">
                {/* Header */}
                <div className="bg-black text-white p-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Ticket size={24} className="text-[#E91E63]" />
                        <span className="font-['Anton'] text-xl uppercase">Ticket</span>
                    </div>
                    <button onClick={onClose} className="hover:text-[#E91E63] transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Contenu du ticket */}
                <div className="p-6 space-y-4">
                    {/* Événement */}
                    {eventTitle && (
                        <div className="text-center border-b-2 border-dashed border-gray-300 pb-4">
                            <h2 className="font-['Anton'] text-2xl uppercase text-black">{eventTitle}</h2>
                            <p className="text-xs font-mono text-gray-500 uppercase mt-1">Case à Chocs • Neuchâtel</p>
                        </div>
                    )}

                    {/* Catégorie & Prix */}
                    <div className="flex justify-between items-center bg-[#E91E63] text-white p-4 -mx-6">
                        <span className="font-mono font-bold uppercase">{sale.category || 'Standard'}</span>
                        <span className="font-['Anton'] text-3xl">CHF {sale.unitPrice?.toFixed(2)}</span>
                    </div>

                    {/* Infos acheteur */}
                    <div className="space-y-3 py-4">
                        {sale.buyerName && (
                            <div className="flex items-center gap-3">
                                <User size={18} className="text-[#E91E63]" />
                                <div>
                                    <p className="text-xs font-mono text-gray-500 uppercase">Acheteur</p>
                                    <p className="font-bold text-black">{sale.buyerName}</p>
                                </div>
                            </div>
                        )}

                        {sale.buyerEmail && (
                            <div className="flex items-center gap-3">
                                <span className="text-[#E91E63] text-lg">@</span>
                                <div>
                                    <p className="text-xs font-mono text-gray-500 uppercase">Email</p>
                                    <p className="text-sm text-black">{sale.buyerEmail}</p>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center gap-3">
                            <MapPin size={18} className="text-[#E91E63]" />
                            <div>
                                <p className="text-xs font-mono text-gray-500 uppercase">Localisation</p>
                                <p className="text-black">{sale.buyerLocation || 'Non renseigné'}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Calendar size={18} className="text-[#E91E63]" />
                            <div>
                                <p className="text-xs font-mono text-gray-500 uppercase">Date d'achat</p>
                                <p className="text-sm text-black">{formatDate(sale.saleDate)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Code-barres */}
                    <div className="border-t-2 border-dashed border-gray-300 pt-4">
                        <div className="flex justify-center gap-[1px] bg-white p-2 border border-gray-200">
                            {generateBarcode(sale.ticketNumber || sale.id)}
                        </div>
                        <p className="text-center font-mono text-xs text-gray-500 mt-2 tracking-widest">
                            {sale.ticketNumber || sale.id}
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-black text-white px-6 py-3 text-center">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-gray-400">
                        Généré par Case à Chocs Connector
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TicketVisual;