
import React, { useState } from 'react';
import Page from '../components/Page';
import Card from '../components/Card';
import ChoroplethMap from '../components/ChoroplethMap';
import { districts, hazardSpecificData } from '../data/mockData';

type HazardType = 'Flood' | 'Earthquake' | 'Landslide' | 'Cyclone';

const HazardLayers: React.FC = () => {
  const [activeTab, setActiveTab] = useState<HazardType>('Flood');
  const [opacity, setOpacity] = useState(70);
  const [viewMode, setViewMode] = useState('Metadata'); // Metadata | Statistics

  const hazardData = {
    Flood: { intensity: 'High', frequency: '50-year event', source: 'IMD (India Meteorological Dept.)', updated: '2024-05-10' },
    Earthquake: { intensity: 'PGA 0.4g', frequency: 'Probable', source: 'GSI (Geological Survey of India)', updated: '2023-11-22' },
    Landslide: { intensity: 'High Susceptibility', frequency: 'Seasonal', source: 'NRSC (National Remote Sensing Centre)', updated: '2024-01-15' },
    Cyclone: { intensity: 'Category 3', frequency: 'Occasional', source: 'IMD Cyclone Division', updated: '2022-09-03' },
  };

  const selectedHazard = hazardData[activeTab];

  // Dynamic Data Transformation: 
  // Map the generic "hazardScore" to the specific score for the selected hazard type.
  const displayedDistricts = districts.map(d => ({
    ...d,
    hazardScore: hazardSpecificData[d.id]?.[activeTab] ?? 0.5 // Fallback to 0.5 if data missing
  }));

  // Calculate dynamic statistics
  const scores = displayedDistricts.map(d => d.hazardScore);
  const meanScore = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2);
  const maxScore = Math.max(...scores).toFixed(2);
  const highRiskCount = scores.filter(s => s > 0.7).length;

  return (
    <Page title="Hazard Layers">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-grow">
          <Card title="Live Hazard Map">
            <div className="mb-4">
              <div className="flex border-b border-gray-700">
                {(Object.keys(hazardData) as HazardType[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-2 px-4 -mb-px font-semibold transition-colors duration-200 ${
                      activeTab === tab
                        ? 'border-b-2 border-teal-500 text-teal-400'
                        : 'text-gray-500 hover:text-white'
                    }`}
                  >
                    {tab} Hazard
                  </button>
                ))}
              </div>
            </div>
            <div className="relative h-[60vh] rounded-lg overflow-hidden border border-gray-700">
              <ChoroplethMap 
                  data={displayedDistricts} 
                  displayMetric="hazardScore" 
                  opacity={opacity} 
              />
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-gray-900 bg-opacity-75 px-4 py-2 rounded-full text-sm text-gray-300 pointer-events-none">
                  Viewing: {activeTab} Data
              </div>
            </div>
          </Card>
        </div>
        <div className="lg:w-1/4 flex-shrink-0">
          <Card title="Layer Information">
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-400">Layer Opacity</label>
                    <span className="text-sm font-bold text-teal-400">{opacity}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={opacity}
                  onChange={(e) => setOpacity(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-teal-500"
                />
              </div>

              <div>
                <h4 className="text-lg font-bold text-white mb-3">{activeTab} {viewMode}</h4>
                <div className="bg-gray-700 rounded-lg p-3">
                    {viewMode === 'Metadata' ? (
                        <ul className="space-y-2 text-sm text-gray-300">
                          <li className="flex justify-between">
                              <span className="text-gray-400">Intensity:</span>
                              <span className="font-medium text-right">{selectedHazard.intensity}</span>
                          </li>
                          <li className="flex justify-between">
                              <span className="text-gray-400">Frequency:</span>
                              <span className="font-medium text-right">{selectedHazard.frequency}</span>
                          </li>
                          <li className="flex justify-between">
                              <span className="text-gray-400">Source:</span>
                              <span className="font-medium text-right truncate w-32" title={selectedHazard.source}>{selectedHazard.source}</span>
                          </li>
                          <li className="flex justify-between">
                              <span className="text-gray-400">Updated:</span>
                              <span className="font-medium text-right">{selectedHazard.updated}</span>
                          </li>
                        </ul>
                    ) : (
                        <ul className="space-y-2 text-sm text-gray-300">
                           <li className="flex justify-between">
                              <span className="text-gray-400">Districts:</span>
                              <span className="font-medium text-right">{displayedDistricts.length}</span>
                          </li>
                          <li className="flex justify-between">
                              <span className="text-gray-400">Avg Score:</span>
                              <span className="font-medium text-right">{meanScore}</span>
                          </li>
                           <li className="flex justify-between">
                              <span className="text-gray-400">Max Score:</span>
                              <span className="font-medium text-right">{maxScore}</span>
                          </li>
                           <li className="flex justify-between">
                              <span className="text-gray-400">High Risk Areas:</span>
                              <span className="font-medium text-right text-red-400">{highRiskCount}</span>
                          </li>
                        </ul>
                    )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-400">Information View</label>
                 <select 
                    value={viewMode}
                    onChange={(e) => setViewMode(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:ring-teal-500 focus:border-teal-500"
                 >
                    <option value="Metadata">Source Metadata</option>
                    <option value="Statistics">Statistical Overview</option>
                 </select>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Page>
  );
};

export default HazardLayers;
