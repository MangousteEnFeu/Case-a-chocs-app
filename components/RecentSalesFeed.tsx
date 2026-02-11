import React, { useState, useEffect } from 'react';
import { Clock, User, MapPin, Ticket } from 'lucide-react';

// ✅ COPIE DE LA LISTE DEPUIS VOTRE DASHBOARD POUR QUE LE FEED LA CONNAISSE
const SWISS_CITIES: Record<string, string> = {
    // Neuchâtel et région
    '2000': 'Neuchâtel', '2034': 'Peseux', '2035': 'Corcelles', '2036': 'Cormondrèche',
    '2037': 'Montmollin', '2042': 'Valangin', '2052': 'Fontainemelon', '2053': 'Cernier',
    '2054': 'Chézard-St-Martin', '2056': 'Dombresson', '2057': 'Villiers', '2063': 'Vilars',
    '2065': 'Savagnier', '2068': 'Hauterive', '2072': 'St-Blaise', '2073': 'Enges',
    '2074': 'Marin-Epagnier', '2075': 'Thielle', '2087': 'Cornaux', '2088': 'Cressier',
    '2300': 'La Chaux-de-Fonds', '2301': 'La Chaux-de-Fonds', '2314': 'La Sagne',
    '2316': 'Les Ponts-de-Martel', '2322': 'Le Crêt-du-Locle', '2325': 'Les Planchettes',
    '2400': 'Le Locle', '2405': 'La Chaux-du-Milieu', '2406': 'La Brévine',
    '2500': 'Bienne', '2502': 'Bienne', '2503': 'Bienne', '2504': 'Bienne', '2505': 'Bienne',
    // Lausanne et Vaud
    '1000': 'Lausanne', '1001': 'Lausanne', '1002': 'Lausanne', '1003': 'Lausanne',
    '1004': 'Lausanne', '1005': 'Lausanne', '1006': 'Lausanne', '1007': 'Lausanne',
    '1008': 'Prilly', '1009': 'Pully', '1010': 'Lausanne', '1011': 'Lausanne',
    '1012': 'Lausanne', '1015': 'Lausanne', '1018': 'Lausanne', '1020': 'Renens',
    '1022': 'Chavannes', '1023': 'Crissier', '1024': 'Ecublens', '1025': 'St-Sulpice',
    '1026': 'Denges', '1027': 'Lonay', '1028': 'Préverenges', '1029': 'Villars-Ste-Croix',
    '1030': 'Bussigny', '1400': 'Yverdon-les-Bains', '1800': 'Vevey', '1820': 'Montreux',
    '1110': 'Morges', '1260': 'Nyon',
    // Genève
    '1200': 'Genève', '1201': 'Genève', '1202': 'Genève', '1203': 'Genève',
    '1204': 'Genève', '1205': 'Genève', '1206': 'Genève', '1207': 'Genève',
    '1208': 'Genève', '1209': 'Genève', '1211': 'Genève', '1212': 'Grand-Lancy',
    '1213': 'Petit-Lancy', '1214': 'Vernier', '1215': 'Genève', '1216': 'Cointrin',
    '1217': 'Meyrin', '1218': 'Le Grand-Saconnex', '1219': 'Châtelaine', '1220': 'Les Avanchets',
    '1222': 'Vésenaz', '1223': 'Cologny', '1224': 'Chêne-Bougeries', '1225': 'Chêne-Bourg',
    '1226': 'Thônex', '1227': 'Carouge', '1228': 'Plan-les-Ouates', '1231': 'Conches',
    '1232': 'Confignon', '1233': 'Bernex', '1234': 'Vessy',
    // Fribourg
    '1700': 'Fribourg', '1701': 'Fribourg', '1708': 'Fribourg',
    // Berne
    '3000': 'Berne', '3001': 'Berne', '3003': 'Berne', '3004': 'Berne', '3005': 'Berne',
    '3006': 'Berne', '3007': 'Berne', '3008': 'Berne', '3010': 'Berne', '3011': 'Berne',
    '3012': 'Berne', '3013': 'Berne', '3014': 'Berne', '3015': 'Berne', '3018': 'Berne',
    '3027': 'Berne',
    // Bâle
    '4000': 'Bâle', '4001': 'Bâle', '4002': 'Bâle', '4003': 'Bâle', '4005': 'Bâle',
    '4051': 'Bâle', '4052': 'Bâle', '4053': 'Bâle', '4054': 'Bâle', '4055': 'Bâle',
    '4056': 'Bâle', '4057': 'Bâle', '4058': 'Bâle',
    // Zurich
    '8000': 'Zurich', '8001': 'Zurich', '8002': 'Zurich', '8003': 'Zurich', '8004': 'Zurich',
    '8005': 'Zurich', '8006': 'Zurich', '8008': 'Zurich', '8032': 'Zurich', '8037': 'Zurich',
    '8038': 'Zurich', '8041': 'Zurich', '8044': 'Zurich', '8045': 'Zurich', '8046': 'Zurich',
    '8047': 'Zurich', '8048': 'Zurich', '8049': 'Zurich', '8050': 'Zurich', '8051': 'Zurich',
    '8052': 'Zurich', '8053': 'Zurich', '8055': 'Zurich', '8057': 'Zurich', '8400': 'Winterthour',
    // Lucerne
    '6000': 'Lucerne', '6002': 'Lucerne', '6003': 'Lucerne', '6004': 'Lucerne',
    '6005': 'Lucerne', '6006': 'Lucerne',
    // St-Gall
    '9000': 'St-Gall', '9001': 'St-Gall',
    // Tessin
    '6900': 'Lugano', '6901': 'Lugano', '6600': 'Locarno', '6500': 'Bellinzone',
};

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

    // ✅ FONCTION DE RÉCUPÉRATION DU NOM DE LA VILLE
    const getLocationName = (zipCode: string) => {
        if (!zipCode) return 'Inconnu';
        const cityName = SWISS_CITIES[zipCode];
        // Affiche "2000 Neuchâtel" si connu, sinon juste le code postal
        return cityName ? `${zipCode} ${cityName}` : zipCode;
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
                                        <span className="truncate text-gray-400">
                                            {getLocationName(sale.buyerLocation)}
                                        </span>
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