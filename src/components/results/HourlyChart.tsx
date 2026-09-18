import React, { useState } from 'react';
import type { HourlyPlanItem } from '@/types/microgrid';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { BarChart3, Layers, BatteryCharging } from 'lucide-react';
import { motion } from 'framer-motion';

interface HourlyChartProps {
  data: HourlyPlanItem[];
}

export const HourlyChart: React.FC<HourlyChartProps> = ({ data }) => {
  const [showSolar, setShowSolar] = useState(true);
  const [showDemand, setShowDemand] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [showBattery, setShowBattery] = useState(true);

  const chartData = data.map((item) => ({
    hour: `${item.hour.toString().padStart(2, '0')}:00`,
    hourRaw: item.hour,
    demand: item.demand_kwh,
    solar: item.solar_kwh,
    grid: item.grid_kwh,
    batterySoC: item.battery_energy_after_kwh,
    batteryAction: item.battery_action,
    batteryPower: item.battery_kwh,
    tariff: item.tariff_bdt_per_kwh,
  }));

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 16 },
        show: { opacity: 1, y: 0 },
      }}
      className="glass-card rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-xl space-y-4"
    >
      {/* Chart Header & Series Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              24-Hour Energy Dispatch & Storage Profile
            </h3>
            <p className="text-[11px] text-slate-400">
              Demand vs Photovoltaics vs Grid Import (Left Axis) • Battery Stored Energy (Right Axis)
            </p>
          </div>
        </div>

        {/* Series Filter Toggles */}
        <div className="flex items-center gap-1.5 flex-wrap text-xs">
          <button
            type="button"
            onClick={() => setShowDemand(!showDemand)}
            className={`px-2.5 py-1 rounded-md transition cursor-pointer flex items-center gap-1.5 border text-[11px] ${
              showDemand
                ? 'bg-rose-500/15 text-rose-300 border-rose-500/40'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            Demand
          </button>

          <button
            type="button"
            onClick={() => setShowSolar(!showSolar)}
            className={`px-2.5 py-1 rounded-md transition cursor-pointer flex items-center gap-1.5 border text-[11px] ${
              showSolar
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            Solar PV
          </button>

          <button
            type="button"
            onClick={() => setShowGrid(!showGrid)}
            className={`px-2.5 py-1 rounded-md transition cursor-pointer flex items-center gap-1.5 border text-[11px] ${
              showGrid
                ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            Grid Import
          </button>

          <button
            type="button"
            onClick={() => setShowBattery(!showBattery)}
            className={`px-2.5 py-1 rounded-md transition cursor-pointer flex items-center gap-1.5 border text-[11px] ${
              showBattery
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Battery SoC
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-[360px] pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="solarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="gridGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="demandGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />

            <XAxis
              dataKey="hour"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
            />

            <YAxis
              yAxisId="left"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              label={{
                value: 'Power (kWh)',
                angle: -90,
                position: 'insideLeft',
                fill: '#64748b',
                fontSize: 10,
                dx: 12,
              }}
            />

            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#10b981"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#10b981', opacity: 0.3 }}
              label={{
                value: 'Storage (kWh)',
                angle: 90,
                position: 'insideRight',
                fill: '#10b981',
                fontSize: 10,
                dx: -10,
              }}
            />

            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload || payload.length === 0) return null;
                const point = payload[0]?.payload;
                if (!point) return null;

                return (
                  <div className="p-3 rounded-xl glass-panel border border-slate-700 shadow-2xl text-xs space-y-2 min-w-[190px]">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 font-semibold text-white">
                      <span>Hour {label}</span>
                      <span className="text-[11px] text-amber-300 font-mono-code">
                        ৳{point.tariff} / kWh
                      </span>
                    </div>

                    <div className="space-y-1 font-mono-code text-[11px]">
                      <div className="flex justify-between text-rose-400">
                        <span>Demand:</span>
                        <span className="font-bold">{point.demand} kWh</span>
                      </div>
                      <div className="flex justify-between text-amber-400">
                        <span>Solar PV:</span>
                        <span className="font-bold">{point.solar} kWh</span>
                      </div>
                      <div className="flex justify-between text-cyan-400">
                        <span>Grid Import:</span>
                        <span className="font-bold">{point.grid} kWh</span>
                      </div>
                      <div className="flex justify-between text-emerald-400 border-t border-slate-800/80 pt-1">
                        <span>Battery SoC:</span>
                        <span className="font-bold">{point.batterySoC} kWh</span>
                      </div>
                      <div className="flex justify-between text-slate-300 pt-0.5">
                        <span>Battery Action:</span>
                        <span className="uppercase font-semibold text-emerald-300">
                          {point.batteryAction} {point.batteryPower > 0 ? `(${point.batteryPower} kW)` : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }}
            />

            {/* Solar Generation Area */}
            {showSolar && (
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="solar"
                name="Solar PV"
                stroke="#f59e0b"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#solarGradient)"
              />
            )}

            {/* Demand Line / Area */}
            {showDemand && (
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="demand"
                name="Demand"
                stroke="#f43f5e"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#demandGradient)"
              />
            )}

            {/* Grid Import Bar */}
            {showGrid && (
              <Bar
                yAxisId="left"
                dataKey="grid"
                name="Grid Import"
                fill="#0ea5e9"
                opacity={0.85}
                radius={[4, 4, 0, 0]}
              />
            )}

            {/* Battery Stored Energy Line on Right Axis */}
            {showBattery && (
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="batterySoC"
                name="Battery Stored Energy"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={{ r: 2.5, fill: '#10b981' }}
                activeDot={{ r: 5, fill: '#34d399', stroke: '#064e3b', strokeWidth: 2 }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};
