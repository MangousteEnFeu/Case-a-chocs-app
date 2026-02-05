import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, RefreshCw, Settings, Music, Ticket } from 'lucide-react';

const Layout: React.FC = () => {
  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
      isActive
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
    }`;

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-2 text-indigo-500 mb-1">
            <Music size={24} className="animate-pulse" />
            <span className="font-bold text-lg tracking-wider text-white">CASE À CHOCS</span>
          </div>
          <p className="text-xs text-slate-500 uppercase tracking-widest ml-8">Connector</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavLink to="/" className={navClass}>
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard</span>
          </NavLink>
          <NavLink to="/events" className={navClass}>
            <RefreshCw size={20} />
            <span className="font-medium">Sync Events</span>
          </NavLink>
          <div className="pt-4 pb-2 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">
            System
          </div>
          <NavLink to="/logs" className={navClass}>
            <Ticket size={20} />
            <span className="font-medium">Sales Logs</span>
          </NavLink>
          <NavLink to="/settings" className={navClass}>
            <Settings size={20} />
            <span className="font-medium">Settings</span>
          </NavLink>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
              JS
            </div>
            <div>
              <p className="text-sm font-medium text-slate-200">Admin User</p>
              <p className="text-xs text-slate-500">Connected</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-slate-950 relative">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;