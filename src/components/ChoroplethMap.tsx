import React, { useState, useEffect, useRef } from 'react';
import type { DistrictData } from '../types';

interface ChoroplethMapProps {
    data: DistrictData[];
    displayMetric?: 'riskLevel' | 'hazardScore' | 'vulnerabilityIndex' | 'exposure' | 'riskScore';
    opacity?: number;
    showRoutes?: boolean;
    initialMapTypeId?: 'roadmap' | 'satellite' | 'hybrid' | 'terrain';
}

// Leaflet types (simplification for TS)
declare global {
    interface Window {
        L: any;
    }
}

const ChoroplethMap: React.FC<ChoroplethMapProps> = ({ 
    data: initialData, 
    displayMetric = 'riskLevel', 
    opacity = 70, 
    showRoutes = false,
    initialMapTypeId = 'roadmap'
}) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const tileLayerRef = useRef<any>(null);
    const markersLayerGroupRef = useRef<any>(null);
    
    // Live Data State
    const [liveData, setLiveData] = useState<DistrictData[]>(initialData);
    const [selectedDistrict, setSelectedDistrict] = useState<DistrictData | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
    const [mapTypeId, setMapTypeId] = useState<string>(initialMapTypeId);

    // 1. Initialize Leaflet Map
    useEffect(() => {
        if (!mapContainerRef.current || mapInstanceRef.current) return;

        // Initialize Map centered on India
        const map = window.L.map(mapContainerRef.current, {
            center: [22.5937, 78.9629],
            zoom: 5,
            zoomControl: false // We can add custom zoom control if needed, or use default
        });

        // Add Zoom Control to top-right to match previous layout
        window.L.control.zoom({ position: 'topright' }).addTo(map);

        // Layer Group for markers/circles
        const layerGroup = window.L.layerGroup().addTo(map);
        markersLayerGroupRef.current = layerGroup;
        mapInstanceRef.current = map;

        // Force a resize calculation after mount to ensure tiles load correctly
        setTimeout(() => {
            map.invalidateSize();
        }, 100);

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    // 2. Handle Map Type (Tile Layer) Switching
    useEffect(() => {
        if (!mapInstanceRef.current) return;

        // Remove existing tile layer
        if (tileLayerRef.current) {
            tileLayerRef.current.remove();
        }

        let tileUrl = '';
        let attribution = '';

        switch (mapTypeId) {
            case 'satellite':
                // Esri World Imagery (Free for non-commercial/dev)
                tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
                attribution = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
                break;
            case 'terrain':
                // OpenTopoMap
                tileUrl = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
                attribution = 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)';
                break;
            case 'hybrid':
                // Stamen Toner Lite (High contrast, good for overlays) or similar
                // Using CartoDB Dark Matter for a tech/dashboard feel
                tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
                attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';
                break;
            case 'roadmap':
            default:
                // OpenStreetMap Standard
                tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
                attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
                break;
        }

        const newLayer = window.L.tileLayer(tileUrl, {
            attribution: attribution,
            maxZoom: 19
        });

        newLayer.addTo(mapInstanceRef.current);
        tileLayerRef.current = newLayer;

    }, [mapTypeId]);

    // 3. React to Prop Changes
    useEffect(() => {
        setLiveData(initialData);
        if (selectedDistrict && !initialData.find(d => d.id === selectedDistrict.id)) {
            setSelectedDistrict(null);
        }
    }, [initialData]);

    // 4. Live Data Simulation
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            setLastUpdated(now);
            
            setLiveData(prevData => prevData.map(d => {
                const fluctuation = (Math.random() - 0.5) * 0.05;
                const baseItem = initialData.find(item => item.id === d.id) || d;
                const newRisk = Math.min(1, Math.max(0, (baseItem.riskScore || 0) + fluctuation));
                const newHazard = Math.min(1, Math.max(0, baseItem.hazardScore + fluctuation));
                
                let newLevel: 'High'|'Medium'|'Low' = d.riskLevel;
                if (newRisk > 0.7) newLevel = 'High';
                else if (newRisk > 0.4) newLevel = 'Medium';
                else newLevel = 'Low';

                return {
                    ...d,
                    riskScore: newRisk,
                    hazardScore: newHazard,
                    riskLevel: newLevel
                };
            }));
        }, 5000); 

        return () => clearInterval(interval);
    }, [initialData]);

    // 5. Update Map Visuals (Circles & Routes)
    useEffect(() => {
        if (!mapInstanceRef.current || !markersLayerGroupRef.current) return;

        // Clear existing markers
        markersLayerGroupRef.current.clearLayers();

        // Add District Circles
        liveData.forEach(district => {
            let color = '#38b2ac'; 
            let radius = 100000; 

            const val = 
                displayMetric === 'hazardScore' ? district.hazardScore :
                displayMetric === 'vulnerabilityIndex' ? district.vulnerabilityIndex :
                displayMetric === 'exposure' ? district.exposure :
                (district.riskScore || 0);

            if (val > 0.7) color = '#ef4444'; // Red
            else if (val > 0.4) color = '#f97316'; // Orange
            else color = '#22c55e'; // Green

            if (displayMetric === 'riskLevel') {
                color = district.riskLevel === 'High' ? '#ef4444' : district.riskLevel === 'Medium' ? '#f97316' : '#22c55e';
            }

            // Adjust radius based on exposure for visual variety
            radius = 30000 + (district.exposure * 40000); 

            const circle = window.L.circle([district.lat, district.lng], {
                color: color,
                fillColor: color,
                fillOpacity: opacity / 100,
                radius: radius,
                weight: 2
            });

            // Add click interaction
            circle.on('click', () => {
                setSelectedDistrict(district);
                mapInstanceRef.current.setView([district.lat, district.lng], 8, { animate: true });
            });
            
            // Add simple tooltip on hover
            circle.bindTooltip(`<b>${district.name}</b><br>Score: ${val.toFixed(2)}`, {
                direction: 'top',
                offset: [0, -10]
            });

            circle.addTo(markersLayerGroupRef.current);
        });

        // Add Routes if enabled
        if (showRoutes) {
             const routes = [
                [[19.0760, 72.8777], [19.2, 73.1], [19.4, 73.5]], // Mumbai Route
                [[13.0827, 80.2707], [13.0, 80.1], [12.9, 79.9]]  // Chennai Route
            ];

            routes.forEach(path => {
                const polyline = window.L.polyline(path, {
                    color: '#38b2ac',
                    weight: 4,
                    dashArray: '10, 10', 
                    opacity: 1
                });
                
                // Add an arrowhead-like marker at the end
                const endPoint = path[path.length - 1];
                const arrowIcon = window.L.divIcon({
                    className: '',
                    html: '<div style="font-size: 20px; color: #38b2ac; transform: rotate(45deg);">➤</div>',
                    iconSize: [20, 20],
                    iconAnchor: [10, 10]
                });
                window.L.marker(endPoint, { icon: arrowIcon }).addTo(markersLayerGroupRef.current);

                polyline.addTo(markersLayerGroupRef.current);
            });
        }

    }, [liveData, displayMetric, opacity, showRoutes, selectedDistrict]);


    return (
        <div className="relative w-full h-full bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
            {/* Map Container */}
            <div ref={mapContainerRef} className="w-full h-full z-0" style={{ background: '#1a202c' }} />
            
            {/* Live Indicator */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-gray-900 bg-opacity-90 border border-teal-500 px-4 py-1 rounded-full shadow-lg z-[400] flex items-center space-x-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span>
                </span>
                <span className="text-teal-400 text-xs font-bold uppercase tracking-wider">
                    Live Data Feed
                </span>
                <span className="text-gray-500 text-xs border-l border-gray-600 pl-2">
                    Updated: {lastUpdated.toLocaleTimeString()}
                </span>
            </div>

            {/* Map Type Control */}
            <div className="absolute top-4 right-14 z-[400] bg-gray-800 rounded-md border border-gray-600 shadow-lg p-1">
                <select 
                    value={mapTypeId} 
                    onChange={(e) => setMapTypeId(e.target.value)}
                    className="bg-gray-800 text-white text-xs border-none focus:ring-0 cursor-pointer outline-none"
                >
                    <option value="roadmap">Street Map</option>
                    <option value="satellite">Satellite</option>
                    <option value="hybrid">Dark Tech</option>
                    <option value="terrain">Terrain</option>
                </select>
            </div>

            {/* District Detail Modal Overlay */}
            {selectedDistrict && (
                <div className="absolute bottom-4 left-4 w-72 bg-gray-800 border border-gray-600 rounded-lg shadow-2xl p-4 z-[400] animate-fade-in-up">
                    <div className="flex justify-between items-start mb-3">
                        <div>
                            <h3 className="text-xl font-bold text-white">{selectedDistrict.name}</h3>
                            <p className="text-xs text-gray-400 flex items-center mt-1">
                                <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                                Live Monitoring Active
                            </p>
                        </div>
                        <button onClick={() => setSelectedDistrict(null)} className="text-gray-400 hover:text-white">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                            <span className="text-gray-400">Current Risk Level</span>
                            <span className={`font-bold px-2 py-0.5 rounded ${
                                selectedDistrict.riskLevel === 'High' ? 'bg-red-900 text-red-200' :
                                selectedDistrict.riskLevel === 'Medium' ? 'bg-yellow-900 text-yellow-200' : 'bg-green-900 text-green-200'
                            }`}>{selectedDistrict.riskLevel}</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                             <div className="bg-gray-700 p-2 rounded">
                                <p className="text-xs text-gray-400">Live Hazard</p>
                                <p className="font-mono text-lg font-semibold text-white">{selectedDistrict.hazardScore.toFixed(3)}</p>
                             </div>
                             <div className="bg-gray-700 p-2 rounded">
                                <p className="text-xs text-gray-400">Risk Score</p>
                                <p className="font-mono text-lg font-semibold text-white">{selectedDistrict.riskScore?.toFixed(3)}</p>
                             </div>
                        </div>

                        <div className="pt-2">
                             <p className="text-xs text-gray-500 mb-1">Exposure Index</p>
                             <div className="w-full bg-gray-700 rounded-full h-1.5">
                                <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${selectedDistrict.exposure * 100}%` }}></div>
                             </div>
                        </div>

                        <button className="w-full mt-2 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded text-xs transition-colors shadow-lg">
                            Initiate Protocol
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChoroplethMap;