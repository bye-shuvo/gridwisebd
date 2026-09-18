import React from 'react';
import type { OptimizationResponse } from '@/types/microgrid';
import { SummaryCards } from './SummaryCards';
import { PlanSummaryQuote } from './PlanSummaryQuote';
import { DirectivesList } from './DirectivesList';
import { HourlyChart } from './HourlyChart';
import { HourlyTable } from './HourlyTable';
import { motion } from 'framer-motion';
import { Download, CheckCircle2, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';

interface ResultsContainerProps {
  results: OptimizationResponse;
  onReset?: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

export const ResultsContainer: React.FC<ResultsContainerProps> = ({ results, onReset }) => {
  const handleExportJson = () => {
    const jsonStr = JSON.stringify(results, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `optimized-plan-${results.scenario_id}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Downloaded optimized schedule JSON');
  };

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 pt-2"
    >
      {/* Results Header */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: -10 },
          show: { opacity: 1, y: 0 },
        }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Optimization Plan: {results.scenario_id}
            </h2>
            <p className="text-xs text-slate-400">
              Optimal dispatch model converged successfully
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportJson}
            className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            Export Schedule (.json)
          </button>

          {onReset && (
            <button
              type="button"
              onClick={onReset}
              className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset View
            </button>
          )}
        </div>
      </motion.div>

      {/* 1. Summary Cards (Count-Up Numbers) */}
      <SummaryCards data={results} />

      {/* 2. Highlighted Executive Plan Summary */}
      <PlanSummaryQuote
        summary={results.plan_summary}
        scenarioId={results.scenario_id}
        computationTimeMs={results.computation_time_ms}
      />

      {/* 3. Directive Interpretations */}
      <DirectivesList directives={results.directive_interpretation} />

      {/* 4. Interactive 24-Hour Recharts Graph */}
      <HourlyChart data={results.hourly_plan} />

      {/* 5. Hourly Breakdown Table */}
      <HourlyTable hourlyPlan={results.hourly_plan} />
    </motion.section>
  );
};
