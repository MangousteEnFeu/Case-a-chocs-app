import React from 'react';
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

interface StatCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon: LucideIcon;
  trend?: number; 
  chartData?: { value: number }[];
  color?: 'primary' | 'secondary' | 'tertiary';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtext, icon: Icon, trend, chartData, color = 'primary' }) => {
  
  const colors = {
    primary: '#E91E63',   // Pink
    secondary: '#FFFF00', // Yellow
    tertiary: '#00FFFF'   // Cyan
  };

  const activeColor = colors[color];

  return (
    <div className="bg-[#111] border-2 border-white p-0 relative group hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#E91E63] transition-all duration-200">
      
      {/* Header Bar */}
      <div className="flex justify-between items-stretch border-b-2 border-white h-12">
        <div className="flex items-center px-4 bg-white text-black font-mono text-xs font-bold uppercase tracking-wider flex-1">
          {title}
        </div>
        <div className="w-12 flex items-center justify-center border-l-2 border-white bg-black">
           <Icon size={20} style={{ color: activeColor }} strokeWidth={2.5} />
        </div>
      </div>

      <div className="p-6 relative">
        <div className="flex items-baseline gap-2">
            <h3 className="text-4xl text-white font-['Anton'] tracking-wide">{value}</h3>
        </div>
        
        {subtext && <p className="text-xs font-mono text-gray-400 mt-2 uppercase">{subtext}</p>}

        {trend !== undefined && (
          <div className={`absolute top-6 right-4 flex items-center gap-1 text-sm font-bold font-mono ${trend >= 0 ? 'text-[#00FF00]' : 'text-red-500'}`}>
            {trend >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>

      {chartData && (
        <div className="h-16 border-t-2 border-white bg-black">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <Area 
                type="step" 
                dataKey="value" 
                stroke={activeColor} 
                fill={activeColor} 
                fillOpacity={0.2}
                strokeWidth={2}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default StatCard;