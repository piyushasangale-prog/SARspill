import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppShell } from './components/layout/AppShell';

import { Dashboard } from './pages/Dashboard';
import { AnalyzeWorkspace } from './pages/AnalyzeWorkspace';
import { CasesList } from './pages/CasesList';
import { CaseDetail } from './pages/CaseDetail';
import { VesselsList } from './pages/VesselsList';
import { VesselDetail } from './pages/VesselDetail';

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/analyze" element={<AnalyzeWorkspace />} />
            <Route path="/cases" element={<CasesList />} />
            <Route path="/cases/:id" element={<CaseDetail />} />
            <Route path="/vessels" element={<VesselsList />} />
            <Route path="/vessels/:mmsi" element={<VesselDetail />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
