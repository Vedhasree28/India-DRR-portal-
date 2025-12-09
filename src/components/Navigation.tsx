
import React from 'react';
import type { Page } from '../types';
import { DashboardIcon, HazardIcon, VulnerabilityIcon, RiskIcon, EvacuationIcon, DataIcon, ReportIcon } from './icons/NavIcons';

interface NavigationProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  { id: 'hazard-layers', label: 'Hazard Layers', icon: <HazardIcon /> },
  { id: 'vulnerability-analysis', label: 'Vulnerability Analysis', icon: <VulnerabilityIcon /> },
  { id: 'risk-assessment', label: 'Risk Assessment', icon: <RiskIcon /> },
  { id: 'evacuation-planning', label: 'Evacuation Planning', icon: <EvacuationIcon /> },
  { id: 'data-explorer', label: 'Data Explorer', icon: <DataIcon /> },
  { id: 'reports', label: 'Reports & Downloads', icon: <ReportIcon /> },
] as const;


const Navigation: React.FC<NavigationProps> = ({ activePage, setActivePage }) => {
  return (
    <nav className="w-64 bg-gray-800 p-4 flex flex-col h-full flex-shrink-0">
      <div className="text-white text-2xl font-bold mb-8 flex items-center">
        <span className="text-teal-400 mr-2">🇮🇳</span> India DRR Portal
      </div>
      <ul>
        {navItems.map((item) => (
          <li key={item.id} className="mb-2">
            <button
              onClick={() => setActivePage(item.id)}
              className={`w-full text-left flex items-center p-3 rounded-lg transition-colors duration-200 ${
                activePage === item.id
                  ? 'bg-teal-600 text-white'
                  : 'text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-auto text-center text-gray-500 text-xs">
        <p>Version 1.0.0 (IN)</p>
        <p>&copy; 2024 Govt. of India (MoES)</p>
      </div>
    </nav>
  );
};

export default Navigation;