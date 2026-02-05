import React from 'react';
import { SyncLog } from '../types';
import { CheckCircle2, AlertCircle, Info, Clock } from 'lucide-react';
import { clsx } from 'clsx';
import { formatDistanceToNow } from 'date-fns';

interface LogTimelineProps {
  logs: SyncLog[];
}

const LogTimeline: React.FC<LogTimelineProps> = ({ logs }) => {
  return (
    <div className="space-y-6 relative before:absolute before:left-4 before:top-2 before:bottom-0 before:w-0.5 before:bg-[#2a2a2a]">
      {logs.map((log) => (
        <div key={log.id} className="relative pl-12">
            {/* Timeline Dot */}
            <div className={clsx(
                "absolute left-0 top-1 w-8 h-8 rounded-full border-4 border-[#0a0a0a] flex items-center justify-center z-10",
                log.status === 'SUCCESS' ? "bg-[#00d4aa]" : log.status === 'ERROR' ? "bg-red-500" : "bg-blue-500"
            )}>
                {log.status === 'SUCCESS' ? <CheckCircle2 size={14} className="text-black" /> : 
                 log.status === 'ERROR' ? <AlertCircle size={14} className="text-white" /> : 
                 <Info size={14} className="text-white" />}
            </div>

            <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-4 hover:border-[#3a3a3a] transition-colors">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <span className={clsx(
                            "text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider mr-2",
                            log.type === 'SYNC_EVENT' ? "bg-purple-500/20 text-purple-400" :
                            log.type === 'FETCH_SALES' ? "bg-[#ff3366]/20 text-[#ff3366]" :
                            "bg-gray-700 text-gray-300"
                        )}>
                            {log.type.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-gray-500 font-mono">
                            {new Date(log.timestamp).toLocaleString()}
                        </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock size={12} />
                        {log.duration}s
                    </div>
                </div>
                
                <h4 className="text-white font-medium mb-1">{log.details}</h4>
                {log.eventTitle && (
                    <p className="text-sm text-gray-400">Target: <span className="text-gray-300">{log.eventTitle}</span></p>
                )}
            </div>
        </div>
      ))}
    </div>
  );
};

export default LogTimeline;