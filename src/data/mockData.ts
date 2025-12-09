
import type { DistrictData, RiskTrendData, HazardVulnerabilityData, VulnerabilityIndicator, VulnerabilityDimension } from '../types';

export const summaryStats = {
  totalDistricts: 55,
  highRisk: 12,
  mediumRisk: 25,
  lowRisk: 18,
};

export const districts: DistrictData[] = [
  { id: 'd1', name: 'Mumbai', lat: 19.0760, lng: 72.8777, riskLevel: 'High', population: 12442373, vulnerabilityIndex: 0.85, hazardScore: 0.9, exposure: 0.95 },
  { id: 'd2', name: 'Uttarkashi', lat: 30.7268, lng: 78.4354, riskLevel: 'High', population: 330086, vulnerabilityIndex: 0.9, hazardScore: 0.95, exposure: 0.70 },
  { id: 'd3', name: 'Chennai', lat: 13.0827, lng: 80.2707, riskLevel: 'Medium', population: 4646732, vulnerabilityIndex: 0.7, hazardScore: 0.75, exposure: 0.80 },
  { id: 'd4', name: 'Jaipur', lat: 26.9124, lng: 75.7873, riskLevel: 'Low', population: 3046163, vulnerabilityIndex: 0.4, hazardScore: 0.3, exposure: 0.60 },
  { id: 'd5', name: 'Kolkata', lat: 22.5726, lng: 88.3639, riskLevel: 'Medium', population: 4496694, vulnerabilityIndex: 0.75, hazardScore: 0.8, exposure: 0.85 },
  { id: 'd6', name: 'Bengaluru', lat: 12.9716, lng: 77.5946, riskLevel: 'Low', population: 8443675, vulnerabilityIndex: 0.5, hazardScore: 0.4, exposure: 0.75 },
];

// Specific hazard scores for each district to allow dynamic switching
// Keys must match the HazardType in HazardLayers.tsx
export const hazardSpecificData: Record<string, Record<string, number>> = {
  'd1': { 'Flood': 0.95, 'Earthquake': 0.4, 'Landslide': 0.2, 'Cyclone': 0.85 }, // Mumbai
  'd2': { 'Flood': 0.7, 'Earthquake': 0.95, 'Landslide': 0.95, 'Cyclone': 0.1 }, // Uttarkashi
  'd3': { 'Flood': 0.9, 'Earthquake': 0.3, 'Landslide': 0.1, 'Cyclone': 0.95 }, // Chennai
  'd4': { 'Flood': 0.3, 'Earthquake': 0.4, 'Landslide': 0.1, 'Cyclone': 0.2 }, // Jaipur
  'd5': { 'Flood': 0.85, 'Earthquake': 0.5, 'Landslide': 0.1, 'Cyclone': 0.8 }, // Kolkata
  'd6': { 'Flood': 0.6, 'Earthquake': 0.2, 'Landslide': 0.1, 'Cyclone': 0.1 }, // Bengaluru
};

export const riskTrend: RiskTrendData[] = [
  { year: 2020, riskIndex: 0.55 },
  { year: 2021, riskIndex: 0.58 },
  { year: 2022, riskIndex: 0.62 },
  { year: 2023, riskIndex: 0.61 },
  { year: 2024, riskIndex: 0.65 },
];

export const hazardVulnerabilityData: HazardVulnerabilityData[] = [
  { name: 'Flood', hazard: 85, vulnerability: 65, exposure: 75 },
  { name: 'Earthquake', hazard: 60, vulnerability: 80, exposure: 70 },
  { name: 'Landslide', hazard: 70, vulnerability: 50, exposure: 60 },
];

export const vulnerabilityIndicators: VulnerabilityIndicator[] = [
    { name: '% Elderly Population', value: 18, weight: 0.2 },
    { name: '% Houses with Weak Materials', value: 35, weight: 0.3 },
    { name: 'Avg. Income (Low)', value: 45, weight: 0.25 },
    { name: 'Health Access Score', value: 62, weight: 0.15 },
    { name: 'Literacy Rate', value: 88, weight: 0.1 },
];

export const vulnerabilityDimensions: VulnerabilityDimension[] = [
    { dimension: 'Social', score: 75 },
    { dimension: 'Economic', score: 60 },
    { dimension: 'Physical', score: 85 },
    { dimension: 'Institutional', score: 50 },
    { dimension: 'Environmental', score: 65 },
];

export const riskAssessmentData = districts.map(d => ({
    ...d,
    riskScore: d.hazardScore * d.exposure * d.vulnerabilityIndex,
})).sort((a, b) => b.riskScore - a.riskScore);
