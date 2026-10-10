import React, { useEffect } from 'react';
import { RotateCcw, Ban, Terminal, AlertTriangle } from 'lucide-react';
import { sound } from '../utils/audio';
import { Logo } from './Logo';

interface AccessDeniedProps {
  onRestart: () => void;
  failedGateIndex: number;
}

export const AccessDenied: React.FC<AccessDeniedProps> = ({
  onRestart,
  failedGateIndex,
}) => {
  useEffect(() => {
    sound.playLifeLost();
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-xl px-4 py-6 select-none animate-in fade-in zoom-in-95 duration-200">
      {/* Incident Report Card */}
      <div className="relative rounded-2xl bg-slate-900/95 p-6 sm:p-9 text-white border-2 border-rose-600/80 shadow-2xl backdrop-blur-xl">
        <div className="corner-bracket-tl" />
        <div className="corner-bracket-tr" />
        <div className="corner-bracket-bl" />
        <div className="corner-bracket-br" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
          <Logo size="md" showWordmark={true} />
          <div className="flex items-center gap-1.5 rounded-full bg-rose-950/80 border border-rose-500/60 px-3 py-1 text-xs font-mono font-bold text-rose-300">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>BREACH LOGGED</span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center my-4">
          <span className="font-mono text-xs font-bold tracking-widest text-rose-400 uppercase">
            NEUROMUSCULAR REJECTION REPORT
          </span>
          <h2 className="mt-1 text-3xl sm:text-4xl font-black tracking-tight text-white uppercase font-sans">
            Access Denied
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
            All 3 attempt tokens depleted at{' '}
            <strong className="text-white underline font-bold">Gate {failedGateIndex}</strong>. Trajectory was flagged as automated macro or artificial neural calculation.
          </p>
        </div>

        {/* Terminal readout */}
        <div className="mt-5 rounded-xl bg-black/90 p-4 border border-rose-950 font-mono text-xs text-rose-300 space-y-1.5 shadow-inner">
          <div className="flex items-center gap-1.5 text-rose-400 border-b border-rose-950 pb-1.5 font-bold">
            <Terminal className="w-3.5 h-3.5" />
            <span>DISQUALIFICATION DIAGNOSTICS</span>
          </div>
          <p>LOG_01: Linear Euclidean vectors detected (score &lt; 30 pts).</p>
          <p>LOG_02: Muscle tremor variance below organic baseline.</p>
          <p>LOG_03: Instantaneous or calculated arrival timestamps.</p>
          <p className="text-white font-bold pt-1">
            CONCLUSION: Subject identified as synthetic robot or over-optimized macro.
          </p>
        </div>

        {/* Action Button */}
        <div className="mt-7 text-center">
          <button
            onClick={() => {
              sound.playClick();
              onRestart();
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-rose-700 hover:bg-rose-600 px-7 py-3 text-sm font-bold text-white shadow-lg transition-all active:scale-95 cursor-pointer font-mono border border-rose-500/50"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset 3 Lives & Retry Test</span>
          </button>
        </div>
      </div>
    </div>
  );
};
