import React from 'react';
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import EventsPage from './pages/EventsPage';

const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="p-8 flex items-center justify-center h-full text-slate-500">
    <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-300 mb-2">{title}</h2>
        <p>This module is currently under development.</p>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="logs" element={<PlaceholderPage title="System Logs" />} />
          <Route path="settings" element={<PlaceholderPage title="Connector Settings" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
};

export default App;