import type { MicrogridPayload } from '@/types/microgrid';

export const sampleMicrogridScenario: MicrogridPayload = {
  scenario_id: 'BUP-MICROGRID-BENCHMARK-01',
  operator_notes: [
    'Solar peak expected between 11:00 and 14:00 with clear skies',
    'Evening peak tariff in effect from 17:00 to 22:00 (14.20 BDT/kWh)',
    'Pre-charge battery during midday solar surplus to avoid peak grid imports'
  ],
  battery: {
    capacity_kwh: 120.0,
    initial_energy_kwh: 35.0,
    minimum_energy_kwh: 18.0,
    max_charge_kwh_per_hour: 30.0,
    max_discharge_kwh_per_hour: 35.0
  },
  hours: [
    { hour: 0, demand_kwh: 18.5, solar_kwh: 0.0, tariff_bdt_per_kwh: 6.50 },
    { hour: 1, demand_kwh: 15.2, solar_kwh: 0.0, tariff_bdt_per_kwh: 6.50 },
    { hour: 2, demand_kwh: 14.0, solar_kwh: 0.0, tariff_bdt_per_kwh: 6.50 },
    { hour: 3, demand_kwh: 13.8, solar_kwh: 0.0, tariff_bdt_per_kwh: 6.50 },
    { hour: 4, demand_kwh: 16.1, solar_kwh: 0.0, tariff_bdt_per_kwh: 6.50 },
    { hour: 5, demand_kwh: 22.4, solar_kwh: 1.5, tariff_bdt_per_kwh: 7.20 },
    { hour: 6, demand_kwh: 34.0, solar_kwh: 12.0, tariff_bdt_per_kwh: 8.50 },
    { hour: 7, demand_kwh: 42.5, solar_kwh: 28.5, tariff_bdt_per_kwh: 8.50 },
    { hour: 8, demand_kwh: 55.0, solar_kwh: 52.0, tariff_bdt_per_kwh: 9.00 },
    { hour: 9, demand_kwh: 62.0, solar_kwh: 78.4, tariff_bdt_per_kwh: 9.00 },
    { hour: 10, demand_kwh: 68.5, solar_kwh: 95.0, tariff_bdt_per_kwh: 9.50 },
    { hour: 11, demand_kwh: 72.0, solar_kwh: 108.5, tariff_bdt_per_kwh: 9.50 },
    { hour: 12, demand_kwh: 75.0, solar_kwh: 115.0, tariff_bdt_per_kwh: 9.50 },
    { hour: 13, demand_kwh: 70.2, solar_kwh: 106.0, tariff_bdt_per_kwh: 9.50 },
    { hour: 14, demand_kwh: 64.0, solar_kwh: 88.0, tariff_bdt_per_kwh: 9.00 },
    { hour: 15, demand_kwh: 58.0, solar_kwh: 61.5, tariff_bdt_per_kwh: 9.00 },
    { hour: 16, demand_kwh: 52.5, solar_kwh: 32.0, tariff_bdt_per_kwh: 10.50 },
    { hour: 17, demand_kwh: 68.0, solar_kwh: 8.5, tariff_bdt_per_kwh: 13.50 },
    { hour: 18, demand_kwh: 82.5, solar_kwh: 0.0, tariff_bdt_per_kwh: 14.20 },
    { hour: 19, demand_kwh: 95.0, solar_kwh: 0.0, tariff_bdt_per_kwh: 14.20 },
    { hour: 20, demand_kwh: 91.0, solar_kwh: 0.0, tariff_bdt_per_kwh: 14.20 },
    { hour: 21, demand_kwh: 78.0, solar_kwh: 0.0, tariff_bdt_per_kwh: 13.80 },
    { hour: 22, demand_kwh: 54.0, solar_kwh: 0.0, tariff_bdt_per_kwh: 11.00 },
    { hour: 23, demand_kwh: 31.0, solar_kwh: 0.0, tariff_bdt_per_kwh: 7.50 }
  ]
};

export const sampleAlternativeScenario: MicrogridPayload = {
  scenario_id: 'BUP-MICROGRID-HIGH-DEMAND-02',
  operator_notes: [
    'Industrial facility operating evening second shift',
    'High tariff sensitivity during grid strain hours'
  ],
  battery: {
    capacity_kwh: 150.0,
    initial_energy_kwh: 50.0,
    minimum_energy_kwh: 20.0,
    max_charge_kwh_per_hour: 40.0,
    max_discharge_kwh_per_hour: 45.0
  },
  hours: sampleMicrogridScenario.hours.map(h => ({
    ...h,
    demand_kwh: Number((h.demand_kwh * 1.25).toFixed(1)),
    solar_kwh: Number((h.solar_kwh * 0.85).toFixed(1)),
  }))
};
