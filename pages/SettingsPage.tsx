import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { SystemHealth } from '../types';
import { Server, Check, X, ShieldCheck, Zap } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [checking, setChecking] = useState(false);

  const checkConnection = () => {
    setChecking(true);
    api.checkHealth().then(setHealth).finally(() => setChecking(false));
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-2 font-['Outfit']">Settings & Connections</h1>
      <p className="text-gray-400 mb-10">Manage API connections and configuration</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Connection Status Card */}
        <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Server size={20} className="text-[#00d4aa]" />
                    API Status
                </h3>
                <button 
                    onClick={checkConnection}
                    disabled={checking}
                    className="text-xs bg-[#2a2a2a] px-3 py-1 rounded text-white hover:bg-[#333]"
                >
                    {checking ? 'Checking...' : 'Test Connection'}
                </button>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-[#0a0a0a] rounded-xl border border-[#2a2a2a]">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-blue-500/20 flex items-center justify-center text-blue-500 font-bold text-xs">H</div>
                        <div>
                            <p className="font-bold text-white">HEEDS ERP</p>
                            <p className="text-xs text-gray-500">https://api.heeds.ch/v1</p>
                        </div>
                    </div>
                    {health?.heedsConnection ? (
                        <div className="flex items-center gap-2 text-[#00d4aa] text-sm font-bold">
                            <Check size={16} /> Connected
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-red-500 text-sm font-bold">
                            <X size={16} /> Error
                        </div>
                    )}
                </div>

                <div className="flex justify-between items-center p-4 bg-[#0a0a0a] rounded-xl border border-[#2a2a2a]">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-[#ff3366]/20 flex items-center justify-center text-[#ff3366] font-bold text-xs">P</div>
                        <div>
                            <p className="font-bold text-white">PETZI API</p>
                            <p className="text-xs text-gray-500">https://api.petzi.ch/v2</p>
                        </div>
                    </div>
                    {health?.petziConnection ? (
                        <div className="flex items-center gap-2 text-[#00d4aa] text-sm font-bold">
                            <Check size={16} /> Connected
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-red-500 text-sm font-bold">
                            <X size={16} /> Error
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* Configuration */}
        <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6 opacity-60 pointer-events-none">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <ShieldCheck size={20} className="text-white" />
                    Security
                </h3>
            </div>
            <div className="space-y-4">
                <div className="p-4 bg-[#0a0a0a] rounded-xl border border-[#2a2a2a]">
                    <p className="text-sm text-gray-400 mb-1">API Token (HEEDS)</p>
                    <p className="text-white font-mono">**************************</p>
                </div>
                <div className="p-4 bg-[#0a0a0a] rounded-xl border border-[#2a2a2a]">
                     <p className="text-sm text-gray-400 mb-1">API Token (PETZI)</p>
                     <p className="text-white font-mono">**************************</p>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default SettingsPage;