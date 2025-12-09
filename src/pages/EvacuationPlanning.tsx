
import React, { useState } from 'react';
import Page from '../components/Page';
import Card from '../components/Card';
import ChoroplethMap from '../components/ChoroplethMap';
import { districts } from '../data/mockData';

const EvacuationPlanning: React.FC = () => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [metrics, setMetrics] = useState({
    time: '2h 45m',
    risk: 'Medium',
    routes: ['Route via NH-48', 'Western Express Highway']
  });

  const handleRecalculate = () => {
    setIsCalculating(true);
    // Simulate complex routing algorithm delay
    setTimeout(() => {
      // Randomize results to simulate different scenarios found by the algorithm
      const risks = ['Low', 'Medium', 'High'];
      const newRisk = risks[Math.floor(Math.random() * risks.length)];
      
      const hours = Math.floor(Math.random() * 2) + 1; // 1-3 hours
      const mins = Math.floor(Math.random() * 60);
      const newTime = `${hours}h ${mins}m`;

      const routeOptions = [
        ['Route via NH-48', 'Western Express Highway'],
        ['Coastal Road (South)', 'Eastern Freeway'],
        ['Route via SH-12', 'Old Agra Road'],
        ['Link Road Connector', 'Bypass Loop']
      ];
      const newRoutes = routeOptions[Math.floor(Math.random() * routeOptions.length)];

      setMetrics({
        time: newTime,
        risk: newRisk,
        routes: newRoutes
      });
      setIsCalculating(false);
    }, 2000);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High': return 'text-red-500';
      case 'Medium': return 'text-yellow-500';
      case 'Low': return 'text-green-500';
      default: return 'text-white';
    }
  };

  return (
    <Page title="Evacuation Planning">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-grow">
          <Card title="Live Evacuation Map">
            <div className="h-[70vh] rounded-lg overflow-hidden border border-gray-700 relative">
               {isCalculating && (
                 <div className="absolute inset-0 bg-gray-900 bg-opacity-75 z-[500] flex flex-col items-center justify-center backdrop-blur-sm transition-all duration-300">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mb-4"></div>
                    <span className="text-teal-400 font-semibold animate-pulse">Optimizing Evacuation Paths...</span>
                 </div>
               )}
              <ChoroplethMap data={districts} showRoutes={true} />
            </div>
          </Card>
        </div>
        <div className="lg:w-1/3 flex-shrink-0">
          <div className="space-y-6">
            <Card title="Inputs">
              <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li>Road Network Layer <span className="text-green-500">(Loaded)</span></li>
                <li>Population Clusters <span className="text-green-500">(Loaded)</span></li>
                <li>Safe Shelters Data <span className="text-green-500">(Loaded)</span></li>
              </ul>
            </Card>
            <Card title="Outputs & Analysis">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-white">Evacuation Time Estimate</h4>
                  <p className={`text-2xl transition-all duration-300 ${isCalculating ? 'opacity-50 blur-sm' : 'text-teal-400'}`}>
                    {metrics.time}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-white">Route Congestion Risk</h4>
                  <p className={`text-2xl transition-all duration-300 ${isCalculating ? 'opacity-50 blur-sm' : getRiskColor(metrics.risk)}`}>
                    {metrics.risk}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-white">Alternative Path Suggestions</h4>
                  <ul className={`list-decimal list-inside text-gray-400 transition-all duration-300 ${isCalculating ? 'opacity-50 blur-sm' : ''}`}>
                    {metrics.routes.map((route, idx) => (
                        <li key={idx}>{route}</li>
                    ))}
                  </ul>
                </div>
                 <button 
                    onClick={handleRecalculate}
                    disabled={isCalculating}
                    className={`w-full font-bold py-2 px-4 rounded-lg transition-colors flex justify-center items-center ${
                        isCalculating 
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                        : 'bg-teal-600 hover:bg-teal-700 text-white'
                    }`}
                >
                    {isCalculating ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Calculating...
                        </>
                    ) : 'Re-calculate Routes'}
                </button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default EvacuationPlanning;
