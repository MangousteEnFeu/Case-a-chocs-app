import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { SyncLog } from '../types';
import { RefreshCcw, Terminal, ChevronDown, ChevronRight, Filter, Wifi, WifiOff, Code, Eye } from 'lucide-react';
import Button from '../components/Button';
import { clsx } from 'clsx';

const LogsPage: React.FC = () => {
    const [logs, setLogs] = useState<SyncLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());
    const [showRawPayload, setShowRawPayload] = useState<Set<string>>(new Set());
    const [filter, setFilter] = useState<'ALL' | 'SYNC_EVENT' | 'WEBHOOK' | 'SYSTEM' | 'ERROR'>('ALL');
    const [autoRefresh, setAutoRefresh] = useState(false);
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

    const fetchLogs = useCallback(() => {
        setLoading(true);
        api.getLogs(filter === 'ALL' ? undefined : filter)
            .then(data => {
                setLogs(data);
                setLastUpdate(new Date());
            })
            .finally(() => setLoading(false));
    }, [filter]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    // Auto-refresh toutes les 3 secondes si activé
    useEffect(() => {
        if (!autoRefresh) return;

        const interval = setInterval(() => {
            api.getLogs(filter === 'ALL' ? undefined : filter)
                .then(data => {
                    setLogs(data);
                    setLastUpdate(new Date());
                });
        }, 3000);

        return () => clearInterval(interval);
    }, [autoRefresh, filter]);

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

    const toggleRawPayload = (logId: string) => {
        setShowRawPayload(prev => {
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

    // Extraire le rawPayload du JSON si présent
    const extractRawPayload = (details: string): { mainJson: any; rawPayload: any } | null => {
        try {
            const parsed = JSON.parse(details);
            if (parsed.rawPayload) {
                const { rawPayload, ...mainJson } = parsed;
                return { mainJson, rawPayload };
            }
            return null;
        } catch {
            return null;
        }
    };

    // Render JSON avec coloration syntaxique simple
    const renderJsonWithHighlight = (jsonStr: string) => {
        const formatted = formatJson(jsonStr);
        return formatted.split('\n').map((line, idx) => {
            // Colorer les clés en rose, les strings en vert, les nombres en jaune
            const coloredLine = line
                .replace(/"([^"]+)":/g, '<span class="text-[#E91E63]">"$1"</span>:')
                .replace(/: "([^"]+)"/g, ': <span class="text-[#00FF00]">"$1"</span>')
                .replace(/: (\d+\.?\d*)/g, ': <span class="text-[#FFFF00]">$1</span>')
                .replace(/: (true|false)/g, ': <span class="text-[#00FFFF]">$1</span>')
                .replace(/: (null)/g, ': <span class="text-gray-500">$1</span>');

            return (
                <div key={idx} dangerouslySetInnerHTML={{ __html: coloredLine }} />
            );
        });
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-end mb-10 border-b-4 border-white pb-6">
                <div>
                    <h1 className="text-5xl text-white mb-2 leading-none">SYSTEM LOGS</h1>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-[#FFFF00] font-mono text-sm uppercase">
                            <Terminal size={16} />
                            <span>/var/log/connector.log</span>
                        </div>
                        {autoRefresh && (
                            <div className="flex items-center gap-2 text-[#00FF00] font-mono text-xs animate-pulse">
                                <Wifi size={14} />
                                <span>LIVE</span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button
                        onClick={() => setAutoRefresh(!autoRefresh)}
                        variant={autoRefresh ? "primary" : "outline"}
                        className="flex items-center gap-2"
                    >
                        {autoRefresh ? <Wifi size={16} /> : <WifiOff size={16} />}
                        {autoRefresh ? 'LIVE ON' : 'LIVE OFF'}
                    </Button>
                    <Button onClick={fetchLogs} variant="outline" className="flex items-center gap-2">
                        <RefreshCcw size={16} className={loading ? "animate-spin" : ""} /> REFRESH
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-6">
                <div className="flex items-center gap-2 text-gray-400 font-mono text-sm">
                    <Filter size={16} />
                    <span>FILTER:</span>
                </div>
                {['ALL', 'WEBHOOK', 'SYNC_EVENT', 'SYSTEM', 'ERROR'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f as any)}
                        className={clsx(
                            "px-4 py-1 border-2 text-xs font-bold font-mono uppercase tracking-wider transition-all",
                            filter === f
                                ? 'bg-white text-black border-white'
                                : 'bg-black text-white border-gray-700 hover:border-white',
                            f === 'WEBHOOK' && filter !== f && 'border-[#00FFFF]/50 text-[#00FFFF]',
                            f === 'ERROR' && filter !== f && 'border-red-500/50 text-red-500'
                        )}
                    >
                        {f.replace('_', ' ')}
                    </button>
                ))}

                <div className="ml-auto text-xs font-mono text-gray-500">
                    Last update: {lastUpdate.toLocaleTimeString()}
                </div>
            </div>

            <div className="bg-[#050505] border-2 border-white shadow-[8px_8px_0px_0px_#333]">
                {loading && logs.length === 0 ? (
                    <div className="p-20 text-center font-mono text-[#E91E63] animate-pulse uppercase">Reading log stream...</div>
                ) : logs.length === 0 ? (
                    <div className="p-20 text-center font-mono text-gray-500 uppercase">No logs found</div>
                ) : (
                    <div className="divide-y divide-gray-900">
                        {logs.map((log) => {
                            const payloadData = extractRawPayload(log.details);
                            const hasRawPayload = payloadData !== null;

                            return (
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
                                                log.type === 'WEBHOOK' ? "text-[#00FFFF] border-[#00FFFF] bg-[#00FFFF]/10" :
                                                    log.type === 'ERROR' ? "text-red-500 border-red-500" :
                                                        "text-gray-400 border-gray-600"
                                        )}>
                                        {log.type}
                                    </span>

                                        {/* Event Title */}
                                        <div className="flex-1 text-white font-mono text-sm truncate">
                                            {log.eventTitle || <span className="text-gray-600">System</span>}
                                        </div>

                                        {/* JSON indicator */}
                                        {isJson(log.details) && (
                                            <Code size={14} className="text-[#E91E63]" />
                                        )}

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

                                            {/* Main JSON Details */}
                                            <div className="mt-3">
                                                <div className="flex items-center justify-between mb-1">
                                                    <div className="text-[10px] text-[#E91E63] font-mono uppercase">
                                                        {isJson(log.details) ? 'JSON PAYLOAD' : 'MESSAGE'}
                                                    </div>
                                                    {hasRawPayload && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                toggleRawPayload(log.id);
                                                            }}
                                                            className={clsx(
                                                                "flex items-center gap-1 text-[10px] font-mono px-2 py-1 border transition-all",
                                                                showRawPayload.has(log.id)
                                                                    ? "border-[#00FFFF] text-[#00FFFF] bg-[#00FFFF]/10"
                                                                    : "border-gray-700 text-gray-400 hover:border-gray-500"
                                                            )}
                                                        >
                                                            <Eye size={12} />
                                                            {showRawPayload.has(log.id) ? 'HIDE RAW' : 'SHOW RAW PETZI'}
                                                        </button>
                                                    )}
                                                </div>

                                                <pre className="p-3 border border-[#E91E63]/30 bg-[#111] text-xs font-mono overflow-x-auto max-h-64">
                                                {isJson(log.details)
                                                    ? renderJsonWithHighlight(
                                                        hasRawPayload && !showRawPayload.has(log.id)
                                                            ? JSON.stringify(payloadData!.mainJson, null, 2)
                                                            : log.details
                                                    )
                                                    : <span className="text-gray-300">{log.details}</span>
                                                }
                                            </pre>
                                            </div>

                                            {/* Raw PETZI Payload (separate view) */}
                                            {hasRawPayload && showRawPayload.has(log.id) && (
                                                <div className="mt-4">
                                                    <div className="text-[10px] text-[#00FFFF] font-mono mb-1 uppercase flex items-center gap-2">
                                                        <Code size={12} />
                                                        RAW PETZI WEBHOOK PAYLOAD
                                                    </div>
                                                    <pre className="p-3 border border-[#00FFFF]/30 bg-[#0a0a0a] text-xs font-mono overflow-x-auto max-h-96">
                                                    {renderJsonWithHighlight(JSON.stringify(payloadData!.rawPayload, null, 2))}
                                                </pre>
                                                </div>
                                            )}

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
                            );
                        })}
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
                    <span className="text-[#00FFFF]">Webhooks: {logs.filter(l => l.type === 'WEBHOOK').length}</span>
                </div>
            )}

            {/* Instructions pour tester */}
            <div className="mt-8 p-4 border border-dashed border-gray-700 bg-[#0a0a0a]">
                <h3 className="text-sm font-mono text-[#FFFF00] mb-2 uppercase">💡 Test avec le simulateur PETZI</h3>
                <pre className="text-xs font-mono text-gray-400">
{`# Lancer le simulateur depuis votre terminal:
python petzi_simulator.py http://localhost:8080/api/webhooks/petzi

# Avec un secret personnalisé:
python petzi_simulator.py http://localhost:8080/api/webhooks/petzi "votre-secret"`}
            </pre>
            </div>
        </div>
    );
};

export default LogsPage;