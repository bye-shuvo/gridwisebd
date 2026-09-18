# ⚡ GridWise UI — Intelligent Microgrid Optimization & Battery Scheduling

[![Live Demo](https://img.shields.io/badge/Live_Demo-gridwisebd.vercel.app-38bdf8?style=for-the-badge&logo=vercel)](https://gridwisebd.vercel.app/)
[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite_8-646CFF?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)

> **GridWise** is a production-grade operations dashboard for 24-hour microgrid energy dispatch, solar PV integration, battery energy storage system (BESS) scheduling, and tariff peak-shaving optimization. Built for the **BUP Hackathon 2026**.

---

## 🌐 Live Deployments & Endpoints

| Service | Environment | URL | Status |
| :--- | :--- | :--- | :--- |
| **Frontend UI** | Vercel (Edge CDN) | [gridwisebd.vercel.app](https://gridwisebd.vercel.app/) | ![Active](https://img.shields.io/badge/Status-Active-emerald) |
| **Optimization API** | Render (FastAPI + Uvicorn) | [bup-hackathon-2026.onrender.com](https://bup-hackathon-2026.onrender.com) | ![Online](https://img.shields.io/badge/Status-Online-emerald) |
| **API Docs (Swagger)** | Interactive OpenAPI UI | [bup-hackathon-2026.onrender.com/docs](https://bup-hackathon-2026.onrender.com/docs) | ![Swagger](https://img.shields.io/badge/Docs-Swagger-blue) |

---

## 🚀 Key Features

### 1. 🎛️ Scenario Configuration & Interactive JSON Editor
- **Multi-Tab Input Workspace**:
  - **Raw JSON Editor**: Live syntax highlighting, line counter, error diagnostics, and one-click JSON formatting.
  - **Drag-and-Drop Loader**: Instantly upload `.json` scenario files.
  - **Curated Presets**: Quick-load baseline scenarios (e.g. *Dhaka Commercial Microgrid*, *Monsoon Solar Reduction*, *Peak-Hour Outage Preparation*).
- **Client-Side Schema Validation**: Rigorous pre-flight validation using **Ajv** against OpenAPI schemas before sending network requests.

### 2. 🧠 Natural Language Operator Directive Interpretation
- Microgrid operators can submit free-form natural language directives (e.g. *"Reserve 20% battery for night outage"*, *"Do not charge between hours 17-21"*).
- The solver parses notes into structured constraints:
  - `solar_reduction`
  - `minimum_battery_reserve`
  - `no_charge_window`
  - `no_discharge_window`
  - `max_grid_window`
  - `no_op`
- Renders visual **Directive Interpretation Cards** with status badges, explanations, and key-value parameter adjustments.

### 3. 📊 Visual Analytics & Dispatch Visualization
- **KPI Summary Cards**: Total Grid Import (kWh), Total Cost (৳ BDT), and Peak Grid Spike (kW) with smooth easing count-up animations.
- **24-Hour Composed Recharts Graph**:
  - Stacked/Bar profiles for Solar PV generation, Load Demand, and Grid Import (Left Axis).
  - Continuous Line profile for Battery State of Charge / Stored Energy in kWh (Right Axis).
  - Interactive series toggles to isolate energy streams.
- **Dispatch & Storage Data Table**:
  - Hourly breakdown with dynamic direction indicators (**Charge** ⬆️, **Discharge** ⬇️, **Idle** ➖).
  - Battery power (kW), SoC (kWh), dynamic Time-of-Use tariffs, and hourly cost distribution.

### 4. 🛡️ Robust Architecture & CORS-Free Proxying
- **Vite Dev Server Proxy**: Seamless local development proxying `/api/*` to Render.
- **Vercel Edge Rewrites**: Production reverse proxy configured in `vercel.json` eliminates browser CORS restrictions and prevents client-side ad blocker interference (`net::ERR_BLOCKED_BY_CLIENT`).
- **Offline Simulation Fallback**: Built-in mathematical heuristics solver if the remote backend experiences cold starts or downtime.

---

## 🛠️ Technology Stack

- **Core**: React 19, TypeScript, Vite 8
- **Styling**: Tailwind CSS v4, Custom Glassmorphism UI design system
- **State Management**: Zustand (persisted state & reactive stores)
- **Data Visualization**: Recharts
- **Animation**: Framer Motion
- **Validation**: Ajv + Ajv-Formats (JSON Schema draft-07/2020-12)
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

---

## 📦 Project Structure

```text
gridwise-ui/
├── public/                     # Static assets & favicon
├── src/
│   ├── components/
│   │   ├── common/             # Header, ErrorBoundary, CountUpNumber, Tooltips
│   │   ├── empty/              # Empty state & quick-start templates
│   │   ├── input/              # JSON editor, tabs, drag-drop uploader, error panel
│   │   └── results/            # Summary cards, HourlyChart, HourlyTable, DirectivesList
│   ├── data/                   # Default sample scenarios & presets
│   ├── services/               # API clients, telemetry fetch, payload enrichment
│   ├── store/                  # Zustand state store (useMicrogridStore.ts)
│   ├── types/                  # TypeScript interfaces (OpenAPI aligned)
│   ├── App.tsx                 # Main application shell
│   ├── main.tsx                # React DOM root
│   └── index.css               # Design tokens, CSS variables & typography
├── .env                        # Local environment variables
├── .env.example                # Example environment variables
├── vercel.json                 # Vercel reverse proxy rewrites configuration
├── vite.config.ts              # Vite plugins, aliases & dev proxy
└── package.json                # Project dependencies and build scripts
```

---

## ⚙️ Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **pnpm** or **yarn**

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/bye-shuvo/gridwisebd.git
   cd gridwisebd
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the project root:
   ```env
   # Uses local Vite proxy (recommended)
   VITE_API_BASE_URL=/api
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🏗️ Production Build

To test and compile the production bundle:

```bash
# Type check and build with Vite
npm run build

# Preview the built production output locally
npm run preview
```

---

## 📋 API Schema Specification

### Optimization Request (`POST /api/optimize-energy`)
```json
{
  "scenario_id": "dhaka_commercial_01",
  "operator_notes": [
    "Reserve at least 25% battery capacity from hour 18 onwards"
  ],
  "hours": [
    {
      "hour": 0,
      "demand_kwh": 5.2,
      "solar_kwh": 0.0,
      "tariff_bdt_per_kwh": 6.5
    }
    // ... exactly 24 hourly items (0 - 23)
  ],
  "battery": {
    "capacity_kwh": 25.0,
    "initial_energy_kwh": 10.0,
    "minimum_energy_kwh": 5.0,
    "max_charge_kwh_per_hour": 5.0,
    "max_discharge_kwh_per_hour": 5.0
  }
}
```

### Optimization Response
```json
{
  "scenario_id": "dhaka_commercial_01",
  "total_grid_kwh": 142.5,
  "total_cost_bdt": 1284.50,
  "peak_grid_kwh": 11.2,
  "plan_summary": "Battery dispatched during peak hours (17:00 - 22:00) reducing grid reliance by 34%.",
  "directive_interpretation": [
    {
      "note_index": 0,
      "directive_type": "minimum_battery_reserve",
      "applies": true,
      "structured_adjustment": { "minimum_energy_kwh": 6.25 },
      "explanation": "Applied reserve threshold of 25% starting from hour 18."
    }
  ],
  "hourly_plan": [
    {
      "hour": 0,
      "grid_kwh": 5.2,
      "solar_used_kwh": 0.0,
      "battery_action": "idle",
      "battery_kwh": 0.0,
      "battery_energy_after_kwh": 10.0
    }
  ]
}
```

---

## 👥 Authors & Team

Developed for the **BUP Hackathon 2026** by:
- **Abu Hasnat Shuvo** ([@bye-shuvo](https://github.com/bye-shuvo))

---

## 📄 License
This project is licensed under the **MIT License**.
