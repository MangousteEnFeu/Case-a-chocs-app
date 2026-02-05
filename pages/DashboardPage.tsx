import React, { useState, useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell, PieChart, Pie, Legend
} from 'recharts';
import { MOCK_SALES_REPORT, MOCK_EVENTS } from '../constants';
import { HeedsEvent } from '../types';
import StatCard from '../components/StatCard';
import { DollarSign, Users, Ticket, MapPin, Calendar, TrendingUp } from 'lucide-react';

const DashboardPage: React.FC = () => {
  // Simulate fetching data for the first synced event
  const [selectedEventId, setSelectedEventId] = useState<string>("evt-2024-001");

  const report = MOCK_SALES_REPORT[selectedEventId];
  const eventInfo = MOCK_EVENTS.find(e => e.id === selectedEventId);

  // If no report found (e.g. DRAFT event selected if we allowed it), show fallback
  if (!report || !eventInfo) {
    return <div className="p-8 text-center text-slate-500">No sales data available for this event.</div>;
  }

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Sales Dashboard</h1>
          <p className="text-slate-400">Real-time sales insights from PETZI</p>
        </div>
        
        <div className="bg-slate-900 p-1 rounded-lg border border-slate-800 flex items-center">
            <span className="px-3 text-sm text-slate-500 font-medium">Event:</span>
            <select 
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="bg-transparent border-none text-white text-sm focus:ring-0 cursor-pointer py-1 pl-2 pr-8"
            >
                {MOCK_EVENTS.filter(e => e.status !== 'DRAFT').map(evt => (
                    <option key={evt.id} value={evt.id} className="bg-slate-900 text-white">
                        {evt.title} ({evt.date})
                    </option>
                ))}
            </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
            title="Total Revenue" 
            value={`CHF ${report.totalRevenue.toLocaleString()}`} 
            icon={DollarSign}
            color="emerald"
            subtext="Gross income before fees"
        />
        <StatCard 
            title="Tickets Sold" 
            value={report.totalSold} 
            icon={Ticket}
            color="indigo"
            subtext={`${((report.totalSold / report.capacity) * 100).toFixed(1)}% of capacity`}
        />
        <StatCard 
            title="Capacity" 
            value={report.capacity} 
            icon={Users}
            color="amber"
            subtext={report.venue}
        />
        <StatCard 
            title="Days Until Event" 
            value={Math.ceil((new Date(report.eventDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} 
            icon={Calendar}
            color="rose"
            subtext={report.eventDate}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Over Time */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <TrendingUp size={18} className="text-indigo-500" />
                    Sales Velocity
                </h3>
            </div>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={report.salesByDay}>
                        <defs>
                            <linearGradient id="colorSold" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis 
                            dataKey="date" 
                            stroke="#64748b" 
                            fontSize={12} 
                            tickFormatter={(val) => val.split('-').slice(1).join('/')}
                        />
                        <YAxis stroke="#64748b" fontSize={12} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
                            itemStyle={{ color: '#818cf8' }}
                        />
                        <Area type="monotone" dataKey="sold" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorSold)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Sales by Category */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-6">Ticket Categories</h3>
            <div className="h-[300px] w-full flex flex-col items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={report.salesByCategory}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="sold"
                        >
                            {report.salesByCategory.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                        <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 w-full">
                    {report.salesByCategory.map((cat, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm mb-2 border-b border-slate-800 pb-1 last:border-0">
                            <span className="text-slate-400 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ background: COLORS[idx % COLORS.length] }}></div>
                                {cat.category}
                            </span>
                            <span className="text-white font-medium">CHF {cat.revenue}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>

       {/* Charts Row 2 */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Geo Data */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <MapPin size={18} className="text-rose-500" />
                    Top Cities
                </h3>
                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            layout="vertical"
                            data={report.buyerLocations}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                            <XAxis type="number" stroke="#64748b" fontSize={12} />
                            <YAxis dataKey="city" type="category" stroke="#94a3b8" fontSize={12} width={100} />
                            <Tooltip 
                                cursor={{fill: '#1e293b'}}
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
                            />
                            <Bar dataKey="count" fill="#f43f5e" radius={[0, 4, 4, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Event Details Card */}
             <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
                <div>
                    <h3 className="text-lg font-bold text-white mb-6">Connector Health</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-slate-400">HEEDS ID</span>
                            <span className="font-mono text-xs bg-slate-800 px-2 py-1 rounded text-indigo-400">{eventInfo.id}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-400">PETZI ID</span>
                            <span className="font-mono text-xs bg-slate-800 px-2 py-1 rounded text-emerald-400">{eventInfo.petziExternalId || "N/A"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-400">Last Synced</span>
                            <span className="text-slate-200 text-sm">Just now</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-400">Sync Status</span>
                            <span className="flex items-center gap-1.5 text-emerald-500 text-sm font-medium">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                Active
                            </span>
                        </div>
                    </div>
                </div>
                <div className="mt-6 pt-6 border-t border-slate-800">
                     <button className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors text-sm font-medium">
                        View Raw Logs
                     </button>
                </div>
            </div>
       </div>
    </div>
  );
};

export default DashboardPage;