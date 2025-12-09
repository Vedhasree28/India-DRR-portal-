import React, { useState } from 'react';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import HazardLayers from './pages/HazardLayers';
import VulnerabilityAnalysis from './pages/VulnerabilityAnalysis';
import RiskAssessment from './pages/RiskAssessment';
import EvacuationPlanning from './pages/EvacuationPlanning';
import DataExplorer from './pages/DataExplorer';
import Reports from './pages/Reports';
import type { Page } from './types';
import { PAGE_ID_DASHBOARD } from './constants';


const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>(PAGE_ID_DASHBOARD);

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'hazard-layers':
        return <HazardLayers />;
      case 'vulnerability-analysis':
        return <VulnerabilityAnalysis />;
      case 'risk-assessment':
        return <RiskAssessment />;
      case 'evacuation-planning':
        return <EvacuationPlanning />;
      case 'data-explorer':
        return <DataExplorer />;
      case 'reports':
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-300">
      <Navigation activePage={activePage} setActivePage={setActivePage} />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        {renderPage()}
      </main>
    </div>
  );
};

export default App;
