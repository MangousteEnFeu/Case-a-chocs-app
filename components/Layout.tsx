import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, RefreshCw, Settings, Activity, Zap, Radio } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

const Layout: React.FC = () => {
  const navClass = ({ isActive }: { isActive: boolean }) =>
    twMerge(
      "flex items-center gap-4 px-4 py-3 border-2 border-transparent transition-all duration-200 font-bold uppercase tracking-wider text-sm",
      isActive
        ? "bg-white text-black border-white shadow-[4px_4px_0px_0px_#E91E63] translate-x-[-2px] translate-y-[-2px]"
        : "text-gray-400 hover:text-white hover:border-gray-700"
    );

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden font-sans selection:bg-[#E91E63] selection:text-white relative z-10">
      {/* Sidebar */}
      <aside className="w-20 lg:w-72 border-r-2 border-white flex flex-col bg-black relative z-20">
        <div className="p-6 border-b-2 border-white bg-[#111]">
          <div className="flex items-center gap-3">
            <div className="bg-[#FFFF00] p-1 border-2 border-white shadow-[2px_2px_0px_0px_#E91E63]">
               <Zap className="text-black fill-black" size={24} />
            </div>
            <div className="hidden lg:block">
              <h1 className="text-2xl leading-none text-white">CASE À<br/><span className="text-[#E91E63]">CHOCS</span></h1>
            </div>
          </div>
          <p className="hidden lg:block text-[10px] font-mono mt-3 text-gray-400 uppercase tracking-widest">
            Connector v2.1
          </p>
        </div>

        <nav className="flex-1 p-6 space-y-4">
          <NavLink to="/" className={navClass}>
            <LayoutDashboard size={20} strokeWidth={2.5} />
            <span className="hidden lg:block">Dashboard</span>
          </NavLink>
          <NavLink to="/events" className={navClass}>
            <RefreshCw size={20} strokeWidth={2.5} />
            <span className="hidden lg:block">Events</span>
          </NavLink>
          
          <div className="hidden lg:block pt-8 pb-2 border-b border-gray-800 mb-4">
            <span className="text-xs font-mono text-[#FFFF00] uppercase tracking-widest">System Monitor</span>
          </div>
          
          <NavLink to="/logs" className={navClass}>
            <Activity size={20} strokeWidth={2.5} />
            <span className="hidden lg:block">Logs</span>
          </NavLink>
          <NavLink to="/settings" className={navClass}>
            <Settings size={20} strokeWidth={2.5} />
            <span className="hidden lg:block">Config</span>
          </NavLink>
        </nav>

        <div className="p-6 border-t-2 border-white bg-[#111]">
          <div className="flex items-center gap-3">
             <div className="relative">
                <div className="w-10 h-10 bg-[#E91E63] border-2 border-white flex items-center justify-center text-white font-bold font-mono">
                  AD
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#00FF00] border border-black"></div>
             </div>
             <div className="hidden lg:block">
                <p className="font-bold text-sm uppercase">Admin</p>
                <div className="flex items-center gap-2 text-[#00FF00] text-xs font-mono">
                    <Radio size={12} className="animate-pulse" />
                    <span>API ONLINE</span>
                </div>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-black relative z-10">
         <div className="min-h-full p-6 lg:p-10 pb-20">
            <Outlet />
         </div>
      </main>
    </div>
  );
};

export default Layout;