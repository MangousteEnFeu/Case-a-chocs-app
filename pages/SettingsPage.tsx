import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { SystemHealth } from '../types';
import { Server, ShieldCheck, Power } from 'lucide-react';
import Button from '../components/Button';
import { useToast } from '../hooks/useToast';

const SettingsPage: React.FC = () => {
    const [health, setHealth] = useState<SystemHealth | null>(null);
    const [checking, setChecking] = useState(false);
    const { showToast } = useToast();

    const checkConnection = () => {
        setChecking(true);
        api.checkHealth()
            .then((data) => {
                setHealth(data);
                showToast('info', 'Vérification de la connectivité terminée');
            })
            .finally(() => setChecking(false));
    };

    useEffect(() => {
        checkConnection();
    }, []);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="border-b-4 border-white pb-6 mb-10">
                <h1 className="text-5xl text-white mb-2 leading-none">CONFIGURATION</h1>
                <p className="text-gray-400 font-mono uppercase tracking-widest">CONNEXIONS API & SECRETS</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Connection Status Card */}
                <div className="bg-black border-2 border-white p-0 relative">
                    <div className="bg-white text-black p-3 font-mono font-bold uppercase flex justify-between items-center border-b-2 border-white">
                        <span className="flex items-center gap-2"><Server size={18}/> PASSERELLES API</span>
                        <div className={`w-3 h-3 border-2 border-black ${health?.status === 'UP' ? 'bg-[#00FF00]' : 'bg-red-500'}`}></div>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* HEEDS */}
                        <div className="relative">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-bold text-lg">HEEDS ERP</span>
                                {health?.heedsConnection ? (
                                    <span className="bg-[#00FF00] text-black text-xs font-mono px-1 font-bold">EN LIGNE</span>
                                ) : (
                                    <span className="bg-red-500 text-white text-xs font-mono px-1 font-bold">HORS LIGNE</span>
                                )}
                            </div>
                            <div className="flex items-center gap-3 border border-gray-700 p-3 bg-[#111]">
                                <div className="w-10 h-10 bg-blue-600 flex items-center justify-center text-white font-bold border border-white">H</div>
                                <div>
                                    <p className="text-xs font-mono text-gray-500">POINT D'ACCÈS</p>
                                    <p className="text-sm font-mono text-white">api.heeds.ch/v1</p>
                                </div>
                            </div>
                        </div>

                        {/* PETZI */}
                        <div className="relative">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-bold text-lg">PETZI</span>
                                {health?.petziConnection ? (
                                    <span className="bg-[#00FF00] text-black text-xs font-mono px-1 font-bold">EN LIGNE</span>
                                ) : (
                                    <span className="bg-red-500 text-white text-xs font-mono px-1 font-bold">HORS LIGNE</span>
                                )}
                            </div>
                            <div className="flex items-center gap-3 border border-gray-700 p-3 bg-[#111]">
                                <div className="w-10 h-10 bg-[#E91E63] flex items-center justify-center text-white font-bold border border-white">P</div>
                                <div>
                                    <p className="text-xs font-mono text-gray-500">POINT D'ACCÈS</p>
                                    <p className="text-sm font-mono text-white">api.petzi.ch/v2</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-800">
                            <Button onClick={checkConnection} disabled={checking} className="w-full" variant="outline">
                                {checking ? 'TEST EN COURS...' : 'TESTER LA CONNEXION'}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Configuration */}
                <div className="bg-black border-2 border-white p-0 relative opacity-75">
                    <div className="bg-gray-800 text-white p-3 font-mono font-bold uppercase flex justify-between items-center border-b-2 border-white">
                        <span className="flex items-center gap-2"><ShieldCheck size={18}/> CLÉS & SECRETS</span>
                        <Power size={18} />
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="p-4 border-2 border-dashed border-gray-700 bg-[#0a0a0a]">
                            <p className="text-xs text-[#E91E63] font-mono mb-1 font-bold">API_TOKEN_HEEDS</p>
                            <p className="text-white font-mono tracking-widest">**************************</p>
                        </div>
                        <div className="p-4 border-2 border-dashed border-gray-700 bg-[#0a0a0a]">
                            <p className="text-xs text-[#E91E63] font-mono mb-1 font-bold">API_TOKEN_PETZI</p>
                            <p className="text-white font-mono tracking-widest">**************************</p>
                        </div>

                        <div className="p-4 bg-[#FFFF00]/10 border border-[#FFFF00] text-[#FFFF00] text-xs font-mono">
                            <p>ATTENTION : Les secrets sont gérés via des variables d'environnement. Veuillez consulter la documentation pour la rotation des clés.</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SettingsPage;