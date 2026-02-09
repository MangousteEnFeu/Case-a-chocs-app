import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { SyncLog } from '../types';
import { RefreshCcw, Terminal, ChevronDown, ChevronRight, Filter } from 'lucide-react';
import Button from '../components/Button';
import { clsx } from 'clsx';

const LogsPage: React.FC = () => {
  const [logs, setLogs] = useState<SyncLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<'ALL' | 'SYNC_EVENT' | 'WEBHOOK' | 'SYSTEM' | 'ERROR'>('ALL');

  const fetchLogs = () => {
    setLoading(true);
    api.getLogs(filter === 'ALL' ? undefined : filter)
      .then(setLogs)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLogs();
  }, [filter]);

  const toggleExpand = (logId: string) => {
    setExpandedLogs(prev => {
      const next = new Set(prev);
      if (next.has(logId)) {
        next.delete(logId);
      } else {
        next.add(logId);
      }
      return next;
    });
  };

  const formatJson = (jsonStr: string) => {
    try {
      const parsed = JSON.parse(jsonStr);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return jsonStr;
    }
  };

  const isJson = (str: string) => {
    try {
      JSON.parse(str);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-10 border-b-4 border-white pb-6">
            <div>
                <h1 className="text-5xl text-white mb-2 leading-none">SYSTEM LOGS</h1>
                <div className="flex items-center gap-2 text-[#FFFF00] font-mono text-sm uppercase">
                    <Terminal size={16} />
                    <span>/var/log/connector.log</span>
                </div>
            </div>
            <Button onClick={fetchLogs} variant="outline" className="flex items-center gap-2">
                <RefreshCcw size={16} className={loading ? "animate-spin" : ""} /> REFRESH
            </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
            <div className="flex items-center gap-2 text-gray-400 font-mono text-sm">
                <Filter size={16} />
                <span>FILTER:</span>
            </div>
            {['ALL', 'SYNC_EVENT', 'WEBHOOK', 'SYSTEM', 'ERROR'].map((f) => (
                <button
                    key={f}
                    onClick={() => setFilter(f as any)}
                    className={clsx(
                        "px-4 py-1 border-2 text-xs font-bold font-mono uppercase tracking-wider transition-all",
                        filter === f 
                            ? 'bg-white text-black border-white' 
                            : 'bg-black text-white border-gray-700 hover:border-white'
                    )}
                >
                    {f.replace('_', ' ')}
                </button>
            ))}
        </div>

        <div className="bg-[#050505] border-2 border-white shadow-[8px_8px_0px_0px_#333]">
            {loading ? (
                 <div className="p-20 text-center font-mono text-[#E91E63] animate-pulse uppercase">Reading log stream...</div>
            ) : logs.length === 0 ? (
                <div className="p-20 text-center font-mono text-gray-500 uppercase">No logs found</div>
            ) : (
                <div className="divide-y divide-gray-900">
                    {logs.map((log) => (
                        <div key={log.id} className="group">
                            {/* Log Header */}
                            <div 
                                className="flex items-center gap-4 p-4 cursor-pointer hover:bg-[#111] transition-colors"
                                onClick={() => toggleExpand(log.id)}
                            >
                                {/* Expand Icon */}
                                <div className="text-gray-600">
                                    {expandedLogs.has(log.id) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                </div>

                                {/* Timestamp */}
                                <div className="w-24 text-gray-500 font-mono text-xs">
                                    {new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second: '2-digit'})}
                                </div>

                                {/* Status Badge */}
                                <span className={clsx(
                                    "text-[10px] font-bold px-2 py-0.5 border-2 uppercase w-20 text-center",
                                    log.status === 'SUCCESS' ? "text-[#00FF00] border-[#00FF00] bg-[#00FF00]/10" : 
                                    log.status === 'ERROR' ? "text-red-500 border-red-500 bg-red-500/10" : 
                                    "text-[#FFFF00] border-[#FFFF00] bg-[#FFFF00]/10"
                                )}>
                                    {log.status}
                                </span>

                                {/* Type Badge */}
                                <span className={clsx(
                                    "text-[10px] font-bold px-2 py-0.5 border uppercase w-24 text-center",
                                    log.type === 'SYNC_EVENT' ? "text-[#E91E63] border-[#E91E63]" :
                                    log.type === 'WEBHOOK' ? "text-[#00FFFF] border-[#00FFFF]" :
                                    log.type === 'ERROR' ? "text-red-500 border-red-500" :
                                    "text-gray-400 border-gray-600"
                                )}>
                                    {log.type}
                                </span>

                                {/* Event Title */}
                                <div className="flex-1 text-white font-mono text-sm truncate">
                                    {log.eventTitle || <span className="text-gray-600">System</span>}
                                </div>

                                {/* Duration */}
                                <div className="text-gray-500 font-mono text-xs">
                                    {log.duration}s
                                </div>
                            </div>

                            {/* Expanded Details */}
                            {expandedLogs.has(log.id) && (
                                <div className="px-4 pb-4 pl-14 bg-[#0a0a0a]">
                                    {/* Date */}
                                    <div className="text-xs text-gray-500 font-mono mb-3">
                                        {new Date(log.timestamp).toLocaleString()}
                                    </div>

                                    {/* Event Info */}
                                    {log.eventId && (
                                        <div className="flex gap-4 mb-3 text-xs font-mono">
                                            <span className="text-gray-500">EVENT_ID:</span>
                                            <span className="text-[#00FFFF]">{log.eventId}</span>
                                        </div>
                                    )}

                                    {/* JSON Details */}
                                    <div className="mt-3">
                                        <div className="text-[10px] text-[#E91E63] font-mono mb-1 uppercase">
                                            {isJson(log.details) ? 'JSON PAYLOAD' : 'MESSAGE'}
                                        </div>
                                        <pre className={clsx(
                                            "p-3 border text-xs font-mono overflow-x-auto max-h-64",
                                            isJson(log.details) 
                                                ? "bg-[#111] border-[#E91E63]/30 text-[#00FF00]" 
                                                : "bg-[#111] border-gray-800 text-gray-300"
                                        )}>
                                            {isJson(log.details) ? formatJson(log.details) : log.details}
                                        </pre>
                                    </div>

                                    {/* Records Synced */}
                                    {log.recordsSynced !== undefined && log.recordsSynced > 0 && (
                                        <div className="mt-3 flex items-center gap-2 text-xs font-mono">
                                            <span className="text-gray-500">RECORDS:</span>
                                            <span className="bg-[#00FF00] text-black px-2 py-0.5 font-bold">
                                                {log.recordsSynced}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* Stats Footer */}
        {!loading && logs.length > 0 && (
            <div className="mt-6 flex gap-6 font-mono text-xs text-gray-500 uppercase">
                <span>Total: {logs.length}</span>
                <span className="text-[#00FF00]">Success: {logs.filter(l => l.status === 'SUCCESS').length}</span>
                <span className="text-red-500">Errors: {logs.filter(l => l.status === 'ERROR').length}</span>
                <span className="text-[#FFFF00]">Warnings: {logs.filter(l => l.status === 'WARNING').length}</span>
            </div>
        )}
    </div>
  );
};

export default LogsPage;
