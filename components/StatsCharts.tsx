import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { Music, Calendar } from 'lucide-react';

interface GenreStat {
    genre: string;
    revenue: number;
    tickets: number;
}

interface DayStat {
    day: string;
    dayFr: string;
    revenue: number;
    tickets: number;
}

interface StatsChartsProps {
    genreStats: GenreStat[];
    dayStats: DayStat[];
}

const DAYS_FR = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

const StatsCharts: React.FC<StatsChartsProps> = ({ genreStats, dayStats }) => {
    const [activeTab, setActiveTab] = useState<'genre' | 'day'>('genre');

    return (
        <div className="border-2 border-white bg-[#111]">
            {/* Tabs */}
            <div className="flex border-b-2 border-white">
                <button
                    onClick={() => setActiveTab('genre')}
                    className={`flex-1 px-4 py-3 font-mono text-sm uppercase flex items-center justify-center gap-2 transition-all ${
                        activeTab === 'genre'
                            ? 'bg-[#E91E63] text-white'
                            : 'bg-black text-gray-400 hover:text-white'
                    }`}
                >
                    <Music size={16} />
                    Par Genre
                </button>
                <button
                    onClick={() => setActiveTab('day')}
                    className={`flex-1 px-4 py-3 font-mono text-sm uppercase flex items-center justify-center gap-2 transition-all ${
                        activeTab === 'day'
                            ? 'bg-[#E91E63] text-white'
                            : 'bg-black text-gray-400 hover:text-white'
                    }`}
                >
                    <Calendar size={16} />
                    Par Jour
                </button>
            </div>

            {/* Contenu */}
            <div className="p-6">
                {activeTab === 'genre' && (
                    <div>
                        <h3 className="text-white font-bold mb-4 uppercase">Revenus par genre musical</h3>

                        {genreStats.length === 0 ? (
                            <p className="text-gray-500 font-mono text-center py-8">Aucune donnée disponible</p>
                        ) : (
                            <>
                                <div className="h-[250px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={genreStats} layout="vertical">
                                            <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
                                            <XAxis type="number" stroke="#666" fontSize={10} fontFamily="Space Mono" />
                                            <YAxis
                                                type="category"
                                                dataKey="genre"
                                                stroke="#666"
                                                fontSize={11}
                                                fontFamily="Space Mono"
                                                width={100}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: '#000',
                                                    border: '2px solid white',
                                                    fontFamily: 'Space Mono'
                                                }}
                                                formatter={(value: number, name: string) => [
                                                    name === 'revenue' ? `CHF ${value.toLocaleString()}` : value,
                                                    name === 'revenue' ? 'Revenus' : 'Billets'
                                                ]}
                                            />
                                            <Bar dataKey="revenue" fill="#E91E63" name="revenue" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Tableau récap */}
                                <div className="mt-4 border border-gray-800">
                                    <div className="grid grid-cols-3 gap-4 p-3 bg-black text-xs font-mono text-gray-500 uppercase">
                                        <span>Genre</span>
                                        <span className="text-right">Billets</span>
                                        <span className="text-right">Revenus</span>
                                    </div>
                                    {genreStats.map((stat, idx) => (
                                        <div key={idx} className="grid grid-cols-3 gap-4 p-3 border-t border-gray-800 text-sm">
                                            <span className="text-white font-bold">{stat.genre}</span>
                                            <span className="text-right text-gray-400 font-mono">{stat.tickets}</span>
                                            <span className="text-right text-[#00FF00] font-mono">CHF {stat.revenue.toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}

                {activeTab === 'day' && (
                    <div>
                        <h3 className="text-white font-bold mb-4 uppercase">Performance par jour de semaine</h3>

                        {dayStats.length === 0 ? (
                            <p className="text-gray-500 font-mono text-center py-8">Aucune donnée disponible</p>
                        ) : (
                            <>
                                <div className="h-[250px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={dayStats}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                            <XAxis
                                                dataKey="dayFr"
                                                stroke="#666"
                                                fontSize={10}
                                                fontFamily="Space Mono"
                                            />
                                            <YAxis yAxisId="left" stroke="#E91E63" fontSize={10} fontFamily="Space Mono" />
                                            <YAxis yAxisId="right" orientation="right" stroke="#00FFFF" fontSize={10} fontFamily="Space Mono" />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: '#000',
                                                    border: '2px solid white',
                                                    fontFamily: 'Space Mono'
                                                }}
                                            />
                                            <Legend />
                                            <Line
                                                yAxisId="left"
                                                type="monotone"
                                                dataKey="revenue"
                                                stroke="#E91E63"
                                                strokeWidth={2}
                                                dot={{ fill: '#E91E63', r: 4 }}
                                                name="Revenus (CHF)"
                                            />
                                            <Line
                                                yAxisId="right"
                                                type="monotone"
                                                dataKey="tickets"
                                                stroke="#00FFFF"
                                                strokeWidth={2}
                                                dot={{ fill: '#00FFFF', r: 4 }}
                                                name="Billets"
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Grille des jours */}
                                <div className="mt-4 grid grid-cols-7 gap-2">
                                    {dayStats.map((stat, idx) => (
                                        <div key={idx} className="border border-gray-800 p-2 text-center">
                                            <p className="text-[10px] font-mono text-gray-500 uppercase">{stat.dayFr.substring(0, 3)}</p>
                                            <p className="text-lg font-bold text-white">{stat.tickets}</p>
                                            <p className="text-[10px] font-mono text-[#00FF00]">{stat.revenue.toLocaleString()}</p>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatsCharts;