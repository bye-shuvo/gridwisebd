import React from 'react';
import { useMicrogridStore } from '@/store/useMicrogridStore';
import { Loader2, Zap, Cpu } from 'lucide-react';

export const LoadingSkeleton: React.FC = () => {
  const { isSubmitting, submitProgress, progressStage } = useMicrogridStore();

  if (!isSubmitting) return null;

  return (
    <section className="glass-panel rounded-2xl p-6 border border-cyan-500/30 shadow-2xl space-y-6 animate-in fade-in duration-300">
      {/* Active Stage & Progress Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 animate-spin">
            <Loader2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              Microgrid Optimization in Progress
            </h3>
            <p className="text-xs text-cyan-300/80 font-mono-code">
              {progressStage || 'Running solver algorithm...'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono-code text-cyan-400 font-bold">
            {submitProgress}%
          </span>
        </div>
      </div>

      {/* Animated Glowing Progress Bar */}
      <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-800">
        <div
          className="bg-gradient-to-r from-cyan-500 via-blue-500 to-amber-400 h-full rounded-full transition-all duration-300 shadow-sm shadow-cyan-500/50"
          style={{ width: `${Math.max(submitProgress, 10)}%` }}
        />
      </div>

      {/* Shimmer Placeholder Skeletons */}
      <div className="space-y-6 pt-2">
        {/* Skeletons for 3 KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="glass-card rounded-xl p-5 border border-slate-800 relative overflow-hidden"
            >
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent" />
              <div className="flex justify-between items-start mb-3">
                <div className="h-4 bg-slate-800/80 rounded w-24" />
                <div className="w-8 h-8 rounded-lg bg-slate-800/80" />
              </div>
              <div className="h-8 bg-slate-800/90 rounded w-32 mb-2" />
              <div className="h-3 bg-slate-800/60 rounded w-44" />
            </div>
          ))}
        </div>

        {/* Skeleton for Plan Summary Quote */}
        <div className="glass-card rounded-xl p-5 border border-slate-800 relative overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent" />
          <div className="h-4 bg-slate-800 rounded w-36 mb-3" />
          <div className="space-y-2">
            <div className="h-3 bg-slate-800/80 rounded w-full" />
            <div className="h-3 bg-slate-800/60 rounded w-5/6" />
          </div>
        </div>

        {/* Skeleton for 24h Chart */}
        <div className="glass-card rounded-xl p-6 border border-slate-800 relative overflow-hidden min-h-[260px] flex flex-col justify-between">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent" />
          <div className="flex justify-between items-center">
            <div className="h-4 bg-slate-800 rounded w-48" />
            <div className="flex gap-2">
              <div className="h-4 bg-slate-800 rounded w-16" />
              <div className="h-4 bg-slate-800 rounded w-16" />
            </div>
          </div>
          <div className="flex items-end justify-between gap-2 h-44 px-4 pt-6">
            {[40, 25, 30, 20, 35, 55, 70, 85, 95, 100, 90, 80, 65, 50, 60, 75, 88, 92, 80, 60, 45, 30, 20, 15].map((h, idx) => (
              <div
                key={idx}
                className="w-full bg-slate-800/60 rounded-t"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
