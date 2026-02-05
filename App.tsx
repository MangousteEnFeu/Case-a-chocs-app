import React from 'react';
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import EventsPage from './pages/EventsPage';
import LogsPage from './pages/LogsPage';
import SettingsPage from './pages/SettingsPage';
import { ToastProvider } from './components/ToastProvider';

const App: React.FC = () => {
  return (
    <ToastProvider>
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<DashboardPage />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="logs" element={<LogsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </MemoryRouter>
    </ToastProvider>
  );
};

export default App;