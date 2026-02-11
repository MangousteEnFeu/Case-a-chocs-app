import React, { useState, useMemo } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { SalesReport } from '../types';
import { Calendar, TrendingUp, Layers } from 'lucide-react';

interface EventComparatorProps {
    reports: SalesReport[];
}

const COLORS = ['#E91E63', '#00FFFF', '#FFFF00', '#00FF00', '#FF5722', '#9C27B0'];

const EventComparator: React.FC<EventComparatorProps> = ({ reports }) => {
    const [mode, setMode] = useState<'daily' | 'cumulative'>('daily');

    // Transformation des données pour le graphique
    const chartData = useMemo(() => {
        if (reports.length === 0) return [];

        // 1. Récupérer toutes les dates uniques
        const allDates = new Set<string>();
        reports.forEach(report => {
            report.salesByDay.forEach(day => allDates.add(day.date));
        });

        // 2. Trier les dates chronologiquement
        const sortedDates = Array.from(allDates).sort();

        // 3. Construire les points de données
        // Pour le mode cumulatif, on garde une trace du total courant pour chaque événement
        const runningTotals: Record<string, number> = {};
        reports.forEach(r => runningTotals[r.eventId] = 0);

        return sortedDates.map(date => {
            const dataPoint: any = { date };

            reports.forEach(report => {
                // Trouver la vente du jour pour cet événement
                const daySale = report.salesByDay.find(d => d.date === date);
                const dailyCount = daySale ? daySale.sold : 0;

                if (mode === 'daily') {
                    dataPoint[report.eventTitle] = dailyCount;
                } else {
                    // Mode cumulatif : on ajoute au total courant
                    runningTotals[report.eventId] += dailyCount;
                    dataPoint[report.eventTitle] = runningTotals[report.eventId];
                }
            });

            return dataPoint;
        });
    }, [reports, mode]);

    if (reports.length === 0) {
        return (
            <div className="border-2 border-white bg-[#111] p-6 text-center text-gray-500 font-mono">
                Aucune donnée à comparer.
            </div>
        );
    }

    return (
        <div className="border-2 border-white bg-[#111] p-0 relative shadow-[8px_8px_0px_0px_#222]">
            {/* En-tête avec contrôles */}
            <div className="p-4 sm:p-6 border-b-2 border-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h3 className="text-xl text-white uppercase flex items-center gap-2">
                        <TrendingUp size={24} className="text-[#E91E63]" />
                        Comparateur de Courbes
                    </h3>
                    <p className="text-xs font-mono text-gray-500 mt-1">
                        Analyse comparative de {reports.length} événement(s)
                    </p>
                </div>

                {/* Toggle Switch */}
                <div className="flex bg-black border border-gray-700 p-1 rounded-none">
                    <button
                        onClick={() => setMode('daily')}
                        className={`flex items-center gap-2 px-3 py-1.5 text-xs font-mono uppercase transition-all ${
                            mode === 'daily'
                                ? 'bg-[#E91E63] text-white shadow-[2px_2px_0px_0px_white]'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        <Calendar size={14} />
                        Par Jour
                    </button>
                    <button
                        onClick={() => setMode('cumulative')}
                        className={`flex items-center gap-2 px-3 py-1.5 text-xs font-mono uppercase transition-all ${
                            mode === 'cumulative'
                                ? 'bg-[#00FFFF] text-black shadow-[2px_2px_0px_0px_white]'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        <Layers size={14} />
                        Cumulé Total
                    </button>
                </div>
            </div>

            {/* Zone Graphique */}
            <div className="h-[350px] w-full p-2 sm:p-4 bg-gradient-to-b from-[#111] to-black">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            {reports.map((report, index) => (
                                <linearGradient key={report.eventId} id={`color-${report.eventId}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0}/>
                                </linearGradient>
                            ))}
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                        <XAxis
                            dataKey="date"
                            stroke="#666"
                            fontSize={10}
                            tickFormatter={(val) => {
                                const d = new Date(val);
                                return `${d.getDate()}/${d.getMonth() + 1}`;
                            }}
                            fontFamily="Space Mono"
                        />
                        <YAxis stroke="#666" fontSize={10} fontFamily="Space Mono" />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#000', border: '2px solid white', color: '#fff', fontFamily: 'Space Mono' }}
                            labelFormatter={(val) => new Date(val).toLocaleDateString('fr-CH')}
                            itemStyle={{ fontSize: '12px' }}
                        />
                        <Legend
                            wrapperStyle={{ paddingTop: '20px', fontFamily: 'Space Mono', fontSize: '10px' }}
                            iconType="circle"
                        />
                        {reports.map((report, index) => (
                            <Area
                                key={report.eventId}
                                type="monotone" // C'est ici que se fait l'ondulation
                                dataKey={report.eventTitle}
                                stroke={COLORS[index % COLORS.length]}
                                fillOpacity={1}
                                fill={`url(#color-${report.eventId})`}
                                strokeWidth={2}
                                stackId={mode === 'cumulative' ? undefined : index} // Stack si on veut empiler, sinon undefined pour superposer
                            />
                        ))}
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default EventComparator;