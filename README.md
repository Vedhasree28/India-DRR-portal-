#  India DRR Technical Project — Disaster Risk Dashboard

A full-stack style frontend application designed to visualize and manage disaster risk data for Indian districts. This project simulates a command-center interface for the National Disaster Management Authority (NDMA) or Ministry of Earth Sciences (MoES).

##  Features :

*   **Interactive Geospatial Maps:** Custom Leaflet implementation with Choropleth layers to visualize risk levels across districts.
*   **Real-time Data Simulation:** Simulates live data feeds for hazard scores, exposure levels, and risk fluctuation.
*   **Analytical Dashboards:**
    *   **Vulnerability Analysis:** Radar and Bar charts (Recharts) breaking down social and economic vulnerability.
    *   **Hazard Layers:** Switchable views between Flood, Earthquake, Landslide, and Cyclone data.
    *   **Risk Assessment:** Scatterplots and tables correlating exposure vs. risk.
*   **Evacuation Planning:** Interactive module calculating optimal routes and evacuation times based on live variables.
*   **Modern UI/UX:** Fully responsive, dark-mode technical aesthetic built with Tailwind CSS.

##  Tech Stack:

*   **Core:** React 18, TypeScript, Vite
*   **Styling:** Tailwind CSS
*   **Visualization:** Leaflet (Maps), Recharts (Data Visualization)
*   **State Management:** React Hooks
*   **Icons:** Custom SVG Icon set

##  Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/india-drr-dashboard.git
    ```

2.  **Install dependencies**
    ```bash
    npm install
    npm install recharts
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

4.  **Open in browser**
    Visit `http://localhost:5173`

## 🔮 Future Scope

*   Integration with live API endpoints (IMD/USGS).
*   User authentication for different administrative levels.
*   PDF Report generation using `jspdf`.

---
*Developed as a technical showcase for modern React architecture and geospatial data handling.*
