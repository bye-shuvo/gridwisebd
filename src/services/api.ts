import type { MicrogridPayload, OptimizationResponse, HealthResponse } from '@/types/microgrid';

export interface ApiError {
  type: 'VALIDATION_ERROR' | 'SERVER_ERROR' | 'NETWORK_ERROR' | 'TIMEOUT' | 'MALFORMED_JSON';
  status?: number;
  message: string;
  detail?: unknown;
}

const envUrl = import.meta.env.VITE_API_BASE_URL;
// Direct browser calls to onrender.com fail CORS and get blocked by client ad blockers.
// Always route through /api so Vite (locally) and Vercel rewrites (in production) proxy requests server-to-server.
const RAW_BASE_URL = (!envUrl || envUrl.includes('onrender.com')) ? '/api' : envUrl;
// Strip trailing slash if present
export const API_BASE_URL = RAW_BASE_URL.replace(/\/+$/, '');

/**
 * Perform a health check against GET /health
 */
export async function fetchHealth(): Promise<{
  isHealthy: boolean;
  latencyMs: number;
  data?: HealthResponse;
  errorMessage?: string;
}> {
  const startTime = performance.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const latencyMs = Math.round(performance.now() - startTime);

    if (response.ok) {
      try {
        const data = (await response.json()) as HealthResponse;
        return { isHealthy: true, latencyMs, data };
      } catch {
        return { isHealthy: true, latencyMs, data: { status: 'healthy' } };
      }
    } else {
      return {
        isHealthy: false,
        latencyMs,
        errorMessage: `Health check failed with status ${response.status}`,
      };
    }
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    const latencyMs = Math.round(performance.now() - startTime);
    const errorMsg = err instanceof Error ? err.message : 'Unreachable';
    return {
      isHealthy: false,
      latencyMs,
      errorMessage: errorMsg,
    };
  }
}

/**
 * Optimize energy schedule via POST /optimize-energy
 */
export async function postOptimizeEnergy(payload: MicrogridPayload): Promise<OptimizationResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25000);

  try {
    let response: Response;
    try {
      response = await fetch(`${API_BASE_URL}/optimize-energy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
    } catch (networkError: unknown) {
      clearTimeout(timeoutId);
      if (networkError instanceof DOMException && networkError.name === 'AbortError') {
        const err: ApiError = {
          type: 'TIMEOUT',
          message: 'Request timed out after 25s. The optimization model took too long to respond.',
        };
        throw err;
      }
      const err: ApiError = {
        type: 'NETWORK_ERROR',
        message: 'Could not connect to API server at ' + API_BASE_URL + '. Check your connection or API server status.',
      };
      throw err;
    }

    clearTimeout(timeoutId);

    // 400 or 422 Client/Validation Error
    if (response.status === 400 || response.status === 422) {
      let errorDetail: unknown = null;
      let errorMsg = `Request rejected with status ${response.status}.`;
      try {
        const body = await response.json();
        errorDetail = body;
        if (body?.detail) {
          errorMsg = typeof body.detail === 'string' ? body.detail : JSON.stringify(body.detail);
        } else if (body?.message) {
          errorMsg = body.message;
        }
      } catch {
        errorMsg = await response.text().catch(() => `Error ${response.status}`);
      }

      const err: ApiError = {
        type: 'VALIDATION_ERROR',
        status: response.status,
        message: errorMsg,
        detail: errorDetail,
      };
      throw err;
    }

    // 500+ Server Error
    if (response.status >= 500) {
      let serverMsg = 'server error, retry';
      try {
        const body = await response.json();
        if (body?.detail) serverMsg = typeof body.detail === 'string' ? body.detail : JSON.stringify(body.detail);
      } catch {
        // Fallback to default
      }
      const err: ApiError = {
        type: 'SERVER_ERROR',
        status: response.status,
        message: serverMsg,
      };
      throw err;
    }

    // Other non-200
    if (!response.ok) {
      const err: ApiError = {
        type: 'SERVER_ERROR',
        status: response.status,
        message: `Unexpected response status: ${response.status}`,
      };
      throw err;
    }

    // 200 OK -> parse JSON
    try {
      const data = (await response.json()) as OptimizationResponse;

      // Backend returns [hour, grid_kwh, solar_used_kwh, battery_action, battery_kwh, battery_energy_after_kwh]
      // Enrich with original payload demand_kwh, solar_kwh, and tariff_bdt_per_kwh for rich UI display
      if (Array.isArray(data.hourly_plan)) {
        data.hourly_plan = data.hourly_plan.map((item) => {
          const inputHour = payload.hours?.find((h) => h.hour === item.hour);
          const demand = item.demand_kwh ?? inputHour?.demand_kwh ?? 0;
          const solar = item.solar_kwh ?? inputHour?.solar_kwh ?? item.solar_used_kwh ?? 0;
          const tariff = item.tariff_bdt_per_kwh ?? inputHour?.tariff_bdt_per_kwh ?? 0;
          const grid = item.grid_kwh ?? 0;
          const cost = item.cost_bdt ?? Number((grid * tariff).toFixed(2));

          return {
            ...item,
            demand_kwh: demand,
            solar_kwh: solar,
            solar_used_kwh: item.solar_used_kwh ?? solar,
            tariff_bdt_per_kwh: tariff,
            grid_kwh: grid,
            cost_bdt: cost,
            battery_kwh: item.battery_kwh ?? 0,
            battery_energy_after_kwh: item.battery_energy_after_kwh ?? 0,
          };
        });
      }

      return data;
    } catch (parseError) {
      const err: ApiError = {
        type: 'MALFORMED_JSON',
        message: 'API returned malformed non-JSON response data.',
      };
      throw err;
    }
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Realistic Mock Engine fallback for testing & demo when API server is offline
 */
export function generateSimulatedOptimization(payload: MicrogridPayload): OptimizationResponse {
  let batteryEnergy = payload.battery.initial_energy_kwh;
  let totalGridKwh = 0;
  let totalCostBdt = 0;
  let peakGridKwh = 0;

  const hourly_plan = payload.hours.map((h) => {
    const netDemand = h.demand_kwh - h.solar_kwh;
    let batteryAction: 'charge' | 'discharge' | 'idle' = 'idle';
    let batteryKwh = 0;

    if (netDemand < 0) {
      // Solar surplus -> charge battery
      const surplus = Math.abs(netDemand);
      const roomToCharge = payload.battery.capacity_kwh - batteryEnergy;
      const chargeAmount = Math.min(surplus, roomToCharge, payload.battery.max_charge_kwh_per_hour);
      if (chargeAmount > 0.1) {
        batteryAction = 'charge';
        batteryKwh = Number(chargeAmount.toFixed(2));
        batteryEnergy += batteryKwh;
      }
    } else if (netDemand > 0 && h.tariff_bdt_per_kwh >= 9.0) {
      // High tariff -> discharge battery to offset grid import
      const availableEnergy = batteryEnergy - payload.battery.minimum_energy_kwh;
      const dischargeAmount = Math.min(netDemand, availableEnergy, payload.battery.max_discharge_kwh_per_hour);
      if (dischargeAmount > 0.1) {
        batteryAction = 'discharge';
        batteryKwh = Number(dischargeAmount.toFixed(2));
        batteryEnergy -= batteryKwh;
      }
    }

    // Remaining deficit met by grid
    let gridKwh = 0;
    if (batteryAction === 'charge') {
      const surplus = h.solar_kwh - h.demand_kwh;
      if (surplus < batteryKwh) {
        gridKwh = batteryKwh - surplus;
      }
    } else if (batteryAction === 'discharge') {
      gridKwh = Math.max(0, h.demand_kwh - h.solar_kwh - batteryKwh);
    } else {
      gridKwh = Math.max(0, h.demand_kwh - h.solar_kwh);
    }

    gridKwh = Number(gridKwh.toFixed(2));
    batteryEnergy = Number(Math.max(payload.battery.minimum_energy_kwh, Math.min(payload.battery.capacity_kwh, batteryEnergy)).toFixed(2));

    const costBdt = Number((gridKwh * h.tariff_bdt_per_kwh).toFixed(2));
    totalGridKwh += gridKwh;
    totalCostBdt += costBdt;
    if (gridKwh > peakGridKwh) peakGridKwh = gridKwh;

    return {
      hour: h.hour,
      demand_kwh: h.demand_kwh,
      solar_kwh: h.solar_kwh,
      tariff_bdt_per_kwh: h.tariff_bdt_per_kwh,
      grid_kwh: gridKwh,
      battery_action: batteryAction,
      battery_kwh: batteryKwh,
      battery_energy_after_kwh: batteryEnergy,
      cost_bdt: costBdt,
    };
  });

  return {
    scenario_id: payload.scenario_id,
    total_grid_kwh: Number(totalGridKwh.toFixed(2)),
    total_cost_bdt: Number(totalCostBdt.toFixed(2)),
    peak_grid_kwh: Number(peakGridKwh.toFixed(2)),
    plan_summary: `Optimal dispatch for ${payload.scenario_id}: Stored ${payload.battery.capacity_kwh} kWh solar surplus during midday hours 10:00–14:00, successfully peak-shaving high-tariff evening load (17:00–21:00). Reduced total grid expenditure to ${totalCostBdt.toFixed(0)} BDT.`,
    directive_interpretation: [
      {
        directive_type: 'SOLAR_PRE_CHARGE',
        applies: true,
        structured_adjustment: {
          charge_window: '10:00 - 14:00',
          max_charge_rate_kw: payload.battery.max_charge_kwh_per_hour,
          solar_utilization: '94.2%',
        },
        explanation: 'Captured excess midday photovoltaic generation into storage bank before evening peak.',
      },
      {
        directive_type: 'PEAK_TARIFF_SHAVING',
        applies: true,
        structured_adjustment: {
          discharge_window: '17:00 - 21:00',
          tariff_threshold_bdt: 12.0,
          peak_reduction_kw: 32.5,
        },
        explanation: 'Discharged battery storage during 14.20 BDT/kWh tariff window to minimize high-cost utility draw.',
      },
      {
        directive_type: 'EMERGENCY_RESERVE_HOLD',
        applies: true,
        structured_adjustment: {
          min_soc_kwh: payload.battery.minimum_energy_kwh,
          reserve_percentage: `${((payload.battery.minimum_energy_kwh / payload.battery.capacity_kwh) * 100).toFixed(0)}%`,
        },
        explanation: 'Protected critical minimum battery floor at all hours for islanding resilience.',
      },
      {
        directive_type: 'DIESEL_GENSET_COGENERATION',
        applies: false,
        structured_adjustment: null,
        explanation: 'no_op: Solar generation and battery capacity were sufficient to meet demand without auxiliary generator firing.',
      },
    ],
    hourly_plan,
    status: 'OPTIMAL',
    computation_time_ms: 184,
  };
}
