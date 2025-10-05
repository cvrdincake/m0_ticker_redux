// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppShell } from "@/features/layout/AppShell";
import Dashboard from "@/pages/Dashboard";
import StatusPage from "@/pages/StatusPage";
import Overlay from "@/pages/Overlay";
import { AccentProvider } from "@/app/AccentProvider";

export default function App() {
  return (
    <BrowserRouter>
      <AccentProvider>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/dashboard" element={<Dashboard/>}/>
            <Route path="/status" element={<StatusPage/>}/>
            <Route index element={<Navigate to="/dashboard" replace/>}/>
          </Route>
          <Route path="/overlay" element={<Overlay/>}/>
          <Route path="*" element={<Navigate to="/dashboard" replace/>}/>
        </Routes>
      </AccentProvider>
    </BrowserRouter>
  );
}
