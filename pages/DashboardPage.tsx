import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell
} from 'recharts';
import { api } from '../services/api';
import { SalesReport, HeedsEvent } from '../types';
import StatCard from '../components/StatCard';
import { DollarSign, Ticket, Users, TrendingUp, RefreshCw, AlertCircle } from 'lucide-react';
import ProgressBar from '../components/ProgressBar';

const DashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<HeedsEvent[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [report, setReport] = useState<SalesReport | null>(null);

  useEffect(() => {
    api.getEvents().then(data => {
      setEvents(data);
      if (data.length > 0) setSelectedEventId(data[0].id);
    });
  }, []);

  useEffect(() => {
    if (selectedEventId) {
      setLoading(true);
      api.getSalesReport(selectedEventId)
        .then(data => setReport(data))
        .finally(() => setLoading(false));
    }
  }, [selectedEventId]);

  if (!selectedEventId) return <div className="p-20 text-center text-white font-mono uppercase animate-pulse">Initializing System...</div>;

  const currentEvent = events.find(e => e.id === selectedEventId);

  // Check for empty state logic
  const isEmptyDraft = currentEvent?.status === 'DRAFT' && report?.totalSold === 0;

  return (
    <div className="max-w-[1600px] mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-4 border-white pb-6">
        <div>
          <h1 className="text-6xl text-white mb-2 leading-none">DASHBOARD</h1>
          <div className="flex items-center gap-3">
             <span className="bg-[#00FF00] text-black px-2 py-0.5 text-xs font-mono font-bold uppercase">Live Data</span>
             <p className="text-gray-400 font-mono text-sm uppercase">PETZI REAL-TIME FEED</p>
          </div>
        </div>
        
        <div className="w-full md:w-auto">
            <label className="block text-[#E91E63] text-xs font-mono font-bold mb-1 uppercase">Select Event</label>
            <div className="relative">
                <select 
                    value={selectedEventId}
                    onChange={(e) => setSelectedEventId(e.target.value)}
                    className="appearance-none bg-black text-white border-2 border-white px-4 py-2 pr-10 w-full md:w-80 font-mono text-sm uppercase focus:outline-none focus:border-[#E91E63] focus:shadow-[4px_4px_0px_0px_#E91E63] transition-all"
                >
                    {events.map(evt => (
                        <option key={evt.id} value={evt.id}>
                            {evt.title} ({new Date(evt.date).toLocaleDateString()})
                        </option>
                    ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none border-l border-white pl-2">
                    <TrendingUp size={16} />
                </div>
            </div>
        </div>
      </div>

      {loading || !report ? (
        <div className="h-96 flex flex-col items-center justify-center gap-4 border-2 border-dashed border-gray-800">
            <RefreshCw size={40} className="animate-spin text-[#E91E63]" />
            <span className="font-mono text-[#E91E63] uppercase animate-pulse">Fetching Data...</span>
        </div>
      ) : isEmptyDraft ? (
        /* Empty State for Draft Events */
        <div className="h-96 flex flex-col items-center justify-center gap-6 border-2 border-white bg-[#111] p-10 text-center shadow-[8px_8px_0px_0px_#333]">
            <div className="bg-[#FFFF00] text-black p-4 rounded-full">
                <AlertCircle size={48} strokeWidth={1.5} />
            </div>
            <div>
                <h3 className="text-3xl font-['Anton'] text-white uppercase mb-2">NO SALES DATA</h3>
                <p className="font-mono text-gray-400 max-w-md mx-auto">
                    This event is currently in <span className="text-white font-bold border-b border-white">DRAFT</span> status and has not recorded any ticket sales yet.
                </p>
            </div>
            <div className="flex gap-4 mt-4 font-mono text-xs text-gray-500 uppercase">
                <span>Total Sold: 0</span>
                <span>•</span>
                <span>Revenue: CHF 0.-</span>
            </div>
        </div>
      ) : (
        <>
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
                title="Gross Revenue" 
                value={`CHF ${report.totalRevenue.toLocaleString()}`} 
                icon={DollarSign}
                color="secondary"
                chartData={report.salesByDay.map(d => ({ value: d.sold * 25 }))}
                trend={12}
            />
            <StatCard 
                title="Tickets Sold" 
                value={report.totalSold} 
                icon={Ticket}
                color="primary"
                chartData={report.salesByDay.map(d => ({ value: d.sold }))}
                trend={5.4}
                subtext={`FILL RATE: ${((report.totalSold / report.capacity) * 100).toFixed(1)}%`}
            />
            <StatCard 
                title="Remaining" 
                value={report.capacity - report.totalSold} 
                icon={Users}
                color="tertiary"
                subtext={report.venue}
            />
            <StatCard 
                title="Velocity (24h)" 
                value={report.salesByDay[report.salesByDay.length - 1]?.sold || 0} 
                icon={TrendingUp}
                color="secondary"
                subtext="Last 24 hours"
            />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Area Chart */}
            <div className="lg:col-span-2 border-2 border-white bg-[#111] p-0 relative shadow-[8px_8px_0px_0px_#222]">
                 <div className="absolute -top-3 -right-3 bg-[#E91E63] text-white px-3 py-1 text-xs font-mono font-bold uppercase shadow-[4px_4px_0px_0px_white]">
                    Sales Velocity
                 </div>
                <div className="p-6 border-b-2 border-white">
                    <h3 className="text-2xl text-white">TICKET SALES TREND</h3>
                </div>
                <div className="h-[400px] w-full p-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={report.salesByDay}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                            <XAxis 
                                dataKey="date" 
                                stroke="#666" 
                                fontSize={12} 
                                tickFormatter={(val) => val.split('-').slice(1).join('/')}
                                fontFamily="Space Mono"
                            />
                            <YAxis stroke="#666" fontSize={12} fontFamily="Space Mono" />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#000', border: '2px solid white', color: '#fff', fontFamily: 'Space Mono' }}
                                itemStyle={{ color: '#E91E63' }}
                                cursor={{ stroke: '#E91E63', strokeWidth: 2 }}
                            />
                            <Area 
                                type="step" 
                                dataKey="sold" 
                                stroke="#E91E63" 
                                strokeWidth={3} 
                                fillOpacity={1} 
                                fill="#E91E63"
                                className="opacity-80 hover:opacity-100 transition-opacity"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Side Column */}
            <div className="flex flex-col gap-8">
                {/* Donut Chart */}
                <div className="border-2 border-white bg-[#111] p-6 relative">
                    <h3 className="text-xl text-white mb-6 uppercase">Category Split</h3>
                    <div className="h-[200px] relative">
                         <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={report.salesByCategory}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={2}
                                    dataKey="sold"
                                    stroke="none"
                                >
                                    {report.salesByCategory.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === 0 ? '#E91E63' : '#FFFF00'} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid white', fontFamily: 'Space Mono' }} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                            <span className="text-3xl font-['Anton'] text-white">{report.totalSold}</span>
                            <span className="text-xs font-mono text-gray-500 uppercase">Total</span>
                        </div>
                    </div>
                    <div className="mt-6 space-y-2">
                        {report.salesByCategory.map((cat, idx) => (
                            <div key={idx} className="flex justify-between items-center border-b border-gray-800 pb-1">
                                <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 ${idx === 0 ? 'bg-[#E91E63]' : 'bg-[#FFFF00]'}`}></div>
                                    <span className="text-white font-mono text-xs uppercase">{cat.category}</span>
                                </div>
                                <span className="font-mono text-white font-bold">CHF {cat.revenue}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Cities */}
                <div className="border-2 border-white bg-[#111] p-6">
                    <h3 className="text-xl text-white mb-6 uppercase">Geo Distribution</h3>
                    <div className="space-y-6">
                        {report.buyerLocations.slice(0,4).map((loc, idx) => (
                            <div key={idx}>
                                <div className="flex justify-between text-xs font-mono mb-1 uppercase">
                                    <span className="text-gray-400">{loc.city}</span>
                                    <span className="text-[#00FFFF] font-bold">{loc.count}</span>
                                </div>
                                <ProgressBar value={loc.count} max={report.totalSold} color="#00FFFF" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;