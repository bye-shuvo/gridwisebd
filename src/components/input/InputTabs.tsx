import React from 'react';
import { useMicrogridStore } from '@/store/useMicrogridStore';
import { JsonEditor } from './JsonEditor';
import { FileUpload } from './FileUpload';
import { ValidationErrors } from './ValidationErrors';
import { ServerErrors } from './ServerErrors';
import { Code2, UploadCloud, Play, Sparkles, Database, CheckSquare } from 'lucide-react';
import { sampleMicrogridScenario, sampleAlternativeScenario } from '@/data/sampleScenario';

export const InputTabs: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    loadPreset,
    validateCurrentJson,
    submitOptimization,
    isSubmitting,
    validationErrors,
  } = useMicrogridStore();

  const handleValidateClick = () => {
    validateCurrentJson(true);
  };

  const handleRunSubmit = () => {
    submitOptimization(false);
  };

  const handleSimulateSubmit = () => {
    submitOptimization(true);
  };

  const hasValidationErrors = validationErrors.length > 0;

  return (
    <section className="glass-panel rounded-2xl p-4 sm:p-6 border border-slate-800 shadow-xl space-y-5">
      {/* Top Header Controls: Mode Tabs & Preset Loader */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        {/* Toggle / Tabs */}
        <div className="flex items-center p-1 bg-slate-900/90 rounded-xl border border-slate-800/80 w-fit">
          <button
            type="button"
            onClick={() => setActiveTab('editor')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'editor'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-900/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            Raw JSON Textarea
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-900/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            File Upload (.json)
          </button>
        </div>

        {/* Quick Sample Presets */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            Presets:
          </span>
          <button
            type="button"
            onClick={() => loadPreset(sampleMicrogridScenario)}
            className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 border border-slate-700/60 transition cursor-pointer"
            title="Load standard 24h benchmark microgrid scenario"
          >
            Benchmark 01
          </button>
          <button
            type="button"
            onClick={() => loadPreset(sampleAlternativeScenario)}
            className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-300 border border-slate-700/60 transition cursor-pointer"
            title="Load high industrial demand microgrid scenario"
          >
            High Demand 02
          </button>
        </div>
      </div>

      {/* Main Mode View */}
      {activeTab === 'editor' ? <JsonEditor /> : <FileUpload />}

      {/* Inline Schema Validation Errors Panel */}
      <ValidationErrors />

      {/* Server Error Alerts & Retry */}
      <ServerErrors />

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleValidateClick}
            disabled={isSubmitting}
            className="px-3.5 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 flex items-center justify-center gap-1.5 transition cursor-pointer disabled:opacity-50"
          >
            <CheckSquare className="w-4 h-4 text-cyan-400" />
            Check Schema (Ajv)
          </button>

          <button
            type="button"
            onClick={handleSimulateSubmit}
            disabled={isSubmitting || hasValidationErrors}
            className="px-3.5 py-2 rounded-xl text-xs font-medium bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center gap-1.5 transition cursor-pointer disabled:opacity-40"
            title="Compute optimization locally using realistic microgrid simulation engine"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Demo Simulation
          </button>
        </div>

        <button
          type="button"
          onClick={handleRunSubmit}
          disabled={isSubmitting || hasValidationErrors}
          className={`px-6 py-2.5 rounded-xl font-semibold text-xs tracking-wide flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer ${
            hasValidationErrors || isSubmitting
              ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
              : 'bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-500 hover:from-cyan-400 hover:to-blue-500 text-white shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.99]'
          }`}
        >
          <Play className={`w-4 h-4 fill-current ${isSubmitting ? 'animate-spin' : ''}`} />
          {isSubmitting ? 'Running Optimization Engine...' : 'POST /optimize-energy'}
        </button>
      </div>
    </section>
  );
};
