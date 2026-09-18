import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useMicrogridStore } from '@/store/useMicrogridStore';
import { UploadCloud, FileJson, CheckCircle2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const FileUpload: React.FC = () => {
  const { loadJsonFile, activeFileName, parsedPayload, validationErrors } = useMicrogridStore();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      if (!file.name.endsWith('.json') && file.type !== 'application/json') {
        toast.error('Only .json files are accepted', { icon: '⚠️' });
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        try {
          const content = reader.result as string;
          loadJsonFile(content, file.name);
        } catch {
          toast.error('Failed to read file content');
        }
      };
      reader.onerror = () => {
        toast.error('Error reading file from disk');
      };
      reader.readAsText(file);
    },
    [loadJsonFile]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/json': ['.json'],
    },
    maxFiles: 1,
    multiple: false,
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 glass-card ${
          isDragActive
            ? 'border-cyan-400 bg-cyan-950/30 scale-[1.01]'
            : isDragReject
            ? 'border-rose-500 bg-rose-950/30'
            : 'border-slate-700/80 hover:border-cyan-500/50 hover:bg-slate-900/40'
        }`}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shadow-inner group-hover:scale-110 transition">
            <UploadCloud className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-base font-semibold text-white">
              {isDragActive
                ? 'Drop the microgrid JSON file here...'
                : 'Drag & drop your scenario .json file'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              or <span className="text-cyan-400 font-medium underline underline-offset-2">browse from your computer</span>
            </p>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-800">
            <FileJson className="w-3.5 h-3.5 text-amber-400" />
            <span>Strict format: 24-hour microgrid JSON schema (.json)</span>
          </div>
        </div>
      </div>

      {/* Active File Loaded Info */}
      {activeFileName && (
        <div className="glass-card rounded-xl p-4 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <FileJson className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white">{activeFileName}</span>
                {validationErrors.length === 0 ? (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Validated
                  </span>
                ) : (
                  <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Errors
                  </span>
                )}
              </div>
              {parsedPayload && (
                <p className="text-xs text-slate-400 mt-0.5">
                  Scenario: <span className="text-slate-200 font-mono-code">{parsedPayload.scenario_id}</span> • Battery: {parsedPayload.battery?.capacity_kwh} kWh • {parsedPayload.hours?.length} Hours
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              const inputElement = document.querySelector('input[type="file"]') as HTMLInputElement;
              inputElement?.click();
            }}
            className="text-xs text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition cursor-pointer"
          >
            Replace File
          </button>
        </div>
      )}
    </div>
  );
};
