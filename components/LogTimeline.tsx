import React from 'react';
import { SyncLog } from '../types';
import { Clock, Terminal } from 'lucide-react';
import { clsx } from 'clsx';

interface LogTimelineProps {
  logs: SyncLog[];
}

const LogTimeline: React.FC<LogTimelineProps> = ({ logs }) => {
  return (
    <div className="font-mono text-sm">
      {logs.map((log, idx) => (
        <div key={log.id} className="flex group">
            {/* Left Column (Timestamp) */}
            <div className="w-32 py-4 text-gray-500 text-xs text-right pr-6 border-r-2 border-gray-800 relative">
                {new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second: '2-digit'})}
                <div className="absolute right-[-5px] top-5 w-2 h-2 bg-black border border-gray-600 group-hover:bg-[#E91E63] group-hover:border-[#E91E63] transition-colors"></div>
            </div>

            {/* Right Column (Content) */}
            <div className="flex-1 py-4 pl-6 pb-8 border-b border-gray-900 group-last:border-0">
                <div className="flex items-center gap-3 mb-2">
                    <span className={clsx(
                        "text-[10px] font-bold px-1.5 py-0.5 border-2 uppercase",
                        log.status === 'SUCCESS' ? "text-[#00FF00] border-[#00FF00] bg-[#00FF00]/10" : 
                        log.status === 'ERROR' ? "text-red-500 border-red-500 bg-red-500/10" : 
                        "text-[#00FFFF] border-[#00FFFF] bg-[#00FFFF]/10"
                    )}>
                        {log.status}
                    </span>
                    <span className="text-[#E91E63] font-bold uppercase tracking-wider">
                        {log.type}
                    </span>
                    <span className="text-gray-600 text-xs flex items-center gap-1 ml-auto">
                        <Clock size={12} /> {log.duration}s
                    </span>
                </div>
                
                <p className="text-white mb-2">{log.details}</p>
                
                {log.eventTitle && (
                    <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-900/50 p-2 border border-gray-800 inline-block">
                        <Terminal size={12} />
                        <span>TARGET: {log.eventTitle}</span>
                    </div>
                )}
            </div>
        </div>
      ))}
    </div>
  );
};

export default LogTimeline;