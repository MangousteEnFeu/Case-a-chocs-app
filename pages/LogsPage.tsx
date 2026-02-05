import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { SyncLog } from '../types';
import LogTimeline from '../components/LogTimeline';
import { RefreshCcw, Filter } from 'lucide-react';

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
    <div className="p-6 lg:p-10 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2 font-['Outfit']">System Logs</h1>
                <p className="text-gray-400">Activity history and synchronization status</p>
            </div>
            <button 
                onClick={fetchLogs}
                className="p-2 bg-[#141414] border border-[#2a2a2a] rounded-lg text-white hover:bg-[#2a2a2a] transition-colors"
            >
                <RefreshCcw size={20} className={loading ? "animate-spin" : ""} />
            </button>
        </div>

        <div className="bg-[#0a0a0a] rounded-2xl">
            {loading ? (
                 <div className="p-8 text-center text-gray-500">Loading logs...</div>
            ) : (
                <LogTimeline logs={logs} />
            )}
        </div>
    </div>
  );
};

export default LogsPage;