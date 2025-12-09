import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts';
import Page from '../components/Page';
import Card from '../components/Card';
import ChoroplethMap from '../components/ChoroplethMap';
import { summaryStats, districts, riskTrend, hazardVulnerabilityData } from '../data/mockData';

const Dashboard: React.FC = () => {
  return (
    <Page title="Home Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Total Districts Analyzed">
          <p className="text-4xl font-bold text-white">{summaryStats.totalDistricts}</p>
        </Card>
        <Card title="High-Risk Zones">
          <p className="text-4xl font-bold text-red-500">{summaryStats.highRisk}</p>
        </Card>
        <Card title="Medium-Risk Zones">
          <p className="text-4xl font-bold text-yellow-500">{summaryStats.mediumRisk}</p>
        </Card>
        <Card title="Low-Risk Zones">
          <p className="text-4xl font-bold text-green-500">{summaryStats.lowRisk}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
            <Card title="Choropleth Risk Map">
                <div className="h-96">
                    <ChoroplethMap data={districts} />
                </div>
            </Card>
        </div>
        <div className="lg:col-span-2">
            <Card title="Risk Trend (Multi-Year)">
                <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={riskTrend}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                            <XAxis dataKey="year" stroke="#a0aec0" />
                            <YAxis stroke="#a0aec0" />
                            <Tooltip contentStyle={{ backgroundColor: '#2d3748', border: 'none' }} />
                            <Legend />
                            <Line type="monotone" dataKey="riskIndex" name="Risk Index" stroke="#38b2ac" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
         <div className="lg:col-span-3">
            <Card title="Hazard–Vulnerability–Exposure Breakdown">
                <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={hazardVulnerabilityData} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                            <XAxis type="number" stroke="#a0aec0" />
                            <YAxis type="category" dataKey="name" stroke="#a0aec0" />
                            <Tooltip contentStyle={{ backgroundColor: '#2d3748', border: 'none' }} />
                            <Legend />
                            <Bar dataKey="hazard" stackId="a" fill="#ef4444" />
                            <Bar dataKey="vulnerability" stackId="a" fill="#f59e0b" />
                            <Bar dataKey="exposure" stackId="a" fill="#3b82f6" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>
         <div className="lg:col-span-2">
            <Card title="Critical Facilities Overview">
                <div className="h-96 rounded-lg overflow-hidden border border-gray-700">
                    <ChoroplethMap data={districts} displayMetric="exposure" initialMapTypeId="hybrid" />
                </div>
            </Card>
        </div>
      </div>
    </Page>
  );
};

export default Dashboard;