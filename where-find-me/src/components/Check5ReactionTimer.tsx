import React, { useState, useRef, useEffect } from 'react';
import { MousePoint, ScoreBreakdown } from '../types';
import { evaluateMouseTrajectory } from '../utils/scoring';
import { sound } from '../utils/audio';
import { Zap, Clock, ShieldCheck, AlertTriangle, Fingerprint, Activity } from 'lucide-react';

interface Check5ReactionTimerProps {
  onComplete: (result: ScoreBreakdown) => void;
}

export const Check5ReactionTimer: React.FC<Check5ReactionTimerProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'STANDBY' | 'TRIGGERED' | 'VERIFYING'>('STANDBY');
  const [reactionTimeMs, setReactionTimeMs] = useState<number | null>(null);
  const [firstMovementDetected, setFirstMovementDetected] = useState(false);

  const triggerTimeRef = useRef<number | null>(null);
  const pointsRef = useRef<MousePoint[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const standbyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    pointsRef.current = [];
    setReactionTimeMs(null);
    setFirstMovementDetected(false);

    // Random neural anticipation delay: 600ms to 1200ms
    const randomDelay = 700 + Math.random() * 500;
    standbyTimeoutRef.current = setTimeout(() => {
      setPhase('TRIGGERED');
      triggerTimeRef.current = performance.now();
      sound.playPassChime();
    }, randomDelay);

    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();

      if (triggerTimeRef.current && !firstMovementDetected) {
        const delta = Math.max(10, Math.round(now - triggerTimeRef.current));
        setReactionTimeMs(delta);
        setFirstMovementDetected(true);
      }

      pointsRef.current.push({
        x: e.clientX,
        y: e.clientY,
        t: now,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (standbyTimeoutRef.current) clearTimeout(standbyTimeoutRef.current);
    };
  }, [firstMovementDetected]);

  const handleSynapseClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (phase !== 'TRIGGERED') return;
    setPhase('VERIFYING');
    sound.playClick();

    const now = performance.now();
    const clickPoint = { x: e.clientX, y: e.clientY };

    const rect = buttonRef.current?.getBoundingClientRect();
    const targetPoint = rect
      ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
      : clickPoint;

    // Record final click
    pointsRef.current.push({
      x: clickPoint.x,
      y: clickPoint.y,
      t: now,
    });

    const triggerStart = triggerTimeRef.current ?? (now - 350);
    const result = evaluateMouseTrajectory(
      pointsRef.current,
      targetPoint,
      clickPoint,
      5,
      triggerStart
    );

    setTimeout(() => {
      if (result.passed) {
        sound.playPassChime();
      } else {
        sound.playFailBuzz();
      }
      onComplete(result);
    }, 450);
  };

  return (
    <div className="relative mx-auto w-full max-w-xl px-4 py-4 select-none animate-in fade-in zoom-in-95 duration-200">
      {/* Specimen Card */}
      <div className="relative rounded-2xl bg-slate-900/95 p-6 sm:p-8 text-white border-2 border-slate-700/80 shadow-2xl backdrop-blur-xl">
        <div className="corner-bracket-tl" />
        <div className="corner-bracket-tr" />
        <div className="corner-bracket-bl" />
        <div className="corner-bracket-br" />

        {/* Tactical Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5">
          <div className="flex items-center gap-2">
            <span className="rounded bg-cyan-950 border border-cyan-500/60 px-2 py-0.5 font-mono text-[11px] font-bold text-cyan-300">
              CHECK 05 // GATE 05
            </span>
            <span className="text-xs font-mono font-bold text-slate-300 tracking-wide">
              WHY IS REACTION TIMER WORTH 20 POINTS
            </span>
          </div>
          <span className="text-[10px] font-mono text-cyan-400 font-bold bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
            FINAL GATE: 5.0s
          </span>
        </div>

        {/* Protocol Instruction Description */}
        <div className="mb-4 text-left">
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
            Neuromuscular Synaptic Latency Challenge
          </h2>
          <p className="mt-1 text-xs text-slate-300 leading-relaxed">
            Bots react instantaneously (&lt; 50 ms) without biological conduction delay. True humans require 200–500 ms for retinal and synaptic transmission.
          </p>
        </div>

        {/* The 2 Official Scoring Rules Banner */}
        <div className="mb-5 grid grid-cols-2 gap-3 text-center font-mono text-xs">
          <div className="rounded-lg bg-slate-950 p-2.5 border border-rose-500/40">
            <div className="flex items-center justify-between text-rose-400 font-bold text-[11px]">
              <span>MOVING &lt; 50 MS</span>
              <span className="text-rose-500 text-sm font-black">0 PTS</span>
            </div>
            <p className="mt-1 text-[10px] text-slate-400 text-left">
              Instant movement flagged as automated script / bot reflex.
            </p>
          </div>

          <div className="rounded-lg bg-slate-950 p-2.5 border border-emerald-500/40">
            <div className="flex items-center justify-between text-emerald-400 font-bold text-[11px]">
              <span>STARTING 200–500 MS</span>
              <span className="text-emerald-300 text-sm font-black">20 PTS</span>
            </div>
            <p className="mt-1 text-[10px] text-slate-400 text-left">
              Full human score! Certified neural synaptic reflex delay.
            </p>
          </div>
        </div>

        {/* Interactive Neural Stimulus Chamber */}
        <div className="relative h-64 sm:h-72 w-full rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center p-6 overflow-hidden">
          {/* Subtle Grid Backdrop */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b08_1px,transparent_1px),linear-gradient(to_bottom,#1e293b08_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

          {/* Status HUD readout */}
          <div className="absolute top-3 left-4 flex items-center gap-2 font-mono text-[11px]">
            <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="text-slate-400">
              MEASURED LATENCY:{' '}
              <strong className={reactionTimeMs !== null && reactionTimeMs < 50 ? 'text-rose-400' : reactionTimeMs !== null && reactionTimeMs >= 200 && reactionTimeMs <= 500 ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                {reactionTimeMs !== null ? `${reactionTimeMs} ms` : 'AWAITING STIMULUS...'}
              </strong>
            </span>
          </div>

          {phase === 'STANDBY' ? (
            /* Standby State */
            <div className="flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-amber-500/60 flex items-center justify-center animate-spin">
                <Clock className="w-7 h-7 text-amber-400 animate-pulse" />
              </div>
              <div>
                <span className="text-amber-400 font-mono font-bold text-sm tracking-wider uppercase">
                  ARMING SENSORY SIGNAL...
                </span>
                <p className="text-[11px] text-slate-400 font-mono mt-1">
                  Hold cursor steady. Do not move yet.
                </p>
              </div>
            </div>
          ) : (
            /* Triggered / Verifying State */
            <div className="flex flex-col items-center justify-center text-center space-y-4 w-full">
              <div className="flex items-center gap-2 text-cyan-300 font-mono font-black text-xs sm:text-sm tracking-widest uppercase animate-bounce">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>SIGNAL FIRED! REACT & CLICK NODE NOW!</span>
              </div>

              {/* The Synapse Authentication Node */}
              <button
                ref={buttonRef}
                onClick={handleSynapseClick}
                disabled={phase === 'VERIFYING'}
                className="group relative px-6 py-4 rounded-xl bg-cyan-950 border-2 border-cyan-400 hover:bg-cyan-900 active:scale-95 transition-all text-white font-mono font-black text-sm tracking-wider flex items-center gap-3 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] cursor-pointer"
              >
                <div className="w-3 h-3 rounded-full bg-cyan-400 group-hover:bg-white animate-ping" />
                <Fingerprint className="w-5 h-5 text-cyan-300 group-hover:text-white" />
                <span>AUTHENTICATE HUMAN SYNAPSE</span>
              </button>

              {/* Feedback readout below button */}
              <div className="text-[11px] font-mono">
                {reactionTimeMs !== null && reactionTimeMs < 50 ? (
                  <span className="text-rose-400 font-bold">
                    [0/20 PTS] Moving in {reactionTimeMs} ms is under 50 ms (bot detected!).
                  </span>
                ) : reactionTimeMs !== null && reactionTimeMs >= 200 && reactionTimeMs <= 500 ? (
                  <span className="text-emerald-300 font-bold">
                    [20/20 PTS] Full points! Perfect human reaction window ({reactionTimeMs} ms).
                  </span>
                ) : reactionTimeMs !== null ? (
                  <span className="text-amber-300">
                    Reaction recorded at {reactionTimeMs} ms. Click to finalize!
                  </span>
                ) : (
                  <span className="text-slate-400">
                    Move cursor toward node to record reaction delay.
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Prompt */}
        <div className="mt-4 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>Remember: Straight fast moves score &lt; 30.</span>
          <span className="text-cyan-400">Maintain biological tremor!</span>
        </div>
      </div>
    </div>
  );
};
