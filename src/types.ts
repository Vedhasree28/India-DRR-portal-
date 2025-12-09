export type Page =
  | 'dashboard'
  | 'hazard-layers'
  | 'vulnerability-analysis'
  | 'risk-assessment'
  | 'evacuation-planning'
  | 'data-explorer'
  | 'reports';

export interface DistrictData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  riskLevel: 'High' | 'Medium' | 'Low';
  population: number;
  vulnerabilityIndex: number;
  hazardScore: number;
  exposure: number;
  riskScore?: number;
}

export interface RiskTrendData {
  year: number;
  riskIndex: number;
}

export interface HazardVulnerabilityData {
  name: string;
  hazard: number;
  vulnerability: number;
  exposure: number;
}

export interface VulnerabilityIndicator {
  name: string;
  value: number;
  weight: number;
}

export interface VulnerabilityDimension {
  dimension: string;
  score: number;
}
