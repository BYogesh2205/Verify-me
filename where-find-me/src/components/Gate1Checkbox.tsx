import React, { useState, useRef, useEffect } from 'react';
import { MousePoint, ScoreBreakdown } from '../types';
import { evaluateMouseTrajectory } from '../utils/scoring';
import { sound } from '../utils/audio';
import { ShieldCheck, Loader2, Crosshair, AlertCircle } from 'lucide-react';

interface Gate1CheckboxProps {
  onComplete: (result: ScoreBreakdown) => void;
  onMovementUpdate?: (pointCount: number) => void;
}

export const Gate1Checkbox: React.FC<Gate1CheckboxProps> = ({
  onComplete,
  onMovementUpdate,
}) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [livePointsCount, setLivePointsCount] = useState(0);
  const checkboxRef = useRef<HTMLButtonElement>(null);
  const gateStartTimeRef = useRef<number>(performance.now());
  const pointsRef = useRef<MousePoint[]>([]);

  useEffect(() => {
    gateStartTimeRef.current = performance.now();
    pointsRef.current = [];
    const handleMove = (e: MouseEvent) => {
      pointsRef.current.push({
        x: e.clientX,
        y: e.clientY,
        t: performance.now(),
      });
      setLivePointsCount(pointsRef.current.length);
      if (onMovementUpdate) {
        onMovementUpdate(pointsRef.current.length);
      }
    };

    window.addEventListener('mousemove', handleMove);
    return () => {
      window.removeEventListener('mousemove', handleMove);
    };
  }, [onMovementUpdate]);

  const handleCheckboxClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isVerifying || isChecked) return;

    sound.playClick();
    setIsVerifying(true);

    const clickPoint = { x: e.clientX, y: e.clientY };
    const rect = checkboxRef.current?.getBoundingClientRect();
    const targetPoint = rect
      ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
      : clickPoint;

    pointsRef.current.push({
      x: clickPoint.x,
      y: clickPoint.y,
      t: performance.now(),
    });

    const recordedPoints = [...pointsRef.current];

    // Authentic verification cycle
    setTimeout(() => {
      setIsVerifying(false);
      setIsChecked(true);

      const result = evaluateMouseTrajectory(
        recordedPoints,
        targetPoint,
        clickPoint,
        1,
        gateStartTimeRef.current
      );

      if (result.passed) {
        sound.playCheckmark();
      } else {
        sound.playWarning();
      }

      setTimeout(() => {
        onComplete(result);
      }, 500);
    }, 650);
  };

  return (
    <div className="relative mx-auto w-full max-w-lg px-4 py-6 select-none animate-in fade-in zoom-in-95 duration-200">
      {/* Light card with cyber styling and cyan accents */}
      <div className="relative rounded-2xl bg-slate-100 p-7 sm:p-8 text-slate-900 border-2 border-slate-300 shadow-2xl cyan-glow">
        {/* Tactical Corner Markers */}
        <div className="pointer-events-none absolute top-2 left-2 h-3 w-3 border-t-2 border-l-2 border-cyan-600" />
        <div className="pointer-events-none absolute top-2 right-2 h-3 w-3 border-t-2 border-r-2 border-cyan-600" />
        <div className="pointer-events-none absolute bottom-2 left-2 h-3 w-3 border-b-2 border-l-2 border-cyan-600" />
        <div className="pointer-events-none absolute bottom-2 right-2 h-3 w-3 border-b-2 border-r-2 border-cyan-600" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-700">
                GATE 01 · MOTOR TURING TEST
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-950 tracking-tight mt-0.5">
              The Checkbox Challenge
            </h2>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-100 border border-cyan-300 text-cyan-700 shadow-sm">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Clear Scoring Rule Reminder */}
        <div className="mb-6 rounded-xl bg-slate-900 p-4 text-xs text-slate-200 border border-slate-800 shadow-inner">
          <div className="flex items-center gap-2 text-cyan-400 font-mono font-bold mb-1.5">
            <Crosshair className="w-3.5 h-3.5" />
            <span>CRITICAL TRAJECTORY RULES</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-[11px]">
            <div className="rounded bg-slate-950/80 p-2 border border-rose-500/30">
              <span className="text-rose-400 font-bold">Fast Right Move:</span>
              <p className="text-slate-300 mt-0.5">Must score &lt; 30 (synthetic machine speed).</p>
            </div>
            <div className="rounded bg-slate-950/80 p-2 border border-cyan-500/30">
              <span className="text-cyan-400 font-bold">Slow Messy Move:</span>
              <p className="text-slate-300 mt-0.5">Must score &gt; 70 (curved organic flesh).</p>
            </div>
          </div>
        </div>

        {/* Authentic reCAPTCHA-style Widget Box with Interactive Feel */}
        <div className="mx-auto flex max-w-xs items-center justify-between rounded-xl bg-white p-5 border-2 border-slate-300 shadow-md transition-all hover:border-cyan-500">
          <div className="flex items-center gap-4">
            <button
              ref={checkboxRef}
              type="button"
              disabled={isVerifying || isChecked}
              onClick={handleCheckboxClick}
              className={`relative flex h-8 w-8 items-center justify-center rounded-lg border-2 transition-all cursor-pointer focus:outline-none ${
                isChecked
                  ? 'border-emerald-500 bg-emerald-50'
                  : isVerifying
                  ? 'border-cyan-500 bg-cyan-50'
                  : 'border-slate-400 bg-white hover:border-cyan-600 hover:shadow-[0_0_8px_rgba(6,182,212,0.4)]'
              }`}
              aria-label="I am not a robot checkbox"
            >
              {isVerifying ? (
                <Loader2 className="h-5 w-5 animate-spin text-cyan-600" />
              ) : isChecked ? (
                <svg
                  className="h-5 w-5 text-emerald-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : null}
            </button>

            <span className="text-sm font-bold text-slate-900 tracking-tight">
              I am not a robot
            </span>
          </div>

          {/* Right Logo Lockup */}
          <div className="flex flex-col items-center justify-center pl-4 border-l border-slate-200">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-50 border border-cyan-200 text-cyan-600 font-mono font-bold text-xs">
              VM
            </div>
            <span className="text-[8px] font-extrabold tracking-tight text-slate-500 mt-0.5">
              Verify Me
            </span>
            <span className="text-[7px] text-slate-400">Security Protocol</span>
          </div>
        </div>

        {/* Active Telemetry Stream Bar */}
        <div className="mt-6 flex items-center justify-between text-xs font-mono text-slate-600 border-t border-slate-200 pt-3">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-cyan-600 animate-ping" />
            Tracking: {livePointsCount} coordinates sampled
          </span>
          <span className="text-cyan-700 font-bold">Wobble to pass!</span>
        </div>
      </div>
    </div>
  );
};
