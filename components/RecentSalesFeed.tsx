import React, { useState, useEffect } from 'react';
import { Clock, User, MapPin, Ticket } from 'lucide-react';

interface Sale {
    id: string;
    eventId: string;
    category: string;
    unitPrice: number;
    buyerLocation: string;
    buyerName?: string;
    ticketNumber?: string;
    saleDate: string;
}

interface RecentSalesFeedProps {
    onSaleClick?: (sale: Sale) => void;
}

const RecentSalesFeed: React.FC<RecentSalesFeedProps> = ({ onSaleClick }) => {
    const [sales, setSales] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchSales = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/sales/recent');
            if (response.ok) {
                const data = await response.json();
                setSales(data);
            }
        } catch (error) {
            console.error('Erreur chargement ventes:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSales();
        // Auto-refresh toutes les 30 secondes
        const interval = setInterval(fetchSales, 30000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return "À l'instant";
        if (diffMins < 60) return `Il y a ${diffMins} min`;
        if (diffMins < 1440) return `Il y a ${Math.floor(diffMins / 60)}h`;
        return date.toLocaleDateString('fr-CH', { day: 'numeric', month: 'short' });
    };

    if (loading) {
        return (
            <div className="border-2 border-white bg-[#111] p-6">
                <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-16 bg-gray-800 rounded"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="border-2 border-white bg-[#111] overflow-hidden">
            <div className="bg-white text-black px-4 py-2 font-mono font-bold uppercase flex items-center justify-between">
        <span className="flex items-center gap-2">
          <Ticket size={16} />
          Ventes en temps réel
        </span>
                <span className="text-xs text-gray-600">Auto-refresh 30s</span>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
                {sales.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 font-mono">
                        Aucune vente récente
                    </div>
                ) : (
                    sales.map((sale) => (
                        <div
                            key={sale.id}
                            onClick={() => onSaleClick?.(sale)}
                            className="p-4 border-b border-gray-800 hover:bg-[#1a1a1a] cursor-pointer transition-all group"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                    {/* Catégorie */}
                                    <div className="flex items-center gap-2 mb-1">
                    <span className="text-[#E91E63] font-mono text-xs font-bold uppercase">
                      {sale.category || 'Standard'}
                    </span>
                                        <span className="text-[#00FF00] font-mono font-bold">
                      CHF {sale.unitPrice?.toFixed(2) || '0.00'}
                    </span>
                                    </div>

                                    {/* Acheteur */}
                                    {sale.buyerName && (
                                        <div className="flex items-center gap-2 text-sm text-gray-400">
                                            <User size={12} />
                                            <span className="truncate">{sale.buyerName}</span>
                                        </div>
                                    )}

                                    {/* Localisation */}
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <MapPin size={10} />
                                        <span>{sale.buyerLocation || 'Inconnu'}</span>
                                    </div>
                                </div>

                                {/* Heure */}
                                <div className="flex items-center gap-1 text-xs text-gray-500 font-mono">
                                    <Clock size={10} />
                                    {formatTime(sale.saleDate)}
                                </div>
                            </div>

                            {/* Numéro de ticket (affiché au hover) */}
                            {sale.ticketNumber && (
                                <div className="mt-2 text-[10px] font-mono text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                    #{sale.ticketNumber}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default RecentSalesFeed;