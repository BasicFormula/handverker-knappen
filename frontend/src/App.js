import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";

import "@/App.css";
import "@/marketplace.css";
import { AppShell } from "@/components/AppShell";
import DashboardPage from "@/pages/DashboardPage";
import CraftspersonOnboardingPage from "@/pages/CraftspersonOnboardingPage";
import JobDetailPage from "@/pages/JobDetailPage";
import JobsPage from "@/pages/JobsPage";
import NewJobPage from "@/pages/NewJobPage";
import ProfilePage from "@/pages/ProfilePage";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/oppdrag" element={<JobsPage />} />
          <Route path="/oppdrag/ny" element={<NewJobPage />} />
          <Route path="/oppdrag/:jobId" element={<JobDetailPage />} />
          <Route path="/for-fagfolk" element={<CraftspersonOnboardingPage />} />
          <Route path="/profil" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      <Toaster richColors position="top-right" />
    </BrowserRouter>
  );
}
