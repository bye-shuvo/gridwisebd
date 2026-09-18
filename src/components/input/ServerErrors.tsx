import React from 'react';
import { useMicrogridStore } from '@/store/useMicrogridStore';
import { AlertTriangle, WifiOff, RotateCcw, ServerCrash } from 'lucide-react';

export const ServerErrors: React.FC = () => {
  const { serverError, submitOptimization, clearErrors } = useMicrogridStore();

  if (!serverError) return null;

  const isValidation = serverError.status === 400 || serverError.status === 422;
  const isServer = serverError.status && serverError.status >= 500;
  const isNetwork = serverError.type === 'NETWORK_ERROR' || serverError.type === 'TIMEOUT';

  const borderColor = isValidation
    ? 'border-amber-500/40 bg-amber-950/20'
    : 'border-rose-500/40 bg-rose-950/20';

  const iconColor = isValidation ? 'text-amber-400' : 'text-rose-400';

  return (
    <div className={`rounded-xl border ${borderColor} backdrop-blur-md p-4 my-4 animate-in fade-in duration-200`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-0.5">
            {isNetwork ? (
              <WifiOff className={`w-5 h-5 ${iconColor}`} />
            ) : isServer ? (
              <ServerCrash className={`w-5 h-5 ${iconColor}`} />
            ) : (
              <AlertTriangle className={`w-5 h-5 ${iconColor}`} />
            )}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              {isValidation && `Server Rejected Request (${serverError.status})`}
              {isServer && `Server Error (${serverError.status || 500})`}
              {isNetwork && 'Connection Failed / Request Timeout'}
              {!isValidation && !isServer && !isNetwork && 'API Error'}
            </h4>
            <p className="text-xs text-slate-300 mt-1">
              {serverError.message}
            </p>

            {serverError.detail != null && (
              <div className="mt-2.5 p-2.5 rounded bg-black/50 border border-slate-800 text-[11px] font-mono-code text-slate-300 max-h-36 overflow-y-auto">
                <pre>{typeof serverError.detail === 'string' ? serverError.detail : JSON.stringify(serverError.detail, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {(isServer || isNetwork) && (
            <button
              type="button"
              onClick={() => submitOptimization(false)}
              className="px-3 py-1.5 rounded-lg bg-rose-600/80 hover:bg-rose-500 text-white text-xs font-medium flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-rose-900/40"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Retry POST
            </button>
          )}

          <button
            type="button"
            onClick={clearErrors}
            className="px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs transition cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
