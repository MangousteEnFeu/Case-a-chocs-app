import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import { api } from '../services/api';
import { SalesReport, HeedsEvent } from '../types';
import StatCard from '../components/StatCard';
import { DollarSign, Ticket, Users, TrendingUp, RefreshCw } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<HeedsEvent[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [report, setReport] = useState<SalesReport | null>(null);

  useEffect(() => {
    // Initial fetch of events
    api.getEvents().then(data => {
      setEvents(data);
      if (data.length > 0) {
        setSelectedEventId(data[0].id);
      }
    });
  }, []);

  useEffect(() => {
    if (selectedEventId) {
      setLoading(true);
      api.getSalesReport(selectedEventId)
        .then(data => setReport(data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [selectedEventId]);

  if (!selectedEventId) return <div className="p-10 text-center text-gray-500">Loading events...</div>;

  return (
    <div className="p-6 lg:p-10 max-w-[1600px] mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 font-['Outfit']">Sales Dashboard</h1>
          <p className="text-gray-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse"></span>
            Real-time data from PETZI
          </p>
        </div>
        
        <div className="bg-[#141414] p-1.5 rounded-xl border border-[#2a2a2a] flex items-center min-w-[300px]">
            <select 
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="bg-transparent border-none text-white text-base focus:ring-0 cursor-pointer py-2 pl-3 pr-8 w-full font-medium"
            >
                {events.map(evt => (
                    <option key={evt.id} value={evt.id} className="bg-[#141414] text-white">
                        {evt.title} ({new Date(evt.date).toLocaleDateString()})
                    </option>
                ))}
            </select>
        </div>
      </div>

      {loading || !report ? (
        <div className="h-96 flex items-center justify-center">
            <RefreshCw size={40} className="animate-spin text-[#ff3366]" />
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
                chartData={report.salesByDay.map(d => ({ value: d.sold * 25 }))} // rough estimate for sparkline
                trend={12}
            />
            <StatCard 
                title="Tickets Sold" 
                value={report.totalSold} 
                icon={Ticket}
                color="primary"
                chartData={report.salesByDay.map(d => ({ value: d.sold }))}
                trend={5.4}
                subtext={`${((report.totalSold / report.capacity) * 100).toFixed(1)}% Fill Rate`}
            />
            <StatCard 
                title="Remaining Cap" 
                value={report.capacity - report.totalSold} 
                icon={Users}
                color="warning"
                subtext={`Venue: ${report.venue}`}
            />
            <StatCard 
                title="Daily Velocity" 
                value={report.salesByDay[report.salesByDay.length - 1]?.sold || 0} 
                icon={TrendingUp}
                color="success"
                subtext="Tickets sold today"
            />
        </div>

        {/* Main Chart Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6 lg:p-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h3 className="text-2xl font-bold text-white font-['Outfit']">Sales Velocity</h3>
                        <p className="text-gray-500 text-sm">Tickets sold over last 30 days</p>
                    </div>
                    <div className="flex gap-2">
                        {['7D', '30D', 'ALL'].map(period => (
                            <button key={period} className={`px-3 py-1 rounded-lg text-xs font-bold ${period === '30D' ? 'bg-[#ff3366] text-white' : 'bg-[#2a2a2a] text-gray-400 hover:bg-[#333]'}`}>
                                {period}
                            </button>
                        ))}
                    </div>
                </div>
                
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={report.salesByDay}>
                            <defs>
                                <linearGradient id="colorSold" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ff3366" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#ff3366" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
                            <XAxis 
                                dataKey="date" 
                                stroke="#444" 
                                fontSize={12} 
                                tickFormatter={(val) => val.split('-').slice(1).join('/')}
                                tickMargin={10}
                            />
                            <YAxis stroke="#444" fontSize={12} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#333', color: '#fff' }}
                                itemStyle={{ color: '#ff3366' }}
                                cursor={{ stroke: '#333', strokeWidth: 2 }}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="sold" 
                                stroke="#ff3366" 
                                strokeWidth={3} 
                                fillOpacity={1} 
                                fill="url(#colorSold)" 
                                animationDuration={1500}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Distribution Column */}
            <div className="flex flex-col gap-6">
                {/* Categories */}
                <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6 flex-1">
                    <h3 className="text-xl font-bold text-white font-['Outfit'] mb-6">Ticket Types</h3>
                    <div className="h-[200px] relative">
                         <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={report.salesByCategory}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="sold"
                                    stroke="none"
                                >
                                    {report.salesByCategory.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === 0 ? '#ff3366' : '#00d4aa'} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#333', borderRadius: '8px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                            <span className="text-3xl font-bold text-white">{report.totalSold}</span>
                            <span className="text-xs text-gray-500 uppercase">Total</span>
                        </div>
                    </div>
                    <div className="mt-4 space-y-3">
                        {report.salesByCategory.map((cat, idx) => (
                            <div key={idx} className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${idx === 0 ? 'bg-[#ff3366]' : 'bg-[#00d4aa]'}`}></div>
                                    <span className="text-gray-300 text-sm">{cat.category}</span>
                                </div>
                                <span className="font-mono text-white">CHF {cat.revenue}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Cities */}
                 <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white font-['Outfit'] mb-4">Top Cities</h3>
                    <div className="space-y-4">
                        {report.buyerLocations.slice(0,3).map((loc, idx) => (
                            <div key={idx}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-400">{loc.city}</span>
                                    <span className="text-white font-medium">{loc.count}</span>
                                </div>
                                <div className="w-full bg-[#2a2a2a] rounded-full h-1.5">
                                    <div 
                                        className="bg-[#00d4aa] h-1.5 rounded-full" 
                                        style={{ width: `${(loc.count / report.totalSold) * 100}%` }}
                                    ></div>
                                </div>
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