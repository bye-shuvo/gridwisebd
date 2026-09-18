import React from 'react';
import type { DirectiveItem } from '@/types/microgrid';
import { CheckCircle2, MinusCircle, Sliders, Info } from 'lucide-react';
import { motion } from 'framer-motion';

interface DirectivesListProps {
  directives: DirectiveItem[];
}

export const DirectivesList: React.FC<DirectivesListProps> = ({ directives }) => {
  if (!directives || directives.length === 0) return null;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 16 },
        show: { opacity: 1, y: 0 },
      }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          Directive Interpretations ({directives.length})
        </h3>
        <span className="text-xs text-slate-400">
          Constraints & operational policy evaluations
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {directives.map((item, idx) => {
          const applies = Boolean(item.applies);
          const adjustments = item.structured_adjustment;
          const hasAdjustments = adjustments && Object.keys(adjustments).length > 0;

          return (
            <div
              key={idx}
              className={`rounded-2xl p-4.5 border transition-all ${
                applies
                  ? 'glass-card border-emerald-500/30 hover:border-emerald-500/50 bg-slate-900/60'
                  : 'glass-card border-slate-800/80 bg-slate-950/40 opacity-75 hover:opacity-100'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between gap-3 mb-2.5">
                <div className="flex items-center gap-2.5">
                  {applies ? (
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 shrink-0">
                      <MinusCircle className="w-4 h-4" />
                    </div>
                  )}

                  <span className="text-xs font-mono-code font-bold tracking-wider text-slate-100 uppercase">
                    {item.directive_type.replace(/_/g, ' ')}
                  </span>
                </div>

                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    applies
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {applies ? 'Applied' : 'No-Op'}
                </span>
              </div>

              {/* Explanation Paragraph */}
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                {item.explanation}
              </p>

              {/* Structured Adjustments Key-Value Pills */}
              {hasAdjustments && (
                <div className="pt-2.5 border-t border-slate-800/80">
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-1.5 uppercase tracking-wider font-semibold">
                    <Info className="w-3 h-3 text-cyan-400" />
                    Structured Parameter Adjustments
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(adjustments).map(([key, val]) => (
                      <div
                        key={key}
                        className="px-2 py-1 rounded bg-black/40 border border-slate-800 text-[11px] font-mono-code flex items-center gap-1.5"
                      >
                        <span className="text-slate-400">{key}:</span>
                        <span className="text-cyan-300 font-semibold">{String(val)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
