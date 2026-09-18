import React from 'react';
import { useMicrogridStore } from '@/store/useMicrogridStore';
import { Zap, BatteryCharging, Sun, ArrowUpRight, CheckCircle, Sparkles } from 'lucide-react';
import { sampleMicrogridScenario } from '@/data/sampleScenario';

export const EmptyState: React.FC = () => {
  const { loadPreset, submitOptimization } = useMicrogridStore();

  const handleQuickStart = () => {
    loadPreset(sampleMicrogridScenario);
  };

  const handleQuickDemo = () => {
    loadPreset(sampleMicrogridScenario);
    setTimeout(() => {
      submitOptimization(true);
    }, 100);
  };

  return (
    <div className="glass-panel rounded-2xl p-8 sm:p-12 border border-slate-800 text-center relative overflow-hidden shadow-2xl">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-cyan-500/10 via-amber-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-xl mx-auto space-y-6">
        {/* Animated Visual Energy Hub Illustration */}
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
            <Sun className="w-6 h-6 animate-[spin_12s_linear_infinite]" />
          </div>
          <div className="h-0.5 w-8 bg-gradient-to-r from-amber-500 to-cyan-500 rounded-full" />
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/15 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-xl shadow-cyan-500/20 animate-pulse">
            <Zap className="w-8 h-8 fill-cyan-400/20" />
          </div>
          <div className="h-0.5 w-8 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full" />
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10">
            <BatteryCharging className="w-6 h-6" />
          </div>
        </div>

        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Ready to Optimize Microgrid Energy
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
            Provide a valid 24-hour scenario payload above to compute the mathematical optimal battery charging schedule, reduce grid peak imports, and minimize utility tariff expenditure.
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left pt-2">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 mb-1">
              <Sun className="w-3.5 h-3.5" /> Solar Arbitrage
            </div>
            <p className="text-[11px] text-slate-400">
              Absorbs midday PV surplus into storage before evening peak prices.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 mb-1">
              <Zap className="w-3.5 h-3.5" /> Peak Shaving
            </div>
            <p className="text-[11px] text-slate-400">
              Clamps grid demand during critical 14.20 BDT/kWh tariff windows.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 mb-1">
              <CheckCircle className="w-3.5 h-3.5" /> Reserve Protection
            </div>
            <p className="text-[11px] text-slate-400">
              Guarantees battery capacity floor for uninterrupted islanding resilience.
            </p>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleQuickStart}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
          >
            Load Benchmark Scenario
            <ArrowUpRight className="w-4 h-4 text-cyan-400" />
          </button>

          <button
            type="button"
            onClick={handleQuickDemo}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            Instant 1-Click Simulation
          </button>
        </div>
      </div>
    </div>
  );
};
