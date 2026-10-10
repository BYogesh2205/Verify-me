import React, { useState } from 'react';
import { Play, Heart, Sparkles, Activity, ShieldCheck, Zap, Fingerprint } from 'lucide-react';
import { sound } from '../utils/audio';
import { Logo } from './Logo';

interface StartScreenProps {
  onStart: () => void;
  lives: number;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart, lives }) => {
  const [practiceSpeed, setPracticeSpeed] = useState(0);
  const [practiceJitter, setPracticeJitter] = useState(0);
  const [practiceCurvature, setPracticeCurvature] = useState(1.0);

  const handlePracticeMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const speed = Math.min(2.5, Math.hypot(e.movementX, e.movementY) / 9);
    setPracticeSpeed(Number(speed.toFixed(2)));
    const jitter = Math.random() * 0.45 + (speed > 0.8 ? 0.05 : 0.28);
    setPracticeJitter(Math.round(jitter * 100));
    setPracticeCurvature(Number((1.0 + Math.random() * 0.7).toFixed(2)));
  };

  return (
    <div className="relative mx-auto w-full max-w-2xl px-4 py-4 select-none animate-in fade-in zoom-in-95 duration-200">
      {/* Tactile Laboratory Specimen Card */}
      <div className="relative rounded-2xl bg-slate-900/95 p-6 sm:p-9 text-slate-100 border border-slate-700/80 shadow-2xl backdrop-blur-xl">
        {/* Tactical Corner Brackets */}
        <div className="corner-bracket-tl" />
        <div className="corner-bracket-tr" />
        <div className="corner-bracket-bl" />
        <div className="corner-bracket-br" />

        {/* Bureau Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-6 text-[10px] font-mono text-slate-400">
          <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
            <Fingerprint className="w-3.5 h-3.5" />
            DEPARTMENT OF MOTOR ENTROPY // DOC-REV-88
          </span>
          <span className="text-slate-500 hidden sm:inline">
            STANDARD SPECIMEN PROTOCOL
          </span>
        </div>

        {/* Logo and Game Title */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-6">
          <Logo size="xl" showWordmark={false} className="shrink-0" />
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white uppercase font-sans">
                Verify<span className="text-cyan-400 cyan-text-glow">Me</span>
              </h1>
              <span className="rounded bg-cyan-950 border border-cyan-500/50 px-2 py-0.5 text-[10px] font-mono font-bold text-cyan-300">
                OFFICIAL
              </span>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-md leading-relaxed">
              Modern CAPTCHAs test if you are a machine. Here, precision algorithms will fail you. You must prove your{' '}
              <strong className="text-cyan-300 font-bold underline">chaotic biological humanity</strong>.
            </p>
          </div>
        </div>

        {/* The Two Golden Rules Cards & 20-Point Biometric Checks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="relative rounded-xl bg-slate-950 p-4 border border-rose-500/30">
            <div className="flex items-center justify-between text-rose-400 font-mono text-xs font-bold">
              <span>SYNTHETIC TRAJECTORY</span>
              <span className="text-rose-500 font-bold">&lt; 30 PTS</span>
            </div>
            <p className="mt-2 text-xs text-slate-300 leading-snug">
              A fast right/straight move <strong className="text-rose-400 font-bold underline">MUST score under 30</strong>.
            </p>
            <div className="mt-2.5 pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-400 space-y-1">
              <p>• <strong className="text-rose-400">Click Spot Check (20 pts):</strong> Exact center gets <strong className="text-white">0 pts</strong>. Little off-center gets <strong className="text-white">1 pt</strong>.</p>
              <p>• <strong className="text-rose-400">Reaction Timer (20 pts):</strong> Moving in &lt; 50 ms gets <strong className="text-white">0 pts</strong> (bot speed).</p>
            </div>
          </div>

          <div className="relative rounded-xl bg-slate-950 p-4 border border-cyan-500/40">
            <div className="flex items-center justify-between text-cyan-400 font-mono text-xs font-bold">
              <span>ORGANIC TRAJECTORY</span>
              <span className="text-cyan-300 font-bold">&gt; 70 PTS</span>
            </div>
            <p className="mt-2 text-xs text-slate-300 leading-snug">
              A slow messy or curved move <strong className="text-cyan-300 font-bold underline">MUST score above 70</strong>.
            </p>
            <div className="mt-2.5 pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-400 space-y-1">
              <p>• <strong className="text-cyan-400">Natural Offset:</strong> Landing slightly off-center scores up to <strong className="text-white">20/20 pts</strong>.</p>
              <p>• <strong className="text-cyan-400">Neural Latency:</strong> Starting between 200–500 ms gets <strong className="text-white">full 20/20 pts</strong>.</p>
            </div>
          </div>
        </div>

        {/* Live Calibration Sandbox Pad */}
        <div
          onMouseMove={handlePracticeMove}
          className="mt-5 rounded-xl bg-slate-950 border border-slate-800 p-3.5 select-none hover:border-cyan-500/50 transition-colors cursor-crosshair"
        >
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
              <Activity className="w-3.5 h-3.5" />
              Live Pre-Test Calibration Sensor
            </span>
            <span className="text-slate-500">Wiggle cursor here to inspect metrics</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center font-mono">
            <div className="rounded bg-slate-900/80 p-2 border border-slate-800">
              <span className="text-[10px] text-slate-400">Velocity</span>
              <div className="text-sm font-bold text-white mt-0.5 tabular-nums">
                {practiceSpeed} <span className="text-[9px] text-slate-500">px/ms</span>
              </div>
            </div>
            <div className="rounded bg-slate-900/80 p-2 border border-slate-800">
              <span className="text-[10px] text-slate-400">Hand Tremor</span>
              <div className="text-sm font-bold text-cyan-400 mt-0.5 tabular-nums">
                {practiceJitter}%
              </div>
            </div>
            <div className="rounded bg-slate-900/80 p-2 border border-slate-800">
              <span className="text-[10px] text-slate-400">Path Curvature</span>
              <div className="text-sm font-bold text-emerald-400 mt-0.5 tabular-nums">
                {practiceCurvature}x
              </div>
            </div>
          </div>
        </div>

        {/* Sequence Docket Footer (All 5 Gates) */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-1 px-1 text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-1 text-slate-300">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            {lives} Lives Allocated
          </span>
          <span className="text-slate-600">·</span>
          <span>01. Box (18s)</span>
          <span className="text-slate-600">·</span>
          <span>02. Puzzle (13s)</span>
          <span className="text-slate-600">·</span>
          <span>03. Traffic (9s)</span>
          <span className="text-slate-600">·</span>
          <span className="text-cyan-400 font-bold">04. Spot (7s)</span>
          <span className="text-slate-600">·</span>
          <span className="text-cyan-400 font-bold">05. Reaction (5s)</span>
        </div>

        {/* Start Button */}
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              sound.playClick();
              onStart();
            }}
            className="group relative inline-flex items-center gap-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 px-8 py-3.5 text-sm sm:text-base font-extrabold text-slate-950 uppercase tracking-wider font-mono shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-slate-950 transition-transform group-hover:translate-x-0.5" />
            <span>Begin Test Protocol</span>
            <Zap className="w-4 h-4 text-slate-950 opacity-70" />
          </button>
        </div>
      </div>
    </div>
  );
};
