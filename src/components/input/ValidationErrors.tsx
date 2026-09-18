import React from 'react';
import { useMicrogridStore } from '@/store/useMicrogridStore';
import { AlertCircle, XCircle, ShieldAlert, CornerDownRight } from 'lucide-react';

export const ValidationErrors: React.FC = () => {
  const { validationErrors, clearErrors } = useMicrogridStore();

  if (validationErrors.length === 0) return null;

  return (
    <div className="rounded-xl border border-rose-500/40 bg-rose-950/20 backdrop-blur-md p-4 my-4 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex items-center justify-between pb-3 border-b border-rose-500/20">
        <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm">
          <ShieldAlert className="w-5 h-5 text-rose-400" />
          <span>Client Schema Validation Failed ({validationErrors.length} issues)</span>
        </div>
        <button
          type="button"
          onClick={clearErrors}
          className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition cursor-pointer"
        >
          <XCircle className="w-4 h-4" />
          Dismiss
        </button>
      </div>

      <p className="text-xs text-rose-300/80 mt-2 mb-3">
        Submission blocked. All fields must satisfy the microgrid optimization schema constraints before sending to API:
      </p>

      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
        {validationErrors.map((err, idx) => (
          <div
            key={idx}
            className="flex items-start gap-2.5 p-2.5 rounded-lg bg-black/40 border border-rose-900/40 text-xs"
          >
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono-code text-[11px] font-medium border border-rose-500/30">
                  {err.path || 'root'}
                </span>
                {err.keyword && (
                  <span className="text-[10px] text-slate-400 font-mono-code">
                    rule: {err.keyword}
                  </span>
                )}
              </div>
              <div className="text-slate-200 mt-1 flex items-center gap-1.5">
                <CornerDownRight className="w-3.5 h-3.5 text-rose-400/80 shrink-0" />
                <span>{err.message}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
