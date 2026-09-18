import React, { useRef, useState, useEffect } from 'react';
import { useMicrogridStore } from '@/store/useMicrogridStore';
import { Check, Copy, Wand2, Sparkles, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const JsonEditor: React.FC = () => {
  const { rawJson, setRawJson, validateCurrentJson, validationErrors } = useMicrogridStore();
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  const lineCount = rawJson.split('\n').length;
  const lineNumbers = Array.from({ length: Math.max(lineCount, 1) }, (_, i) => i + 1);

  // Sync scrolling between line numbers and textarea
  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const handleBlur = () => {
    validateCurrentJson(false);
  };

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(rawJson);
      const formatted = JSON.stringify(parsed, null, 2);
      setRawJson(formatted);
      validateCurrentJson(false);
      toast.success('JSON formatted cleanly');
    } catch {
      toast.error('Cannot format invalid JSON');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(rawJson);
    setCopied(true);
    toast.success('Copied payload to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;

      const newValue = rawJson.substring(0, start) + '  ' + rawJson.substring(end);
      setRawJson(newValue);

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  const hasErrors = validationErrors.length > 0;

  return (
    <div className="relative rounded-2xl glass-card overflow-hidden border border-slate-800 focus-within:border-cyan-500/50 transition-colors">
      {/* Editor Top Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-mono-code text-slate-300 font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            payload.json
          </span>
          <span className="text-[11px] text-slate-500 font-mono-code hidden sm:inline">
            {lineCount} lines • {(rawJson.length / 1024).toFixed(1)} KB
          </span>
          {hasErrors ? (
            <span className="inline-flex items-center gap-1 text-[11px] text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
              <AlertCircle className="w-3 h-3" /> {validationErrors.length} Schema Issue(s)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              <Sparkles className="w-3 h-3" /> Valid Schema
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleFormat}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer text-[11px]"
            title="Auto-format and indent JSON"
          >
            <Wand2 className="w-3 h-3 text-cyan-400" />
            Format
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer text-[11px]"
            title="Copy JSON to clipboard"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Code Area with Line Numbers */}
      <div className="relative flex bg-[#090d18] min-h-[380px] max-h-[500px]">
        {/* Line Numbers Gutter */}
        <div
          ref={lineNumbersRef}
          aria-hidden="true"
          className="select-none py-3 px-3 text-right font-mono-code text-xs text-slate-600 bg-slate-950/70 border-r border-slate-800/80 overflow-hidden shrink-0 w-12"
        >
          {lineNumbers.map((num) => (
            <div key={num} className="leading-6">
              {num}
            </div>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={rawJson}
          onChange={(e) => setRawJson(e.target.value)}
          onScroll={handleScroll}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          className="w-full flex-1 p-3 bg-transparent font-mono-code text-xs text-slate-200 resize-y focus:outline-none leading-6 whitespace-pre overflow-auto"
          placeholder="Paste or edit scenario JSON here..."
          rows={16}
        />
      </div>

      {/* Editor Footer Help */}
      <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
        <span>Tab key inserts 2 spaces • Validates automatically on blur</span>
        <button
          type="button"
          onClick={() => validateCurrentJson(true)}
          className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition cursor-pointer"
        >
          Run Schema Check Now
        </button>
      </div>
    </div>
  );
};
