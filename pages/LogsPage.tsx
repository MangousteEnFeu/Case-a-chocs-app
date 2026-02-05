import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { SyncLog } from '../types';
import LogTimeline from '../components/LogTimeline';
import { RefreshCcw, Terminal } from 'lucide-react';
import Button from '../components/Button';

const LogsPage: React.FC = () => {
  const [logs, setLogs] = useState<SyncLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = () => {
    setLoading(true);
    api.getLogs().then(setLogs).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
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

        <div className="bg-[#050505] border-2 border-white p-6 shadow-[8px_8px_0px_0px_#333]">
            {loading ? (
                 <div className="p-20 text-center font-mono text-[#E91E63] animate-pulse uppercase">Reading log stream...</div>
            ) : (
                <LogTimeline logs={logs} />
            )}
        </div>
    </div>
  );
};

export default LogsPage;