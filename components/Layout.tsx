import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, RefreshCw, Settings, Music, Ticket, Activity, Zap } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Layout: React.FC = () => {
  const location = useLocation();

  const navClass = ({ isActive }: { isActive: boolean }) =>
    twMerge(
      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group",
      isActive
        ? "bg-[#ff3366]/10 text-[#ff3366]"
        : "text-gray-400 hover:bg-[#1a1a1a] hover:text-white"
    );

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 border-r border-[#2a2a2a] flex flex-col transition-all duration-300 bg-[#0a0a0a]">
        <div className="p-6 border-b border-[#2a2a2a] flex items-center gap-3">
          <div className="w-10 h-10 bg-[#ff3366] rounded-lg flex items-center justify-center transform rotate-3 shadow-[0_0_15px_rgba(255,51,102,0.4)]">
             <Zap className="text-white fill-white" size={20} />
          </div>
          <div className="hidden lg:block">
            <h1 className="font-bold text-lg tracking-tight leading-none font-['Outfit']">CASE À CHOCS</h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Connector v2.0</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavLink to="/" className={navClass}>
            <LayoutDashboard size={22} className="group-hover:scale-110 transition-transform" />
            <span className="hidden lg:block font-medium">Dashboard</span>
          </NavLink>
          <NavLink to="/events" className={navClass}>
            <RefreshCw size={22} className="group-hover:rotate-180 transition-transform duration-500" />
            <span className="hidden lg:block font-medium">Events</span>
          </NavLink>
          
          <div className="hidden lg:block pt-6 pb-2 px-4 text-[10px] font-bold text-gray-600 uppercase tracking-widest">
            Monitoring
          </div>
          
          <NavLink to="/logs" className={navClass}>
            <Activity size={22} className="group-hover:scale-110 transition-transform" />
            <span className="hidden lg:block font-medium">Logs</span>
          </NavLink>
          <NavLink to="/settings" className={navClass}>
            <Settings size={22} className="group-hover:rotate-90 transition-transform duration-500" />
            <span className="hidden lg:block font-medium">Settings</span>
          </NavLink>
        </nav>

        <div className="p-4 border-t border-[#2a2a2a]">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-[#141414] border border-[#2a2a2a]">
            <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00d4aa] to-blue-500 flex items-center justify-center text-xs font-bold text-white">
                AD
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#141414]"></div>
            </div>
            <div className="hidden lg:block overflow-hidden">
              <p className="text-sm font-medium text-gray-200 truncate">Admin</p>
              <p className="text-[10px] text-green-500 font-medium">API Connected</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-[#0a0a0a] relative">
         <Outlet />
      </main>
    </div>
  );
};

export default Layout;