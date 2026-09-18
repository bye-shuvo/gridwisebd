import React from 'react';
import { Quote, Sparkles, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

interface PlanSummaryQuoteProps {
  summary: string;
  scenarioId: string;
  computationTimeMs?: number;
}

export const PlanSummaryQuote: React.FC<PlanSummaryQuoteProps> = ({
  summary,
  scenarioId,
  computationTimeMs,
}) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 16 },
        show: { opacity: 1, y: 0 },
      }}
      className="glass-card rounded-2xl p-6 border-l-4 border-l-cyan-500 border border-slate-800/90 relative overflow-hidden shadow-xl"
    >
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/15 flex items-center justify-center text-cyan-400">
            <Quote className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold tracking-wider uppercase bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Executive Optimization Strategy
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono-code bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1.5">
            <Cpu className="w-3 h-3 text-cyan-400" />
            {scenarioId}
          </span>
          {computationTimeMs != null && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-code bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              {computationTimeMs}ms
            </span>
          )}
        </div>
      </div>

      <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal italic">
        "{summary}"
      </p>
    </motion.div>
  );
};
