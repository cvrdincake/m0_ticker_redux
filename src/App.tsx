import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AccentProvider } from '@/app/AccentProvider';
import { AppShell } from '@/features/layout/AppShell';
import Dashboard from '@/pages/Dashboard';
import Overlay from '@/pages/Overlay';
import StatusPage from '@/pages/StatusPage';

export default function App() {
  return (
    <BrowserRouter>
      <AccentProvider>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/status" element={<StatusPage />} />
            <Route index element={<Navigate to="/dashboard" replace />} />
          </Route>
          <Route path="/overlay" element={<Overlay />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AccentProvider>
    </BrowserRouter>
  );
}
