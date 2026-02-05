import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtext, icon: Icon, color = "indigo" }) => {
  const colorClasses = {
    indigo: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
    emerald: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    rose: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  }[color] || "bg-indigo-500/10 text-indigo-500 border-indigo-500/20";

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-white">{value}</h3>
          {subtext && <p className="text-xs text-slate-500 mt-1">{subtext}</p>}
        </div>
        <div className={`p-3 rounded-lg border ${colorClasses}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;