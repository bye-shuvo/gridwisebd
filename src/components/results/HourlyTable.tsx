import React from 'react';
import type { HourlyPlanItem } from '@/types/microgrid';
import { ArrowUp, ArrowDown, Minus, Table as TableIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface HourlyTableProps {
  hourlyPlan: HourlyPlanItem[];
}

export const HourlyTable: React.FC<HourlyTableProps> = ({ hourlyPlan }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 16 },
        show: { opacity: 1, y: 0 },
      }}
      className="glass-card rounded-2xl border border-slate-800 shadow-xl overflow-hidden"
    >
      <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-900/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <TableIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Hourly Dispatch & Storage Schedule
            </h3>
            <p className="text-[11px] text-slate-400">
              Detailed 24-hour breakdown with battery dispatch direction and cost distribution
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <div className="flex items-center gap-1">
            <span className="inline-flex items-center justify-center w-4 h-4 rounded bg-emerald-500/20 text-emerald-400">
              <ArrowUp className="w-3 h-3 stroke-[2.5]" />
            </span>
            <span>Charge</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="inline-flex items-center justify-center w-4 h-4 rounded bg-amber-500/20 text-amber-400">
              <ArrowDown className="w-3 h-3 stroke-[2.5]" />
            </span>
            <span>Discharge</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="inline-flex items-center justify-center w-4 h-4 rounded bg-slate-800 text-slate-400">
              <Minus className="w-3 h-3" />
            </span>
            <span>Idle</span>
          </div>
        </div>
      </div>

      {/* Scrollable Table Container */}
      <div className="overflow-x-auto max-h-[460px]">
        <table className="w-full text-left text-xs border-collapse font-mono-code">
          <thead className="sticky top-0 bg-slate-950/90 backdrop-blur-md text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800 z-10">
            <tr>
              <th className="py-3 px-4">Hour</th>
              <th className="py-3 px-4">Demand</th>
              <th className="py-3 px-4">Solar PV</th>
              <th className="py-3 px-4">Grid Import</th>
              <th className="py-3 px-4">Battery Action</th>
              <th className="py-3 px-4">Action Power</th>
              <th className="py-3 px-4">Battery SoC</th>
              <th className="py-3 px-4">Tariff</th>
              <th className="py-3 px-4 text-right">Est. Cost</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {hourlyPlan.map((row) => {
              const action = (row.battery_action || 'idle').toLowerCase();
              const isCharge = action === 'charge';
              const isDischarge = action === 'discharge';
              const demand = row.demand_kwh ?? 0;
              const solar = row.solar_kwh ?? row.solar_used_kwh ?? 0;
              const grid = row.grid_kwh ?? 0;
              const batteryKw = row.battery_kwh ?? 0;
              const batterySoC = row.battery_energy_after_kwh ?? 0;
              const tariff = row.tariff_bdt_per_kwh ?? 0;
              const cost = row.cost_bdt ?? Number((grid * tariff).toFixed(2));

              return (
                <tr
                  key={row.hour}
                  className="hover:bg-cyan-500/5 transition-colors group"
                >
                  <td className="py-2.5 px-4 font-semibold text-white">
                    {row.hour.toString().padStart(2, '0')}:00
                  </td>
                  <td className="py-2.5 px-4 text-rose-300">
                    {demand.toFixed(1)} kWh
                  </td>
                  <td className="py-2.5 px-4 text-amber-300">
                    {solar.toFixed(1)} kWh
                  </td>
                  <td className="py-2.5 px-4 text-cyan-300 font-semibold">
                    {grid.toFixed(1)} kWh
                  </td>

                  {/* Battery Action Icon & Badge */}
                  <td className="py-2.5 px-4">
                    {isCharge && (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        <ArrowUp className="w-3 h-3 stroke-[3]" />
                        Charge
                      </span>
                    )}
                    {isDischarge && (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/30">
                        <ArrowDown className="w-3 h-3 stroke-[3]" />
                        Discharge
                      </span>
                    )}
                    {!isCharge && !isDischarge && (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-slate-800/80 text-slate-400 border border-slate-700">
                        <Minus className="w-3 h-3" />
                        Idle
                      </span>
                    )}
                  </td>

                  <td className="py-2.5 px-4 text-slate-300">
                    {batteryKw > 0 ? `${batteryKw.toFixed(1)} kW` : '—'}
                  </td>

                  <td className="py-2.5 px-4 text-emerald-300 font-semibold">
                    {batterySoC.toFixed(1)} kWh
                  </td>

                  <td className="py-2.5 px-4 text-slate-400">
                    ৳{tariff.toFixed(2)}
                  </td>

                  <td className="py-2.5 px-4 text-right font-semibold text-amber-300">
                    ৳{cost.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};
