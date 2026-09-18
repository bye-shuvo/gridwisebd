import React from 'react';
import { useMicrogridStore } from '@/store/useMicrogridStore';
import { Header } from '@/components/common/Header';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { InputTabs } from '@/components/input/InputTabs';
import { LoadingSkeleton } from '@/components/loading/LoadingSkeleton';
import { ResultsContainer } from '@/components/results/ResultsContainer';
import { EmptyState } from '@/components/empty/EmptyState';
import { Toaster } from 'react-hot-toast';
import { Zap, ShieldCheck, BatteryCharging, ArrowDownUp } from 'lucide-react';
import { API_BASE_URL } from '@/services/api';

const AppContent: React.FC = () => {
  const { results, isSubmitting, clearResults } = useMicrogridStore();

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 circuit-bg flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Toast Notification Container */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4500,
          style: {
            background: '#0d1424',
            color: '#f8fafc',
            border: '1px solid rgba(56, 189, 248, 0.2)',
            borderRadius: '12px',
            fontSize: '13px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#070b14',
            },
          },
          error: {
            iconTheme: {
              primary: '#f43f5e',
              secondary: '#070b14',
            },
            style: {
              border: '1px solid rgba(244, 63, 94, 0.4)',
              background: '#180a0e',
            },
          },
        }}
      />

      {/* Main Header with /health indicator */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Top Hero Banner */}
        <section className="relative overflow-hidden rounded-3xl p-6 sm:p-8 glass-panel border border-slate-800/80 shadow-2xl">
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>Linear Programming Dispatch Optimizer</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Intelligent Microgrid Energy Scheduling
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Seamlessly dispatch battery energy storage, maximize local photovoltaic self-consumption,
                and shave peak utility tariff charges across 24-hour microgrid operations.
              </p>
            </div>

            {/* Microgrid Quick Stats Chips */}
            <div className="flex flex-row md:flex-col gap-2 shrink-0">
              <div className="px-3.5 py-2 rounded-xl glass-card border border-slate-800 flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <div className="text-left">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider">Validation</div>
                  <div className="text-xs font-bold text-slate-200">Ajv Client-Side</div>
                </div>
              </div>

              <div className="px-3.5 py-2 rounded-xl glass-card border border-slate-800 flex items-center gap-2.5">
                <ArrowDownUp className="w-4 h-4 text-amber-400" />
                <div className="text-left">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider">Tariff Logic</div>
                  <div className="text-xs font-bold text-slate-200">Peak Arbitrage</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Input Modes Section (Raw JSON & File Upload) */}
        <InputTabs />

        {/* Loading Progress State */}
        {isSubmitting && <LoadingSkeleton />}

        {/* Results Visual Analytics */}
        {results && !isSubmitting && (
          <ResultsContainer results={results} onReset={clearResults} />
        )}

        {/* Empty State before first run */}
        {!results && !isSubmitting && <EmptyState />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/60 py-6 text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">GridWise UI</span>
            <span>•</span>
            <span>Microgrid Energy Optimization System</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-mono-code text-[11px] text-slate-400">
              Target API: {API_BASE_URL}
            </span>
            <span>•</span>
            <span className="text-cyan-400">React 19 + Vite + TypeScript</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}

export default App;
