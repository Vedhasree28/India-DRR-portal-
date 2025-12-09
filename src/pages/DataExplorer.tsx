
import React, { useState } from 'react';
import Page from '../components/Page';
import Card from '../components/Card';
import { riskAssessmentData } from '../data/mockData';

// Types for local state
interface Notification {
    message: string;
    type: 'success' | 'info' | 'loading' | 'error';
}

interface ModalConfig {
    title: string;
    content: React.ReactNode;
}

const DataExplorer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState<Notification | null>(null);
  const [activeModal, setActiveModal] = useState<ModalConfig | null>(null);

  const allData = riskAssessmentData;

  const filteredData = allData.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper to show temporary notification
  const showNotification = (message: string, type: Notification['type'] = 'info') => {
      setNotification({ message, type });
      if (type !== 'loading') {
          setTimeout(() => setNotification(null), 3000);
      }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      showNotification(`Uploading ${file.name}...`, 'loading');
      
      // Simulate upload
      setTimeout(() => {
          showNotification(`Layer "${file.name}" uploaded successfully.`, 'success');
      }, 2000);
  };

  const handleViewMetadata = () => {
      setActiveModal({
          title: 'Dataset Metadata',
          content: (
              <div className="space-y-3 text-gray-300">
                  <div className="grid grid-cols-2 gap-2 border-b border-gray-700 pb-2">
                      <span className="text-gray-400">Dataset Name:</span>
                      <span className="font-semibold text-white">India_District_Risk_Composite_v1</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 border-b border-gray-700 pb-2">
                      <span className="text-gray-400">Source Agency:</span>
                      <span className="font-semibold text-white">NDMA & IMD Integration</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 border-b border-gray-700 pb-2">
                      <span className="text-gray-400">Coordinate Reference System:</span>
                      <span className="font-semibold text-white">EPSG:4326 (WGS 84)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 border-b border-gray-700 pb-2">
                      <span className="text-gray-400">Last Updated:</span>
                      <span className="font-semibold text-white">{new Date().toLocaleDateString()}</span>
                  </div>
                   <div className="grid grid-cols-2 gap-2">
                      <span className="text-gray-400">Data Type:</span>
                      <span className="font-semibold text-white">Vector (Polygon)</span>
                  </div>
              </div>
          )
      });
  };

  const handleGenerateSummary = () => {
      showNotification('Calculating statistics...', 'loading');
      setTimeout(() => {
          setNotification(null);
          const avgRisk = (allData.reduce((acc, curr) => acc + (curr.riskScore || 0), 0) / allData.length).toFixed(3);
          const highRiskCount = allData.filter(d => d.riskLevel === 'High').length;
          
          setActiveModal({
              title: 'Statistical Summary',
              content: (
                  <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-700 p-3 rounded">
                              <p className="text-gray-400 text-xs">Total Records</p>
                              <p className="text-2xl font-bold text-white">{allData.length}</p>
                          </div>
                          <div className="bg-gray-700 p-3 rounded">
                              <p className="text-gray-400 text-xs">Average Risk Score</p>
                              <p className="text-2xl font-bold text-teal-400">{avgRisk}</p>
                          </div>
                           <div className="bg-gray-700 p-3 rounded">
                              <p className="text-gray-400 text-xs">High Risk Districts</p>
                              <p className="text-2xl font-bold text-red-400">{highRiskCount}</p>
                          </div>
                           <div className="bg-gray-700 p-3 rounded">
                              <p className="text-gray-400 text-xs">Coverage</p>
                              <p className="text-2xl font-bold text-white">100%</p>
                          </div>
                      </div>
                      <button className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded text-sm font-semibold transition-colors">
                          Download Report PDF
                      </button>
                  </div>
              )
          });
      }, 1500);
  };

  const handleReproject = () => {
      showNotification('Aligning datasets to Standard CRS...', 'loading');
      setTimeout(() => {
           showNotification('All layers successfully reprojected to WGS 84.', 'success');
      }, 2000);
  };

  return (
    <Page title="Data Explorer">
      {/* Toast Notification */}
      {notification && (
          <div className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-lg shadow-2xl border flex items-center animate-fade-in-down ${
              notification.type === 'loading' ? 'bg-gray-800 border-teal-500 text-teal-400' :
              notification.type === 'success' ? 'bg-green-900 border-green-500 text-white' :
              'bg-gray-800 border-gray-600 text-white'
          }`}>
              {notification.type === 'loading' && (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
              )}
              {notification.type === 'success' && <span className="mr-2">✅</span>}
              <span className="font-medium">{notification.message}</span>
          </div>
      )}

      {/* Modal Overlay */}
      {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm p-4">
              <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-600 max-w-md w-full overflow-hidden transform transition-all">
                  <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
                      <h3 className="text-xl font-bold text-white">{activeModal.title}</h3>
                      <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-white transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                  </div>
                  <div className="p-6">
                      {activeModal.content}
                  </div>
                  <div className="px-6 py-3 bg-gray-900 flex justify-end">
                       <button 
                          onClick={() => setActiveModal(null)}
                          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm font-medium transition-colors"
                       >
                           Close
                       </button>
                  </div>
              </div>
          </div>
      )}

      <Card title="Data Management Tools">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-teal-500 hover:bg-gray-700 transition-all duration-200 cursor-pointer group relative">
                <label htmlFor="file-upload" className="cursor-pointer w-full h-full block">
                    <div className="group-hover:scale-105 transition-transform">
                        <span className="text-4xl mb-2 block">📤</span>
                        <h4 className="font-semibold text-white">Upload New Layer</h4>
                        <p className="text-sm text-gray-500 group-hover:text-gray-300">Hazard or Exposure Data</p>
                    </div>
                </label>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileUpload} />
            </div>

             <div onClick={handleViewMetadata} className="border border-gray-600 rounded-lg p-6 text-center bg-gray-800 hover:bg-gray-700 hover:border-teal-500 cursor-pointer transition-all duration-200 group">
                <div className="group-hover:scale-105 transition-transform">
                     <span className="text-4xl mb-2 block">📋</span>
                    <h4 className="font-semibold text-white">View Metadata</h4>
                    <p className="text-sm text-gray-500 group-hover:text-gray-300">Check sources and CRS</p>
                </div>
            </div>

             <div onClick={handleGenerateSummary} className="border border-gray-600 rounded-lg p-6 text-center bg-gray-800 hover:bg-gray-700 hover:border-teal-500 cursor-pointer transition-all duration-200 group">
                <div className="group-hover:scale-105 transition-transform">
                     <span className="text-4xl mb-2 block">📊</span>
                    <h4 className="font-semibold text-white">Generate Summary</h4>
                    <p className="text-sm text-gray-500 group-hover:text-gray-300">Histograms & Tables</p>
                </div>
            </div>

             <div onClick={handleReproject} className="border border-gray-600 rounded-lg p-6 text-center bg-gray-800 hover:bg-gray-700 hover:border-teal-500 cursor-pointer transition-all duration-200 group">
                <div className="group-hover:scale-105 transition-transform">
                     <span className="text-4xl mb-2 block">🌐</span>
                    <h4 className="font-semibold text-white">Reproject & Align</h4>
                    <p className="text-sm text-gray-500 group-hover:text-gray-300">Standardize datasets</p>
                </div>
            </div>
        </div>
      </Card>
      <Card title="Live Table View">
        <div className="mb-4">
            <input
                type="text"
                placeholder="Search districts..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full md:w-1/3 bg-gray-700 border border-gray-600 rounded-md p-2 text-white placeholder-gray-500 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all"
            />
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-700">
                <tr className="border-b border-gray-600">
                  <th className="p-3">District</th>
                  <th className="p-3">Population</th>
                  <th className="p-3">Hazard Score</th>
                  <th className="p-3">Vulnerability Index</th>
                  <th className="p-3">Risk Score</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map(d => (
                  <tr key={d.id} className="border-b border-gray-700 last:border-b-0 hover:bg-gray-700 transition-colors">
                    <td className="p-3 font-semibold">{d.name}</td>
                    <td className="p-3">{d.population.toLocaleString()}</td>
                    <td className="p-3">{d.hazardScore.toFixed(2)}</td>
                    <td className="p-3">{d.vulnerabilityIndex.toFixed(2)}</td>
                    <td className="p-3 font-bold text-teal-400">{d.riskScore?.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      </Card>
    </Page>
  );
};

export default DataExplorer;
