import React, { useEffect, useState } from 'react';
import { useMicrogridStore } from '@/store/useMicrogridStore';
import { Zap, Activity, RefreshCw, Server, CheckCircle2, XCircle } from 'lucide-react';
import { API_BASE_URL } from '@/services/api';

export const Header: React.FC = () => {
  const { health, checkHealthStatus } = useMicrogridStore();
  const [showHealthTooltip, setShowHealthTooltip] = useState(false);

  useEffect(() => {
    // Silently check health on app load
    checkHealthStatus();

    // Poll every 30s
    const interval = setInterval(() => {
      checkHealthStatus();
    }, 30000);

    return () => clearInterval(interval);
  }, [checkHealthStatus]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#070b14]/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="relative group flex items-center justify-center">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-amber-500 rounded-xl blur-sm opacity-70 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative w-10 h-10 rounded-xl bg-slate-900 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-inner">
              <Zap className="w-5 h-5 animate-pulse text-cyan-400 fill-cyan-400/20" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                GridWise
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Microgrid OS
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              24-Hour Energy Dispatch & Battery Storage Optimization
            </p>
          </div>
        </div>

        {/* Health Telemetry & Status Indicator */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowHealthTooltip(!showHealthTooltip)}
              onMouseEnter={() => setShowHealthTooltip(true)}
              onMouseLeave={() => setShowHealthTooltip(false)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-full glass-card border border-slate-700/60 hover:border-slate-600 transition cursor-pointer"
              title="Click to view API Server telemetry"
            >
              {/* Status Dot with pulse ring */}
              <span className="relative flex h-2.5 w-2.5">
                {health.isHealthy ? (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-sm shadow-emerald-500/50"></span>
                  </>
                ) : (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500 shadow-sm shadow-rose-500/50"></span>
                  </>
                )}
              </span>

              <span className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden md:inline">API</span>
                {health.isHealthy ? (
                  <span className="text-emerald-400 font-mono-code text-[11px]">
                    Online ({health.latencyMs}ms)
                  </span>
                ) : (
                  <span className="text-rose-400 font-mono-code text-[11px]">
                    {health.isChecking ? 'Connecting...' : 'Offline'}
                  </span>
                )}
              </span>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  checkHealthStatus();
                }}
                className="text-slate-400 hover:text-white transition p-0.5"
                title="Refresh API Health"
              >
                <RefreshCw className={`w-3 h-3 ${health.isChecking ? 'animate-spin text-cyan-400' : ''}`} />
              </button>
            </button>

            {/* Tooltip Card */}
            {showHealthTooltip && (
              <div className="absolute right-0 mt-2 w-72 p-3.5 rounded-xl glass-panel border border-slate-700 shadow-2xl z-50 text-left animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between border-b border-slate-700/60 pb-2 mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
                    <Activity className="w-3.5 h-3.5 text-cyan-400" />
                    Endpoint Health Telemetry
                  </div>
                  {health.isHealthy ? (
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-3 h-3" /> Healthy
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] text-rose-400 font-semibold">
                      <XCircle className="w-3 h-3" /> Unreachable
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between text-slate-400">
                    <span>Base Target:</span>
                    <span className="text-slate-200 font-mono-code truncate max-w-[140px]" title={API_BASE_URL}>
                      {API_BASE_URL}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Endpoint:</span>
                    <span className="text-cyan-300 font-mono-code">GET /health</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Roundtrip Ping:</span>
                    <span className="font-mono-code text-slate-200">
                      {health.latencyMs > 0 ? `${health.latencyMs} ms` : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Last Polled:</span>
                    <span className="font-mono-code text-slate-400">
                      {health.lastChecked ? health.lastChecked.toLocaleTimeString() : 'Pending'}
                    </span>
                  </div>
                  {health.errorMessage && !health.isHealthy && (
                    <div className="mt-2 p-2 rounded bg-rose-950/40 border border-rose-900/50 text-[10px] text-rose-300 font-mono-code">
                      {health.errorMessage}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
