import React, { useEffect } from 'react';
import { RotateCcw, CheckCircle2, ShieldCheck, Download, Award } from 'lucide-react';
import { sound } from '../utils/audio';
import { Logo } from './Logo';

interface WelcomeHumanProps {
  finalScore: number;
  gateScores: number[];
  onPlayAgain: () => void;
}

export const WelcomeHuman: React.FC<WelcomeHumanProps> = ({
  finalScore,
  gateScores,
  onPlayAgain,
}) => {
  useEffect(() => {
    sound.playVictory();
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-xl px-4 py-6 select-none animate-in fade-in zoom-in-95 duration-200">
      {/* Official Certificate Card */}
      <div className="relative rounded-2xl bg-slate-900/95 p-6 sm:p-9 text-white border-2 border-emerald-500/80 shadow-2xl backdrop-blur-xl">
        <div className="corner-bracket-tl" />
        <div className="corner-bracket-tr" />
        <div className="corner-bracket-bl" />
        <div className="corner-bracket-br" />

        {/* Certificate Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
          <Logo size="md" showWordmark={true} />
          <div className="flex items-center gap-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/60 px-3 py-1 text-xs font-mono font-bold text-emerald-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>CERTIFIED HUMAN</span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center my-4">
          <span className="font-mono text-xs font-bold tracking-widest text-emerald-400 uppercase">
            REVERSE TURING PROTOCOL CLEARED
          </span>
          <h2 className="mt-1 text-3xl sm:text-4xl font-black tracking-tight text-white uppercase font-sans">
            Welcome, Human.
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
            Your motor trajectories demonstrated exquisite organic instability, muscle lag, and irregular curvatures.
          </p>
        </div>

        {/* Official Score Plaque */}
        <div className="mt-6 flex flex-col items-center justify-center rounded-xl bg-slate-950 p-5 border border-emerald-500/30 shadow-inner">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
            Overall Human Biological Quotient
          </span>
          <div className="my-1 flex items-baseline justify-center">
            <span className="text-5xl sm:text-6xl font-black text-emerald-300 tabular-nums">
              {finalScore}
            </span>
            <span className="text-xl font-bold text-slate-500 ml-1.5">/ 100</span>
          </div>
          <p className="text-xs text-emerald-400/90 font-medium font-mono">
            STATUS: 100% ORGANIC FLESH-VESSEL VERIFIED
          </p>
        </div>

        {/* All 5 Gate Score Badges */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono">
          <div className="rounded-lg bg-slate-950 p-2 border border-slate-800 text-center">
            <span className="text-[9px] text-slate-400 uppercase">01. Box</span>
            <div className="text-sm font-bold text-white mt-0.5">
              {gateScores[0] ?? 82}%
            </div>
            <span className="text-[9px] text-emerald-400 font-bold">Passed</span>
          </div>

          <div className="rounded-lg bg-slate-950 p-2 border border-slate-800 text-center">
            <span className="text-[9px] text-slate-400 uppercase">02. Puzzle</span>
            <div className="text-sm font-bold text-white mt-0.5">
              {gateScores[1] ?? 88}%
            </div>
            <span className="text-[9px] text-emerald-400 font-bold">Passed</span>
          </div>

          <div className="rounded-lg bg-slate-950 p-2 border border-slate-800 text-center">
            <span className="text-[9px] text-slate-400 uppercase">03. Traffic</span>
            <div className="text-sm font-bold text-white mt-0.5">
              {gateScores[2] ?? 79}%
            </div>
            <span className="text-[9px] text-emerald-400 font-bold">Passed</span>
          </div>

          <div className="rounded-lg bg-slate-950 p-2 border border-cyan-500/40 text-center">
            <span className="text-[9px] text-cyan-300 uppercase">04. Spot</span>
            <div className="text-sm font-bold text-cyan-300 mt-0.5">
              {gateScores[3] ?? 85}%
            </div>
            <span className="text-[9px] text-emerald-400 font-bold">20 Pts Rule</span>
          </div>

          <div className="col-span-2 sm:col-span-1 rounded-lg bg-slate-950 p-2 border border-cyan-500/40 text-center">
            <span className="text-[9px] text-cyan-300 uppercase">05. Reflex</span>
            <div className="text-sm font-bold text-cyan-300 mt-0.5">
              {gateScores[4] ?? 91}%
            </div>
            <span className="text-[9px] text-emerald-400 font-bold">20 Pts Rule</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-7 text-center">
          <button
            onClick={() => {
              sound.playClick();
              onPlayAgain();
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-7 py-3 text-sm font-bold text-white shadow-lg transition-all active:scale-95 cursor-pointer font-mono"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Test Again</span>
          </button>
        </div>
      </div>
    </div>
  );
};
