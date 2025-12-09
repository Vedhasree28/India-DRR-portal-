
import React from 'react';
import Page from '../components/Page';
import Card from '../components/Card';
import ChoroplethMap from '../components/ChoroplethMap';
import { riskAssessmentData } from '../data/mockData';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const RiskAssessment: React.FC = () => {
  return (
    <Page title="Risk Assessment">
      <Card title="Integrated Formula Panel">
        <div className="bg-gray-900 p-4 rounded-lg text-center">
          <code className="text-xl text-teal-400 font-mono">
            Risk = Hazard × Exposure × Vulnerability
          </code>
        </div>
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Risk Ranking Table">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="p-3">Rank</th>
                  <th className="p-3">District</th>
                  <th className="p-3">Normalized Risk (0-1)</th>
                  <th className="p-3">Risk Level</th>
                </tr>
              </thead>
              <tbody>
                {riskAssessmentData.map((d, index) => (
                  <tr key={d.id} className="border-b border-gray-700 last:border-b-0 hover:bg-gray-700">
                    <td className="p-3 font-semibold">{index + 1}</td>
                    <td className="p-3">{d.name}</td>
                    <td className="p-3">{d.riskScore.toFixed(2)}</td>
                    <td className={`p-3 font-semibold ${
                      d.riskLevel === 'High' ? 'text-red-400' :
                      d.riskLevel === 'Medium' ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      {d.riskLevel}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <Card title="Risk vs. Exposure Scatterplot">
            <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                        <XAxis type="number" dataKey="exposure" name="Exposure" unit="" stroke="#a0aec0" />
                        <YAxis type="number" dataKey="riskScore" name="Risk Score" unit="" stroke="#a0aec0" />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#2d3748', border: 'none' }} />
                        <Legend />
                        <Scatter name="Districts" data={riskAssessmentData} fill="#38b2ac" />
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
        </Card>
      </div>
      <Card title="High-Priority Hotspots Map">
        <div className="h-96 rounded-lg overflow-hidden border border-gray-700">
            <ChoroplethMap data={riskAssessmentData} displayMetric="riskScore" />
        </div>
      </Card>
    </Page>
  );
};

export default RiskAssessment;
