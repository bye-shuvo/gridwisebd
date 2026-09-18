import React from 'react';
import { CountUpNumber } from '@/components/common/CountUpNumber';
import type { OptimizationResponse } from '@/types/microgrid';
import { Zap, Gauge, DollarSign, ArrowDownRight, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface SummaryCardsProps {
  data: OptimizationResponse;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* 1. Total Grid kWh */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 16 },
          show: { opacity: 1, y: 0 },
        }}
        className="glass-card rounded-2xl p-5 border border-cyan-500/20 relative overflow-hidden group hover:border-cyan-500/50 transition-all"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Total Grid Import
          </span>
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Zap className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <CountUpNumber
            value={data.total_grid_kwh}
            decimals={1}
            className="text-3xl font-extrabold font-mono-code text-white tracking-tight"
          />
          <span className="text-xs font-semibold text-cyan-400">kWh</span>
        </div>

        <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-400">
          <ArrowDownRight className="w-3.5 h-3.5 text-emerald-400" />
          <span>Optimized across 24-hour cycle</span>
        </div>
      </motion.div>

      {/* 2. Total Cost BDT */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 16 },
          show: { opacity: 1, y: 0 },
        }}
        className="glass-card rounded-2xl p-5 border border-amber-500/20 relative overflow-hidden group hover:border-amber-500/50 transition-all"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Total Energy Cost
          </span>
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <span className="font-bold text-sm">৳</span>
          </div>
        </div>

        <div className="flex items-baseline gap-1.5">
          <span className="text-xl font-bold text-amber-400">৳</span>
          <CountUpNumber
            value={data.total_cost_bdt}
            decimals={2}
            className="text-3xl font-extrabold font-mono-code text-white tracking-tight"
          />
          <span className="text-xs font-semibold text-amber-400">BDT</span>
        </div>

        <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-400">
          <span className="text-amber-300 font-mono-code">
            ~{data.total_grid_kwh > 0 ? (data.total_cost_bdt / data.total_grid_kwh).toFixed(2) : '0'} ৳/kWh
          </span>
          <span>effective grid tariff</span>
        </div>
      </motion.div>

      {/* 3. Peak Grid Demand */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 16 },
          show: { opacity: 1, y: 0 },
        }}
        className="glass-card rounded-2xl p-5 border border-purple-500/20 relative overflow-hidden group hover:border-purple-500/50 transition-all"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Peak Grid Import
          </span>
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Gauge className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <CountUpNumber
            value={data.peak_grid_kwh}
            decimals={1}
            className="text-3xl font-extrabold font-mono-code text-white tracking-tight"
          />
          <span className="text-xs font-semibold text-purple-400">kW peak</span>
        </div>

        <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-400">
          <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
          <span>Maximum instantaneous import spike</span>
        </div>
      </motion.div>
    </div>
  );
};
