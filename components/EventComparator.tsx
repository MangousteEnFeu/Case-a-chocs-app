import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { GitCompare, Plus, X, TrendingUp, Ticket, DollarSign } from 'lucide-react';

interface EventOption {
    id: string;
    title: string;
    capacity: number;
}

interface EventStats {
    id: string;
    title: string;
    revenue: number;
    tickets: number;
    capacity: number;
    fillRate: number;
}

interface EventComparatorProps {
    events: EventOption[];
}

const COLORS = ['#E91E63', '#00FFFF', '#FFFF00', '#00FF00'];

const EventComparator: React.FC<EventComparatorProps> = ({ events }) => {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [stats, setStats] = useState<EventStats[]>([]);
    const [loading, setLoading] = useState(false);

    const addEvent = (id: string) => {
        if (selectedIds.length < 4 && !selectedIds.includes(id)) {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const removeEvent = (id: string) => {
        setSelectedIds(selectedIds.filter(eid => eid !== id));
    };

    useEffect(() => {
        const fetchStats = async () => {
            if (selectedIds.length === 0) {
                setStats([]);
                return;
            }

            setLoading(true);
            const results: EventStats[] = [];

            for (const id of selectedIds) {
                try {
                    const response = await fetch(`http://localhost:8080/api/sales/report/${id}`);
                    if (response.ok) {
                        const data = await response.json();
                        results.push({
                            id,
                            title: data.eventTitle,
                            revenue: data.totalRevenue,
                            tickets: data.totalSold,
                            capacity: data.capacity,
                            fillRate: data.fillRate
                        });
                    }
                } catch (error) {
                    console.error(`Erreur pour ${id}:`, error);
                }
            }

            setStats(results);
            setLoading(false);
        };

        fetchStats();
    }, [selectedIds]);

    const chartData = stats.map((s, idx) => ({
        name: s.title.length > 15 ? s.title.substring(0, 15) + '...' : s.title,
        revenue: s.revenue,
        tickets: s.tickets,
        fill: COLORS[idx]
    }));

    return (
        <div className="border-2 border-white bg-[#111]">
            {/* Header */}
            <div className="bg-white text-black px-4 py-3 font-mono font-bold uppercase flex items-center gap-2">
                <GitCompare size={18} />
                Comparateur d'événements
            </div>

            <div className="p-6 space-y-6">
                {/* Sélecteur */}
                <div>
                    <p className="text-xs font-mono text-gray-500 uppercase mb-2">
                        Sélectionner 2 à 4 événements ({selectedIds.length}/4)
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                        {selectedIds.map((id, idx) => {
                            const event = events.find(e => e.id === id);
                            return (
                                <div
                                    key={id}
                                    className="flex items-center gap-2 px-3 py-1 border-2 text-sm font-mono"
                                    style={{ borderColor: COLORS[idx], color: COLORS[idx] }}
                                >
                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                                    <span className="truncate max-w-[150px]">{event?.title}</span>
                                    <button onClick={() => removeEvent(id)} className="hover:text-white">
                                        <X size={14} />
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    {selectedIds.length < 4 && (
                        <select
                            onChange={(e) => {
                                if (e.target.value) {
                                    addEvent(e.target.value);
                                    e.target.value = '';
                                }
                            }}
                            className="bg-black border border-gray-700 text-white px-3 py-2 font-mono text-sm focus:border-[#E91E63] focus:outline-none w-full"
                        >
                            <option value="">+ Ajouter un événement...</option>
                            {events
                                .filter(e => !selectedIds.includes(e.id))
                                .map(e => (
                                    <option key={e.id} value={e.id}>{e.title}</option>
                                ))}
                        </select>
                    )}
                </div>

                {/* Graphique */}
                {loading ? (
                    <div className="h-[200px] flex items-center justify-center">
                        <span className="text-[#E91E63] font-mono animate-pulse">Chargement...</span>
                    </div>
                ) : stats.length >= 2 ? (
                    <>
                        <div className="h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
                                    <XAxis type="number" stroke="#666" fontSize={10} fontFamily="Space Mono" />
                                    <YAxis
                                        type="category"
                                        dataKey="name"
                                        stroke="#666"
                                        fontSize={10}
                                        fontFamily="Space Mono"
                                        width={120}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#000',
                                            border: '2px solid white',
                                            fontFamily: 'Space Mono'
                                        }}
                                        formatter={(value: number) => [`CHF ${value.toLocaleString()}`, 'Revenus']}
                                    />
                                    <Bar dataKey="revenue" fill="#E91E63">
                                        {chartData.map((entry, idx) => (
                                            <rect key={idx} fill={COLORS[idx]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Cartes métriques */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {stats.map((s, idx) => (
                                <div key={s.id} className="border-2 p-4" style={{ borderColor: COLORS[idx] }}>
                                    <p className="text-xs font-mono text-gray-500 truncate mb-2">{s.title}</p>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <DollarSign size={14} className="text-[#00FF00]" />
                                            <span className="font-mono text-[#00FF00] text-sm">
                        {s.revenue.toLocaleString()}
                      </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <Ticket size={14} className="text-white" />
                                            <span className="font-mono text-white text-sm">{s.tickets}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <TrendingUp size={14} style={{ color: COLORS[idx] }} />
                                            <span className="font-mono text-sm" style={{ color: COLORS[idx] }}>
                        {s.fillRate.toFixed(1)}%
                      </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-12 text-gray-500 font-mono">
                        <GitCompare size={40} className="mx-auto mb-4 opacity-50" />
                        <p>Sélectionnez au moins 2 événements pour comparer</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventComparator;