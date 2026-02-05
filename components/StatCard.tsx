import React from 'react';
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

interface StatCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon: LucideIcon;
  trend?: number; // percentage
  chartData?: { value: number }[];
  color?: 'primary' | 'secondary' | 'warning' | 'success';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtext, icon: Icon, trend, chartData, color = 'primary' }) => {
  
  const colors = {
    primary: '#ff3366',
    secondary: '#00d4aa',
    warning: '#f59e0b',
    success: '#22c55e'
  };

  const activeColor = colors[color];

  return (
    <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6 hover:border-[#3a3a3a] transition-colors duration-300 relative overflow-hidden group">
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={`p-3 rounded-xl bg-opacity-10`} style={{ backgroundColor: `${activeColor}15` }}>
          <Icon size={24} style={{ color: activeColor }} />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-sm font-medium ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {trend >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>

      <div className="relative z-10">
        <h3 className="text-3xl font-bold text-white font-['Outfit'] tracking-tight">{value}</h3>
        <p className="text-sm text-gray-400 font-medium mt-1">{title}</p>
        {subtext && <p className="text-xs text-gray-600 mt-2">{subtext}</p>}
      </div>

      {chartData && (
        <div className="absolute bottom-0 left-0 right-0 h-16 opacity-20 group-hover:opacity-30 transition-opacity">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={activeColor} 
                fill={activeColor} 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default StatCard;