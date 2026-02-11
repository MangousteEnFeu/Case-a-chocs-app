import React, { useState, useEffect, useMemo } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import { api } from '../services/api';
import { SalesReport, HeedsEvent, Venue, EventStatus } from '../types';
import StatCard from '../components/StatCard';
import {
    DollarSign, Ticket, Users, TrendingUp, RefreshCw, AlertCircle,
    MapPin, Clock, Calendar, AlertTriangle, CheckCircle, Zap,
    Target, Search, Filter, X, Edit3, Upload,
    SortAsc, SortDesc, ChevronDown, Save, Eye, BarChart3,
    ArrowUpDown, Building, Music, Tag
} from 'lucide-react';
import ProgressBar from '../components/ProgressBar';
import RecentSalesFeed from '../components/RecentSalesFeed';
import TicketVisual from '../components/TicketVisual';
import EventComparator from '../components/EventComparator';

// ===========================================
// MAPPING CODE POSTAL SUISSE → VILLE
// ===========================================
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

const getSwissCity = (postalCode: string): string => {
    if (!postalCode) return 'Inconnu';
    const code = postalCode.trim();
    return SWISS_CITIES[code] || `NPA ${code}`;
};

const categoryColors = ['#E91E63', '#FFFF00', '#00FFFF', '#00FF00', '#FF5722', '#9C27B0'];

// ===========================================
// COMPOSANT TOOLTIP PERSONNALISÉ (CORRECTION)
// ===========================================
const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-black border-2 border-white p-3 font-mono shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] z-50">
                <div className="flex items-center gap-2 mb-2 border-b border-gray-700 pb-1">
                    <div className="w-3 h-3" style={{ backgroundColor: data.fill || '#fff' }}></div>
                    <p className="text-white font-bold uppercase text-xs">{data.category}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-[#00FFFF] text-sm flex justify-between gap-4">
                        <span>VENTES:</span>
                        <span className="font-bold">{data.sold}</span>
                    </p>
                    <p className="text-[#FFFF00] text-sm flex justify-between gap-4">
                        <span>REVENUS:</span>
                        <span className="font-bold">CHF {data.revenue}</span>
                    </p>
                </div>
            </div>
        );
    }
    return null;
};

// ... (Les types et interfaces restent identiques) ...
type SortField = 'title' | 'date' | 'revenue' | 'fillRate' | 'capacity' | 'status';
type SortDirection = 'asc' | 'desc';
type TimeFilter = 'all' | 'upcoming' | 'past' | 'thisMonth' | 'thisWeek';
type StatusFilter = 'all' | 'SYNCED' | 'CONFIRMED' | 'DRAFT' | 'CANCELLED';
type VenueFilter = 'all' | 'Grande Salle' | 'QKC' | 'Interlope';

interface FilterState {
    search: string;
    status: StatusFilter;
    venue: VenueFilter;
    time: TimeFilter;
    minFillRate: number;
    maxFillRate: number;
    genre: string;
}

interface GlobalStats {
    totalRevenue: number;
    totalSold: number;
    totalCapacity: number;
    totalEvents: number;
    syncedEvents: number;
    upcomingEvents: number;
    revenueByEvent: { name: string; id: string; revenue: number; sold: number; capacity: number; fillRate: number; date: string }[];
    allLocations: { city: string; count: number }[];
    allCategories: { category: string; sold: number; revenue: number }[];
    salesTrend: { date: string; sold: number }[];
}

// ... (Composants FillGauge, AlertBadge, SelectDropdown, EditEventModal, FilterBar, EventsTable restent inchangés) ...
// Pour gagner de la place je ne les répète pas ici car ils n'ont pas changé depuis la dernière version correcte.
// Assurez-vous d'avoir bien la version complète du fichier précédent pour ces parties.

const FillGauge: React.FC<{ value: number; max: number; size?: number }> = ({ value, max, size = 120 }) => {
    const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0;
    const strokeWidth = 8;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    const getColor = () => {
        if (percentage >= 90) return '#00FF00';
        if (percentage >= 70) return '#FFFF00';
        if (percentage >= 50) return '#00FFFF';
        return '#E91E63';
    };

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="transform -rotate-90">
                <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#333" strokeWidth={strokeWidth} />
                <circle
                    cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={getColor()}
                    strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={offset}
                    strokeLinecap="square" className="transition-all duration-1000 ease-out"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-['Anton'] text-white">{percentage.toFixed(0)}%</span>
                <span className="text-[10px] font-mono text-gray-500 uppercase">Rempli</span>
            </div>
        </div>
    );
};

const AlertBadge: React.FC<{ type: 'success' | 'warning' | 'danger' | 'info'; children: React.ReactNode }> = ({ type, children }) => {
    const styles = {
        success: 'bg-[#00FF00]/20 text-[#00FF00] border-[#00FF00]',
        warning: 'bg-[#FFFF00]/20 text-[#FFFF00] border-[#FFFF00]',
        danger: 'bg-[#E91E63]/20 text-[#E91E63] border-[#E91E63]',
        info: 'bg-[#00FFFF]/20 text-[#00FFFF] border-[#00FFFF]'
    };
    const icons = {
        success: <CheckCircle size={14} />,
        warning: <AlertTriangle size={14} />,
        danger: <AlertCircle size={14} />,
        info: <Zap size={14} />
    };

    return (
        <div className={`flex items-center gap-2 px-3 py-1.5 border text-xs font-mono uppercase ${styles[type]}`}>
            {icons[type]}
            {children}
        </div>
    );
};

const SelectDropdown: React.FC<{
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    icon?: React.ReactNode;
    placeholder?: string;
}> = ({ value, onChange, options, icon, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedOption = options.find(o => o.value === value);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 border border-gray-700 bg-black text-white text-xs font-mono hover:border-white transition-all w-full sm:w-auto min-w-[140px]"
            >
                {icon}
                <span className="flex-1 text-left truncate">{selectedOption?.label || placeholder}</span>
                <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute z-50 top-full left-0 mt-1 w-full bg-black border border-white shadow-[4px_4px_0px_0px_#E91E63] max-h-60 overflow-y-auto">
                        {options.map(option => (
                            <button
                                key={option.value}
                                onClick={() => { onChange(option.value); setIsOpen(false); }}
                                className={`w-full text-left px-3 py-2 text-xs font-mono hover:bg-white hover:text-black transition-all ${
                                    value === option.value ? 'bg-[#E91E63] text-white' : 'text-white'
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

const EditEventModal: React.FC<{
    event: HeedsEvent;
    onClose: () => void;
    onSave: (event: HeedsEvent) => void;
    onPushToPetzi: (event: HeedsEvent) => void;
}> = ({ event, onClose, onSave, onPushToPetzi }) => {
    const [editedEvent, setEditedEvent] = useState<HeedsEvent>({ ...event });
    const [isPushing, setIsPushing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onSave(editedEvent);
        } finally {
            setIsSaving(false);
        }
    };

    const handlePush = async () => {
        setIsPushing(true);
        try {
            await onPushToPetzi(editedEvent);
        } finally {
            setIsPushing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-[#111] border-2 border-white w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-[8px_8px_0px_0px_#E91E63]">
                <div className="sticky top-0 bg-[#111] border-b-2 border-white p-4 flex items-center justify-between z-10">
                    <h2 className="text-xl font-['Anton'] text-white flex items-center gap-2">
                        <Edit3 size={20} className="text-[#E91E63]" />
                        Modifier l'événement
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div>
                        <label className="block text-xs font-mono text-gray-500 uppercase mb-2">Titre</label>
                        <input
                            type="text"
                            value={editedEvent.title}
                            onChange={(e) => setEditedEvent({ ...editedEvent, title: e.target.value })}
                            className="w-full bg-black border border-gray-700 text-white px-4 py-3 font-mono focus:border-[#E91E63] focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-mono text-gray-500 uppercase mb-2">Sous-titre</label>
                        <input
                            type="text"
                            value={editedEvent.subtitle || ''}
                            onChange={(e) => setEditedEvent({ ...editedEvent, subtitle: e.target.value })}
                            className="w-full bg-black border border-gray-700 text-white px-4 py-3 font-mono focus:border-[#E91E63] focus:outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-mono text-gray-500 uppercase mb-2">Date</label>
                            <input
                                type="date"
                                value={editedEvent.date}
                                onChange={(e) => setEditedEvent({ ...editedEvent, date: e.target.value })}
                                className="w-full bg-black border border-gray-700 text-white px-4 py-3 font-mono focus:border-[#E91E63] focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-mono text-gray-500 uppercase mb-2">Ouverture portes</label>
                            <input
                                type="time"
                                value={editedEvent.timeDoors}
                                onChange={(e) => setEditedEvent({ ...editedEvent, timeDoors: e.target.value })}
                                className="w-full bg-black border border-gray-700 text-white px-4 py-3 font-mono focus:border-[#E91E63] focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-mono text-gray-500 uppercase mb-2">Début concert</label>
                            <input
                                type="time"
                                value={editedEvent.timeStart}
                                onChange={(e) => setEditedEvent({ ...editedEvent, timeStart: e.target.value })}
                                className="w-full bg-black border border-gray-700 text-white px-4 py-3 font-mono focus:border-[#E91E63] focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-mono text-gray-500 uppercase mb-2">Salle</label>
                            <select
                                value={editedEvent.venue}
                                onChange={(e) => setEditedEvent({ ...editedEvent, venue: e.target.value as Venue })}
                                className="w-full bg-black border border-gray-700 text-white px-4 py-3 font-mono focus:border-[#E91E63] focus:outline-none"
                            >
                                <option value="Grande Salle">Grande Salle</option>
                                <option value="QKC">QKC</option>
                                <option value="Interlope">Interlope</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-mono text-gray-500 uppercase mb-2">Capacité</label>
                            <input
                                type="number"
                                value={editedEvent.capacity}
                                onChange={(e) => setEditedEvent({ ...editedEvent, capacity: parseInt(e.target.value) || 0 })}
                                className="w-full bg-black border border-gray-700 text-white px-4 py-3 font-mono focus:border-[#E91E63] focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-mono text-gray-500 uppercase mb-2">Prix prévente (CHF)</label>
                            <input
                                type="number"
                                value={editedEvent.pricing.presale}
                                onChange={(e) => setEditedEvent({
                                    ...editedEvent,
                                    pricing: { ...editedEvent.pricing, presale: parseFloat(e.target.value) || 0 }
                                })}
                                className="w-full bg-black border border-gray-700 text-white px-4 py-3 font-mono focus:border-[#E91E63] focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-mono text-gray-500 uppercase mb-2">Prix sur place (CHF)</label>
                            <input
                                type="number"
                                value={editedEvent.pricing.door}
                                onChange={(e) => setEditedEvent({
                                    ...editedEvent,
                                    pricing: { ...editedEvent.pricing, door: parseFloat(e.target.value) || 0 }
                                })}
                                className="w-full bg-black border border-gray-700 text-white px-4 py-3 font-mono focus:border-[#E91E63] focus:outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-mono text-gray-500 uppercase mb-2">Genre musical</label>
                        <input
                            type="text"
                            value={editedEvent.genre || ''}
                            onChange={(e) => setEditedEvent({ ...editedEvent, genre: e.target.value })}
                            className="w-full bg-black border border-gray-700 text-white px-4 py-3 font-mono focus:border-[#E91E63] focus:outline-none"
                            placeholder="Ex: Rock, Électro, Jazz..."
                        />
                    </div>

                    {editedEvent.petziExternalId && (
                        <div className="p-4 border border-[#00FFFF] bg-[#00FFFF]/10">
                            <div className="text-xs font-mono text-[#00FFFF] uppercase mb-1">ID PETZI</div>
                            <div className="text-white font-mono">{editedEvent.petziExternalId}</div>
                        </div>
                    )}
                </div>

                <div className="sticky bottom-0 bg-[#111] border-t-2 border-white p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <button
                        onClick={onClose}
                        className="w-full sm:w-auto px-6 py-3 border border-gray-700 text-gray-500 font-mono text-sm uppercase hover:border-white hover:text-white transition-all"
                    >
                        Annuler
                    </button>
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <button
                            onClick={handlePush}
                            disabled={isPushing}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#00FFFF] text-black font-mono text-sm uppercase hover:bg-[#00FFFF]/80 transition-all disabled:opacity-50"
                        >
                            {isPushing ? <RefreshCw size={16} className="animate-spin" /> : <Upload size={16} />}
                            Push vers PETZI
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#E91E63] text-white font-mono text-sm uppercase hover:bg-[#E91E63]/80 transition-all disabled:opacity-50"
                        >
                            {isSaving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                            Enregistrer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FilterBar: React.FC<{
    filters: FilterState;
    setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
    genres: string[];
    resultCount: number;
    totalCount: number;
    onReset: () => void;
}> = ({ filters, setFilters, genres, resultCount, totalCount, onReset }) => {
    const [showAdvanced, setShowAdvanced] = useState(false);
    const hasActiveFilters = filters.search || filters.status !== 'all' || filters.venue !== 'all' ||
        filters.time !== 'all' || filters.minFillRate > 0 || filters.maxFillRate < 100 || filters.genre;

    return (
        <div className="border-2 border-white bg-[#111] p-4 space-y-4">
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-4">
                <div className="relative flex-1 min-w-[200px]">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                        type="text"
                        value={filters.search}
                        onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
                        placeholder="Rechercher..."
                        className="w-full bg-black border border-gray-700 text-white pl-10 pr-4 py-2 text-sm font-mono focus:border-[#E91E63] focus:outline-none"
                    />
                    {filters.search && (
                        <button
                            onClick={() => setFilters(f => ({ ...f, search: '' }))}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>

                <div className="flex flex-wrap gap-2 sm:gap-4">
                    <SelectDropdown
                        value={filters.status}
                        onChange={(v) => setFilters(f => ({ ...f, status: v as StatusFilter }))}
                        options={[
                            { value: 'all', label: 'Tous les statuts' },
                            { value: 'SYNCED', label: '✓ Synchronisé' },
                            { value: 'CONFIRMED', label: '◉ Confirmé' },
                            { value: 'DRAFT', label: '○ Brouillon' },
                            { value: 'CANCELLED', label: '✗ Annulé' }
                        ]}
                        icon={<Tag size={14} />}
                    />

                    <SelectDropdown
                        value={filters.venue}
                        onChange={(v) => setFilters(f => ({ ...f, venue: v as VenueFilter }))}
                        options={[
                            { value: 'all', label: 'Toutes les salles' },
                            { value: 'Grande Salle', label: 'Grande Salle' },
                            { value: 'QKC', label: 'QKC' },
                            { value: 'Interlope', label: 'Interlope' }
                        ]}
                        icon={<Building size={14} />}
                    />

                    <SelectDropdown
                        value={filters.time}
                        onChange={(v) => setFilters(f => ({ ...f, time: v as TimeFilter }))}
                        options={[
                            { value: 'all', label: 'Toutes les dates' },
                            { value: 'upcoming', label: '→ À venir' },
                            { value: 'past', label: '← Passés' },
                            { value: 'thisWeek', label: 'Cette semaine' },
                            { value: 'thisMonth', label: 'Ce mois-ci' }
                        ]}
                        icon={<Calendar size={14} />}
                    />
                </div>

                <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className={`flex items-center justify-center gap-2 px-3 py-2 border text-xs font-mono uppercase transition-all ${
                        showAdvanced ? 'border-[#E91E63] text-[#E91E63]' : 'border-gray-700 text-gray-500 hover:border-white hover:text-white'
                    }`}
                >
                    <Filter size={14} />
                    <span className="sm:hidden">Filtres</span>
                    <ChevronDown size={14} className={`transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                </button>
            </div>

            {showAdvanced && (
                <div className="pt-4 border-t border-gray-800 flex flex-wrap items-center gap-4">
                    <SelectDropdown
                        value={filters.genre}
                        onChange={(v) => setFilters(f => ({ ...f, genre: v }))}
                        options={[
                            { value: '', label: 'Tous les genres' },
                            ...genres.map(g => ({ value: g, label: g }))
                        ]}
                        icon={<Music size={14} />}
                    />

                    <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-gray-500">Remplissage:</span>
                        <input
                            type="number"
                            min={0}
                            max={100}
                            value={filters.minFillRate}
                            onChange={(e) => setFilters(f => ({ ...f, minFillRate: parseInt(e.target.value) || 0 }))}
                            className="w-16 bg-black border border-gray-700 text-white px-2 py-1 text-xs font-mono text-center focus:border-[#E91E63] focus:outline-none"
                        />
                        <span className="text-gray-500">-</span>
                        <input
                            type="number"
                            min={0}
                            max={100}
                            value={filters.maxFillRate}
                            onChange={(e) => setFilters(f => ({ ...f, maxFillRate: parseInt(e.target.value) || 100 }))}
                            className="w-16 bg-black border border-gray-700 text-white px-2 py-1 text-xs font-mono text-center focus:border-[#E91E63] focus:outline-none"
                        />
                        <span className="text-xs font-mono text-gray-500">%</span>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-gray-800">
                <div className="text-xs font-mono text-gray-500">
                    <span className="text-white font-bold">{resultCount}</span> / {totalCount} événements
                    {hasActiveFilters && <span className="text-[#FFFF00] ml-2">(filtré)</span>}
                </div>
                {hasActiveFilters && (
                    <button
                        onClick={onReset}
                        className="flex items-center gap-1 text-xs font-mono text-[#E91E63] hover:text-white transition-colors"
                    >
                        <X size={12} />
                        Réinitialiser
                    </button>
                )}
            </div>
        </div>
    );
};

const EventsTable: React.FC<{
    events: HeedsEvent[];
    reports: Map<string, SalesReport>;
    sortField: SortField;
    sortDirection: SortDirection;
    onSort: (field: SortField) => void;
    onSelectEvent: (id: string) => void;
    onEditEvent: (event: HeedsEvent) => void;
}> = ({ events, reports, sortField, sortDirection, onSort, onSelectEvent, onEditEvent }) => {

    const SortHeader: React.FC<{ field: SortField; children: React.ReactNode }> = ({ field, children }) => (
        <button
            onClick={() => onSort(field)}
            className={`flex items-center gap-1 text-xs font-mono uppercase transition-colors ${
                sortField === field ? 'text-[#E91E63]' : 'text-gray-500 hover:text-white'
            }`}
        >
            {children}
            {sortField === field ? (
                sortDirection === 'asc' ? <SortAsc size={12} /> : <SortDesc size={12} />
            ) : (
                <ArrowUpDown size={12} className="opacity-30" />
            )}
        </button>
    );

    return (
        <div className="border-2 border-white bg-[#111] overflow-hidden">
            <div className="grid grid-cols-12 gap-2 sm:gap-4 p-4 border-b-2 border-white bg-black hidden md:grid">
                <div className="col-span-4"><SortHeader field="title">Événement</SortHeader></div>
                <div className="col-span-2"><SortHeader field="date">Date</SortHeader></div>
                <div className="col-span-1"><SortHeader field="status">Statut</SortHeader></div>
                <div className="col-span-2"><SortHeader field="fillRate">Remplissage</SortHeader></div>
                <div className="col-span-2 text-right"><SortHeader field="revenue">Revenus</SortHeader></div>
                <div className="col-span-1 text-right">Actions</div>
            </div>

            <div className="max-h-[500px] overflow-y-auto">
                {events.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 font-mono">
                        Aucun événement trouvé
                    </div>
                ) : (
                    events.map((event) => {
                        const report = reports.get(event.id);
                        const fillRate = report ? (report.totalSold / report.capacity) * 100 : 0;
                        const isUpcoming = new Date(event.date) > new Date();

                        return (
                            <div
                                key={event.id}
                                className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-4 p-4 border-b border-gray-800 hover:bg-black/50 transition-all group"
                            >
                                {/* Mobile Header: Title & Status */}
                                <div className="col-span-1 md:col-span-4 flex items-center gap-3 min-w-0">
                                    {event.imageUrl && (
                                        <img
                                            src={event.imageUrl}
                                            alt=""
                                            className="w-10 h-10 object-cover border border-gray-700 hidden sm:block"
                                        />
                                    )}
                                    <div className="min-w-0 flex-1">
                                        <div className="text-white font-bold truncate">{event.title}</div>
                                        <div className="text-xs font-mono text-gray-500 flex items-center gap-2">
                                            <span>{event.venue}</span>
                                            {event.genre && <span className="text-[#E91E63]">• {event.genre}</span>}
                                        </div>
                                    </div>
                                    <div className="md:hidden">
                         <span className={`text-[10px] font-mono px-2 py-1 border ${
                             event.status === 'SYNCED' ? 'text-[#00FF00] border-[#00FF00] bg-[#00FF00]/10' :
                                 event.status === 'CONFIRMED' ? 'text-[#00FFFF] border-[#00FFFF] bg-[#00FFFF]/10' :
                                     event.status === 'CANCELLED' ? 'text-red-500 border-red-500 bg-red-500/10' :
                                         'text-gray-500 border-gray-600'
                         }`}>
                          {event.status.substring(0, 4)}
                        </span>
                                    </div>
                                </div>

                                <div className="col-span-1 md:col-span-2 flex md:flex-col justify-between md:justify-center items-center md:items-start text-sm">
                                    <div className="text-white font-mono">
                                        {new Date(event.date).toLocaleDateString('fr-CH', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </div>
                                    <div className="text-xs font-mono text-gray-500">
                                        {event.timeDoors}
                                        {isUpcoming && <span className="text-[#FFFF00] ml-2">• À venir</span>}
                                    </div>
                                </div>

                                <div className="col-span-1 hidden md:flex items-center">
                    <span className={`text-[10px] font-mono px-2 py-1 border ${
                        event.status === 'SYNCED' ? 'text-[#00FF00] border-[#00FF00] bg-[#00FF00]/10' :
                            event.status === 'CONFIRMED' ? 'text-[#00FFFF] border-[#00FFFF] bg-[#00FFFF]/10' :
                                event.status === 'CANCELLED' ? 'text-red-500 border-red-500 bg-red-500/10' :
                                    'text-gray-500 border-gray-600'
                    }`}>
                      {event.status === 'SYNCED' ? 'SYNC' : event.status === 'CONFIRMED' ? 'CONF' : event.status === 'CANCELLED' ? 'ANN' : 'BRLN'}
                    </span>
                                </div>

                                <div className="col-span-1 md:col-span-2 flex flex-col justify-center mt-2 md:mt-0">
                                    <div className="flex items-center justify-between text-xs font-mono mb-1">
                                        <span className="text-gray-500">{report?.totalSold || 0}/{event.capacity}</span>
                                        <span style={{ color: fillRate >= 80 ? '#00FF00' : fillRate >= 50 ? '#FFFF00' : '#E91E63' }}>
                        {fillRate.toFixed(0)}%
                      </span>
                                    </div>
                                    <ProgressBar
                                        value={fillRate}
                                        max={100}
                                        color={fillRate >= 80 ? '#00FF00' : fillRate >= 50 ? '#FFFF00' : '#E91E63'}
                                        height="h-1"
                                    />
                                </div>

                                <div className="col-span-1 md:col-span-2 flex items-center justify-between md:justify-end mt-2 md:mt-0">
                                    <span className="md:hidden text-xs text-gray-500 font-mono">Revenus:</span>
                                    <span className="text-[#00FF00] font-mono font-bold">
                      CHF {(report?.totalRevenue || 0).toLocaleString('fr-CH')}
                    </span>
                                </div>

                                <div className="col-span-1 flex items-center justify-end gap-2 mt-2 md:mt-0">
                                    <button
                                        onClick={() => onSelectEvent(event.id)}
                                        className="p-2 text-gray-500 hover:text-[#00FFFF] transition-colors"
                                        title="Voir les détails"
                                    >
                                        <Eye size={16} />
                                    </button>
                                    <button
                                        onClick={() => onEditEvent(event)}
                                        className="p-2 text-gray-500 hover:text-[#E91E63] transition-colors"
                                        title="Modifier"
                                    >
                                        <Edit3 size={16} />
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

// ===========================================
// COMPOSANT PRINCIPAL (Mise à jour)
// ===========================================
const DashboardPage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState<HeedsEvent[]>([]);
    const [selectedEventId, setSelectedEventId] = useState<string>("");
    const [report, setReport] = useState<SalesReport | null>(null);
    const [viewMode, setViewMode] = useState<'event' | 'global'>('event');
    const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null);
    const [allReports, setAllReports] = useState<Map<string, SalesReport>>(new Map());

    const [filters, setFilters] = useState<FilterState>({
        search: '',
        status: 'all',
        venue: 'all',
        time: 'all',
        minFillRate: 0,
        maxFillRate: 100,
        genre: ''
    });

    const [sortField, setSortField] = useState<SortField>('date');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
    const [editingEvent, setEditingEvent] = useState<HeedsEvent | null>(null);

    // States pour le flux de vente et tickets (comme précédemment)
    const [selectedSale, setSelectedSale] = useState<any>(null);
    const [ticketModalOpen, setTicketModalOpen] = useState(false);

    useEffect(() => {
        api.getEvents().then(data => {
            setEvents(data);
            if (data.length > 0) setSelectedEventId(data[0].id);
        });
    }, []);

    useEffect(() => {
        if (selectedEventId && viewMode === 'event') {
            setLoading(true);
            api.getSalesReport(selectedEventId)
                .then(data => setReport(data))
                .finally(() => setLoading(false));
        }
    }, [selectedEventId, viewMode]);

    useEffect(() => {
        if (viewMode === 'global' && events.length > 0) {
            setLoading(true);

            const fetchAllReports = async () => {
                const reportsMap = new Map<string, SalesReport>();

                for (const event of events) {
                    try {
                        const report = await api.getSalesReport(event.id);
                        reportsMap.set(event.id, report);
                    } catch (e) {
                        console.warn(`Impossible de charger le rapport pour ${event.id}`);
                    }
                }

                setAllReports(reportsMap);

                const reports = Array.from(reportsMap.values());
                const stats = calculateGlobalStats(events, reports);
                setGlobalStats(stats);
                setLoading(false);
            };

            fetchAllReports();
        }
    }, [viewMode, events]);

    const calculateGlobalStats = (events: HeedsEvent[], reports: SalesReport[]): GlobalStats => {
        const today = new Date();

        const totalRevenue = reports.reduce((sum, r) => sum + r.totalRevenue, 0);
        const totalSold = reports.reduce((sum, r) => sum + r.totalSold, 0);
        const totalCapacity = reports.reduce((sum, r) => sum + r.capacity, 0);
        const syncedEvents = events.filter(e => e.status === 'SYNCED').length;
        const upcomingEvents = events.filter(e => new Date(e.date) > today).length;

        const revenueByEvent = reports.map(r => ({
            name: r.eventTitle,
            id: r.eventId,
            revenue: r.totalRevenue,
            sold: r.totalSold,
            capacity: r.capacity,
            fillRate: r.capacity > 0 ? (r.totalSold / r.capacity) * 100 : 0,
            date: r.eventDate
        })).sort((a, b) => b.revenue - a.revenue);

        const locationMap: Record<string, number> = {};
        reports.forEach(r => {
            r.buyerLocations.forEach(loc => {
                const cityName = getSwissCity(loc.city);
                locationMap[cityName] = (locationMap[cityName] || 0) + loc.count;
            });
        });
        const allLocations = Object.entries(locationMap)
            .map(([city, count]) => ({ city, count }))
            .sort((a, b) => b.count - a.count);

        const categoryMap: Record<string, { sold: number; revenue: number }> = {};
        reports.forEach(r => {
            r.salesByCategory.forEach(cat => {
                if (!categoryMap[cat.category]) {
                    categoryMap[cat.category] = { sold: 0, revenue: 0 };
                }
                categoryMap[cat.category].sold += cat.sold;
                categoryMap[cat.category].revenue += cat.revenue;
            });
        });
        const allCategories = Object.entries(categoryMap)
            .map(([category, data]) => ({ category, ...data }))
            .sort((a, b) => b.revenue - a.revenue);

        const salesByDayMap: Record<string, number> = {};
        reports.forEach(r => {
            r.salesByDay.forEach(day => {
                salesByDayMap[day.date] = (salesByDayMap[day.date] || 0) + day.sold;
            });
        });
        const salesTrend = Object.entries(salesByDayMap)
            .map(([date, sold]) => ({ date, sold }))
            .sort((a, b) => a.date.localeCompare(b.date));

        return {
            totalRevenue,
            totalSold,
            totalCapacity,
            totalEvents: events.length,
            syncedEvents,
            upcomingEvents,
            revenueByEvent,
            allLocations,
            allCategories,
            salesTrend
        };
    };

    const uniqueGenres = useMemo(() => {
        return [...new Set(events.map(e => e.genre).filter(Boolean))] as string[];
    }, [events]);

    const filteredEvents = useMemo(() => {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 7);
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        let result = events.filter(event => {
            const eventDate = new Date(event.date);
            const report = allReports.get(event.id);
            const fillRate = report ? (report.totalSold / report.capacity) * 100 : 0;

            if (filters.search) {
                const search = filters.search.toLowerCase();
                if (!event.title.toLowerCase().includes(search) &&
                    !event.venue.toLowerCase().includes(search) &&
                    !(event.genre?.toLowerCase().includes(search))) {
                    return false;
                }
            }

            if (filters.status !== 'all' && event.status !== filters.status) return false;
            if (filters.venue !== 'all' && event.venue !== filters.venue) return false;
            if (filters.time === 'upcoming' && eventDate <= today) return false;
            if (filters.time === 'past' && eventDate > today) return false;
            if (filters.time === 'thisWeek' && (eventDate < startOfWeek || eventDate > endOfWeek)) return false;
            if (filters.time === 'thisMonth' && (eventDate < startOfMonth || eventDate > endOfMonth)) return false;
            if (fillRate < filters.minFillRate || fillRate > filters.maxFillRate) return false;
            if (filters.genre && event.genre !== filters.genre) return false;

            return true;
        });

        result.sort((a, b) => {
            const reportA = allReports.get(a.id);
            const reportB = allReports.get(b.id);
            let comparison = 0;

            switch (sortField) {
                case 'title':
                    comparison = a.title.localeCompare(b.title);
                    break;
                case 'date':
                    comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
                    break;
                case 'revenue':
                    comparison = (reportA?.totalRevenue || 0) - (reportB?.totalRevenue || 0);
                    break;
                case 'fillRate':
                    const fillA = reportA ? (reportA.totalSold / reportA.capacity) * 100 : 0;
                    const fillB = reportB ? (reportB.totalSold / reportB.capacity) * 100 : 0;
                    comparison = fillA - fillB;
                    break;
                case 'capacity':
                    comparison = a.capacity - b.capacity;
                    break;
                case 'status':
                    comparison = a.status.localeCompare(b.status);
                    break;
            }

            return sortDirection === 'asc' ? comparison : -comparison;
        });

        return result;
    }, [events, filters, sortField, sortDirection, allReports]);

    const filteredStats = useMemo(() => {
        if (!globalStats) return null;

        const filteredReports = filteredEvents.map(e => allReports.get(e.id)).filter(Boolean) as SalesReport[];

        return {
            totalRevenue: filteredReports.reduce((sum, r) => sum + r.totalRevenue, 0),
            totalSold: filteredReports.reduce((sum, r) => sum + r.totalSold, 0),
            totalCapacity: filteredReports.reduce((sum, r) => sum + r.capacity, 0),
            count: filteredEvents.length
        };
    }, [filteredEvents, allReports, globalStats]);

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(d => d === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('desc');
        }
    };

    const resetFilters = () => {
        setFilters({
            search: '',
            status: 'all',
            venue: 'all',
            time: 'all',
            minFillRate: 0,
            maxFillRate: 100,
            genre: ''
        });
    };

    const handleSaveEvent = async (event: HeedsEvent) => {
        try {
            const updatedEvent = await api.updateEvent(event);
            setEvents(prev => prev.map(e => e.id === event.id ? updatedEvent : e));
            setEditingEvent(null);
        } catch (error) {
            console.error('❌ Erreur:', error);
            alert('Erreur lors de la sauvegarde');
        }
    };

    const handlePushToPetzi = async (event: HeedsEvent) => {
        const updatedEvent = {
            ...event,
            status: 'SYNCED' as EventStatus,
            lastSyncAt: new Date().toISOString()
        };

        setEvents(prev => prev.map(e => e.id === event.id ? updatedEvent : e));
        setEditingEvent(null);
    };

    const selectedEvent = events.find(e => e.id === selectedEventId);
    const isEmptyDraft = selectedEvent?.status === 'DRAFT' && report?.totalSold === 0;

    const transformedLocations = useMemo(() => {
        if (!report) return [];
        const cityMap: Record<string, number> = {};
        report.buyerLocations.forEach(loc => {
            const cityName = getSwissCity(loc.city);
            cityMap[cityName] = (cityMap[cityName] || 0) + loc.count;
        });
        return Object.entries(cityMap)
            .map(([city, count]) => ({ city, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 6);
    }, [report]);

    const alerts = useMemo(() => {
        if (!report || !selectedEvent) return [];
        const alertList: { type: 'success' | 'warning' | 'danger' | 'info'; message: string }[] = [];
        const fillRate = (report.totalSold / report.capacity) * 100;
        const eventDate = new Date(selectedEvent.date);
        const today = new Date();
        const daysUntil = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        if (fillRate >= 95) alertList.push({ type: 'success', message: 'Événement presque complet !' });
        else if (fillRate >= 80) alertList.push({ type: 'warning', message: 'Plus que quelques places !' });
        if (daysUntil > 0 && daysUntil <= 7) alertList.push({ type: 'info', message: `J-${daysUntil} avant l'événement` });
        if (daysUntil > 0 && daysUntil <= 3 && fillRate < 50) alertList.push({ type: 'danger', message: 'Ventes faibles, événement imminent !' });

        return alertList;
    }, [report, selectedEvent]);

    return (
        <div className="space-y-8">
            {/* Header avec toggle de vue */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-['Anton'] text-white tracking-wider">
                        TABLEAU DE BORD
                    </h1>
                    <p className="text-gray-500 font-mono text-sm mt-1">
                        {viewMode === 'event' ? 'Analyse par événement' : 'Vue globale & filtres avancés'}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                    <div className="flex border-2 border-white">
                        <button
                            onClick={() => setViewMode('event')}
                            className={`flex-1 sm:flex-none px-4 py-2 text-xs font-mono uppercase transition-all ${
                                viewMode === 'event' ? 'bg-[#E91E63] text-white' : 'bg-black text-white hover:bg-white hover:text-black'
                            }`}
                        >
                            <Eye size={14} className="inline mr-2" />
                            Par événement
                        </button>
                        <button
                            onClick={() => setViewMode('global')}
                            className={`flex-1 sm:flex-none px-4 py-2 text-xs font-mono uppercase transition-all ${
                                viewMode === 'global' ? 'bg-[#E91E63] text-white' : 'bg-black text-white hover:bg-white hover:text-black'
                            }`}
                        >
                            <BarChart3 size={14} className="inline mr-2" />
                            Vue globale
                        </button>
                    </div>

                    {viewMode === 'event' && (
                        <select
                            value={selectedEventId}
                            onChange={(e) => setSelectedEventId(e.target.value)}
                            className="bg-black border-2 border-white text-white px-4 py-2 font-mono text-sm focus:border-[#E91E63] focus:outline-none w-full sm:w-[300px]"
                        >
                            {events.map(event => (
                                <option key={event.id} value={event.id}>
                                    {event.title}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
            </div>

            {/* ================================================== */}
            {/* VUE PAR ÉVÉNEMENT */}
            {/* ================================================== */}
            {viewMode === 'event' && loading && (
                <div className="h-96 flex flex-col items-center justify-center gap-4 border-2 border-dashed border-gray-800">
                    <RefreshCw size={40} className="animate-spin text-[#E91E63]" />
                    <span className="font-mono text-[#E91E63] uppercase animate-pulse">
            Chargement des données...
          </span>
                </div>
            )}

            {viewMode === 'event' && !loading && report && !isEmptyDraft && (
                <>
                    {alerts.length > 0 && (
                        <div className="flex flex-wrap gap-3">
                            {alerts.map((alert, idx) => (
                                <AlertBadge key={idx} type={alert.type}>{alert.message}</AlertBadge>
                            ))}
                        </div>
                    )}

                    {/* Stats Grid - Responsive: 1 col mobile, 2 tablet, 4 desktop */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 xl:gap-6">
                        <StatCard
                            title="Revenus totaux"
                            value={`CHF ${report.totalRevenue.toLocaleString('fr-CH')}`}
                            icon={DollarSign}
                            color="secondary"
                            subtext={`Prix moyen: ${report.totalSold > 0 ? (report.totalRevenue / report.totalSold).toFixed(0) : 0} CHF`}
                        />
                        <StatCard
                            title="Billets vendus"
                            value={report.totalSold}
                            icon={Ticket}
                            color="primary"
                            subtext={`${report.capacity - report.totalSold} places restantes`}
                        />
                        <StatCard
                            title="Taux de remplissage"
                            value={`${report.fillRate.toFixed(1)}%`}
                            icon={TrendingUp}
                            color="tertiary"
                        />
                        <StatCard
                            title="Capacité"
                            value={report.capacity}
                            icon={Users}
                            color="primary"
                        />
                    </div>

                    {/* Main Content Grid - Responsive split */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
                        {/* Left Column - Charts */}
                        <div className="xl:col-span-2 space-y-8">
                            {/* Sales Chart */}
                            <div className="border-2 border-white bg-[#111] p-0 relative shadow-[8px_8px_0px_0px_#222]">
                                <div className="absolute -top-3 -right-3 bg-[#E91E63] text-white px-3 py-1 text-xs font-mono font-bold uppercase shadow-[4px_4px_0px_0px_white]">
                                    Ventes
                                </div>
                                <div className="p-4 sm:p-6 border-b-2 border-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                    <h3 className="text-xl sm:text-2xl text-white">ÉVOLUTION DES VENTES</h3>
                                    <span className="text-xs font-mono text-gray-500">
                    {report.salesByDay.length} jours de données
                  </span>
                                </div>
                                <div className="h-[250px] sm:h-[300px] w-full p-2 sm:p-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={report.salesByDay}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                            <XAxis
                                                dataKey="date"
                                                stroke="#666"
                                                fontSize={10}
                                                tickFormatter={(val) => {
                                                    const date = new Date(val);
                                                    return `${date.getDate()}/${date.getMonth() + 1}`;
                                                }}
                                                fontFamily="Space Mono"
                                            />
                                            <YAxis stroke="#666" fontSize={10} fontFamily="Space Mono" />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: '#000',
                                                    border: '2px solid white',
                                                    color: '#fff',
                                                    fontFamily: 'Space Mono'
                                                }}
                                                labelFormatter={(val) => new Date(val).toLocaleDateString('fr-CH')}
                                                formatter={(value: number) => [`${value} billets`, 'Vendus']}
                                            />
                                            <Area type="monotone" dataKey="sold" stroke="#E91E63" strokeWidth={2} fillOpacity={0.3} fill="#E91E63" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Category & Geo Distribution */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                                {/* Pie Chart */}
                                <div className="border-2 border-white bg-[#111] p-6">
                                    <h3 className="text-lg sm:text-xl text-white mb-4 uppercase">Répartition par catégorie</h3>
                                    <div className="h-[200px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={report.salesByCategory}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={50}
                                                    outerRadius={80}
                                                    paddingAngle={2}
                                                    dataKey="sold"
                                                    nameKey="category"
                                                >
                                                    {report.salesByCategory.map((_, index) => (
                                                        <Cell key={`cell-${index}`} fill={categoryColors[index % categoryColors.length]} />
                                                    ))}
                                                </Pie>
                                                {/* UTILISATION DU TOOLTIP PERSONNALISÉ ICI */}
                                                <Tooltip content={<CustomPieTooltip />} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="mt-4 space-y-2">
                                        {report.salesByCategory.map((cat, idx) => (
                                            <div key={idx} className="flex items-center justify-between text-xs font-mono">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3" style={{ backgroundColor: categoryColors[idx % categoryColors.length] }} />
                                                    <span className="text-white">{cat.category}</span>
                                                </div>
                                                <span className="text-gray-500">
                          CHF {cat.revenue.toLocaleString('fr-CH')} ({cat.sold})
                        </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Geo Distribution */}
                                <div className="border-2 border-white bg-[#111] p-6">
                                    <h3 className="text-lg sm:text-xl text-white mb-4 uppercase flex items-center gap-2">
                                        <MapPin size={20} className="text-[#00FFFF]" />
                                        Provenance
                                    </h3>
                                    <div className="space-y-4">
                                        {transformedLocations.map((loc, idx) => {
                                            const percentage = (loc.count / report.totalSold) * 100;
                                            return (
                                                <div key={idx}>
                                                    <div className="flex justify-between text-xs font-mono mb-1">
                            <span className="text-white flex items-center gap-2">
                              {idx === 0 && <span className="text-[#FFFF00]">🥇</span>}
                                {idx === 1 && <span className="text-gray-400">🥈</span>}
                                {idx === 2 && <span className="text-orange-600">🥉</span>}
                                {loc.city}
                            </span>
                                                        <span className="text-[#00FFFF]">
                              {loc.count} ({percentage.toFixed(1)}%)
                            </span>
                                                    </div>
                                                    <ProgressBar
                                                        value={loc.count}
                                                        max={transformedLocations[0]?.count || 1}
                                                        color={idx === 0 ? '#FFFF00' : '#00FFFF'}
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Event Info */}
                        <div className="space-y-6 lg:space-y-8">
                            <div className="border-2 border-white bg-[#111] overflow-hidden relative shadow-[8px_8px_0px_0px_#222]">
                                <button
                                    onClick={() => selectedEvent && setEditingEvent(selectedEvent)}
                                    className="absolute top-4 right-4 z-10 p-2 bg-black/50 border border-white text-white hover:bg-[#E91E63] hover:border-[#E91E63] transition-all"
                                >
                                    <Edit3 size={16} />
                                </button>

                                {selectedEvent?.imageUrl && (
                                    <img
                                        src={selectedEvent.imageUrl}
                                        alt={selectedEvent.title}
                                        className="w-full h-48 object-cover"
                                    />
                                )}
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-2xl font-['Anton'] text-white leading-tight">
                                                {selectedEvent?.title}
                                            </h3>
                                            {selectedEvent?.subtitle && (
                                                <p className="text-gray-500 font-mono text-sm mt-1">{selectedEvent.subtitle}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-3 text-sm font-mono">
                                        <div className="flex items-center gap-3 text-gray-400">
                                            <Calendar size={16} className="text-[#FFFF00]" />
                                            <span>{new Date(report.eventDate).toLocaleDateString('fr-CH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-400">
                                            <Clock size={16} className="text-[#00FFFF]" />
                                            <span>Portes: {selectedEvent?.timeDoors} • Concert: {selectedEvent?.timeStart}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-400">
                                            <MapPin size={16} className="text-[#E91E63]" />
                                            <span>{report.venue}</span>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-gray-800">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <div className="text-[10px] font-mono text-gray-500 uppercase">Prévente</div>
                                                <div className="text-xl font-['Anton'] text-[#FFFF00]">
                                                    CHF {selectedEvent?.pricing.presale}.-
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-mono text-gray-500 uppercase">Sur place</div>
                                                <div className="text-xl font-['Anton'] text-white">
                                                    CHF {selectedEvent?.pricing.door}.-
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 p-4 bg-[#00FF00]/10 border border-[#00FF00]">
                                        <div className="text-[10px] font-mono text-[#00FF00] uppercase">Revenus totaux</div>
                                        <div className="text-3xl font-['Anton'] text-[#00FF00]">
                                            CHF {report.totalRevenue.toLocaleString('fr-CH')}.-
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Fill Gauge */}
                            <div className="border-2 border-white bg-[#111] p-6 flex flex-col items-center">
                                <h3 className="text-xl text-white mb-4 uppercase w-full text-center">Jauge de remplissage</h3>
                                <FillGauge value={report.totalSold} max={report.capacity} size={140} />
                                <div className="mt-4 text-center">
                                    <div className="text-xs font-mono text-gray-500">
                                        {report.totalSold} / {report.capacity} places
                                    </div>
                                    <div className="text-xs font-mono text-[#FFFF00] mt-1">
                                        {report.capacity - report.totalSold} disponibles
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* ================================================== */}
            {/* VUE GLOBALE */}
            {/* ================================================== */}
            {viewMode === 'global' && !loading && globalStats && (
                <>
                    <FilterBar
                        filters={filters}
                        setFilters={setFilters}
                        genres={uniqueGenres}
                        resultCount={filteredEvents.length}
                        totalCount={events.length}
                        onReset={resetFilters}
                    />

                    {filteredStats && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 xl:gap-6">
                            <StatCard
                                title="Revenus (filtré)"
                                value={`CHF ${filteredStats.totalRevenue.toLocaleString('fr-CH')}`}
                                icon={DollarSign}
                                color="secondary"
                                subtext={`${((filteredStats.totalRevenue / globalStats.totalRevenue) * 100).toFixed(0)}% du total`}
                            />
                            <StatCard
                                title="Billets vendus (filtré)"
                                value={filteredStats.totalSold}
                                icon={Ticket}
                                color="primary"
                                subtext={`Taux: ${filteredStats.totalCapacity > 0 ? ((filteredStats.totalSold / filteredStats.totalCapacity) * 100).toFixed(1) : 0}%`}
                            />
                            <StatCard
                                title="Événements"
                                value={filteredStats.count}
                                icon={Calendar}
                                color="tertiary"
                                subtext={`Sur ${events.length} au total`}
                            />
                            <StatCard
                                title="Capacité totale"
                                value={filteredStats.totalCapacity.toLocaleString('fr-CH')}
                                icon={Users}
                                color="primary"
                                subtext={`${filteredStats.totalCapacity - filteredStats.totalSold} disponibles`}
                            />
                        </div>
                    )}

                    {/* Global Charts Row - 2/3 for Trend, 1/3 for Location */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
                        {/* Sales Trend */}
                        <div className="xl:col-span-2 border-2 border-white bg-[#111] p-0 relative shadow-[8px_8px_0px_0px_#222]">
                            <div className="absolute -top-3 -right-3 bg-[#E91E63] text-white px-3 py-1 text-xs font-mono font-bold uppercase shadow-[4px_4px_0px_0px_white]">
                                Tendance
                            </div>
                            <div className="p-4 sm:p-6 border-b-2 border-white">
                                <h3 className="text-xl sm:text-2xl text-white">ÉVOLUTION GLOBALE DES VENTES</h3>
                            </div>
                            <div className="h-[250px] sm:h-[300px] w-full p-2 sm:p-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={globalStats.salesTrend}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                        <XAxis
                                            dataKey="date"
                                            stroke="#666"
                                            fontSize={10}
                                            tickFormatter={(val) => {
                                                const date = new Date(val);
                                                return `${date.getDate()}/${date.getMonth() + 1}`;
                                            }}
                                            fontFamily="Space Mono"
                                        />
                                        <YAxis stroke="#666" fontSize={10} fontFamily="Space Mono" />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#000', border: '2px solid white', color: '#fff', fontFamily: 'Space Mono' }}
                                            formatter={(value: number) => [`${value} billets`, 'Vendus']}
                                        />
                                        <Area type="monotone" dataKey="sold" stroke="#00FFFF" strokeWidth={2} fillOpacity={0.3} fill="#00FFFF" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Global Provenance */}
                        <div className="xl:col-span-1 border-2 border-white bg-[#111] p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl text-white uppercase flex items-center gap-2">
                                    <MapPin size={20} className="text-[#00FFFF]" />
                                    Provenance globale
                                </h3>
                                <span className="text-xs font-mono text-gray-500">
                  {globalStats.allLocations.length} villes
                </span>
                            </div>

                            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                                {globalStats.allLocations.slice(0, 10).map((loc, idx) => {
                                    const percentage = (loc.count / globalStats.totalSold) * 100;
                                    return (
                                        <div key={idx}>
                                            <div className="flex justify-between text-xs font-mono mb-1">
                        <span className="text-white flex items-center gap-2">
                          {idx === 0 && <span className="text-[#FFFF00]">🥇</span>}
                            {idx === 1 && <span className="text-gray-400">🥈</span>}
                            {idx === 2 && <span className="text-orange-600">🥉</span>}
                            {loc.city}
                        </span>
                                                <span className="text-[#00FFFF] font-bold">
                          {loc.count} <span className="text-gray-500">({percentage.toFixed(1)}%)</span>
                        </span>
                                            </div>
                                            <ProgressBar
                                                value={loc.count}
                                                max={globalStats.allLocations[0]?.count || 1}
                                                color={idx === 0 ? '#FFFF00' : '#00FFFF'}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Secondary Row: Feed + Comparator */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
                        <div className="xl:col-span-1">
                            <RecentSalesFeed
                                onSaleClick={(sale) => {
                                    setSelectedSale(sale);
                                    setTicketModalOpen(true);
                                }}
                            />
                        </div>

                        <div className="xl:col-span-2">
                            <EventComparator
                                reports={filteredEvents
                                    .filter(e => allReports.has(e.id))
                                    .map(e => allReports.get(e.id)!)
                                    .slice(0, 10)
                                }
                            />
                        </div>
                    </div>

                    <EventsTable
                        events={filteredEvents}
                        reports={allReports}
                        sortField={sortField}
                        sortDirection={sortDirection}
                        onSort={handleSort}
                        onSelectEvent={(id) => {
                            setSelectedEventId(id);
                            setViewMode('event');
                        }}
                        onEditEvent={setEditingEvent}
                    />

                    <TicketVisual
                        isOpen={ticketModalOpen}
                        onClose={() => setTicketModalOpen(false)}
                        sale={selectedSale}
                        eventTitle={selectedSale ? events.find(e => e.id === selectedSale.eventId)?.title : undefined}
                    />
                </>
            )}

            {viewMode === 'global' && loading && (
                <div className="h-96 flex flex-col items-center justify-center gap-4 border-2 border-dashed border-gray-800">
                    <RefreshCw size={40} className="animate-spin text-[#00FFFF]" />
                    <span className="font-mono text-[#00FFFF] uppercase animate-pulse">
            Agrégation des données...
          </span>
                </div>
            )}

            {editingEvent && (
                <EditEventModal
                    event={editingEvent}
                    onClose={() => setEditingEvent(null)}
                    onSave={handleSaveEvent}
                    onPushToPetzi={handlePushToPetzi}
                />
            )}
        </div>
    );
};

export default DashboardPage;