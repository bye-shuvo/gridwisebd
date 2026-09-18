export interface HourData {
  hour: number;
  demand_kwh: number;
  solar_kwh: number;
  tariff_bdt_per_kwh: number;
}

export interface BatteryConfig {
  capacity_kwh: number;
  initial_energy_kwh: number;
  minimum_energy_kwh: number;
  max_charge_kwh_per_hour: number;
  max_discharge_kwh_per_hour: number;
}

export interface MicrogridPayload {
  scenario_id: string;
  operator_notes: string[];
  hours: HourData[];
  battery: BatteryConfig;
}

export type BatteryActionType = 'charge' | 'discharge' | 'idle';

export interface HourlyPlanItem {
  hour: number;
  grid_kwh: number;
  battery_action: BatteryActionType | string;
  battery_kwh: number;
  battery_energy_after_kwh: number;
  solar_used_kwh?: number;
  demand_kwh?: number;
  solar_kwh?: number;
  tariff_bdt_per_kwh?: number;
  cost_bdt?: number;
}

export interface DirectiveItem {
  directive_type: string;
  applies: boolean;
  structured_adjustment?: Record<string, unknown> | null;
  explanation: string;
}

export interface OptimizationResponse {
  scenario_id: string;
  total_grid_kwh: number;
  total_cost_bdt: number;
  peak_grid_kwh: number;
  plan_summary: string;
  directive_interpretation: DirectiveItem[];
  hourly_plan: HourlyPlanItem[];
  status?: string;
  computation_time_ms?: number;
}

export interface HealthResponse {
  status: 'ok' | 'healthy' | 'degraded' | 'error' | string;
  uptime_seconds?: number;
  timestamp?: string;
  version?: string;
  message?: string;
}

export interface ValidationErrorItem {
  path: string;
  field: string;
  message: string;
  keyword?: string;
}
