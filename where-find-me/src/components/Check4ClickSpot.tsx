import React, { useState, useRef, useEffect } from 'react';
import { MousePoint, ScoreBreakdown } from '../types';
import { evaluateMouseTrajectory } from '../utils/scoring';
import { sound } from '../utils/audio';
import { Crosshair, Target, AlertTriangle, CheckCircle, ShieldCheck } from 'lucide-react';

interface Check4ClickSpotProps {
  onComplete: (result: ScoreBreakdown) => void;
}

export const Check4ClickSpot: React.FC<Check4ClickSpotProps> = ({ onComplete }) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [liveOffset, setLiveOffset] = useState<number | null>(null);
  const [clickPos, setClickPos] = useState<{ x: number; y: number } | null>(null);
  const [hoveringTarget, setHoveringTarget] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const gateStartTimeRef = useRef<number>(performance.now());
  const pointsRef = useRef<MousePoint[]>([]);

  useEffect(() => {
    gateStartTimeRef.current = performance.now();
    pointsRef.current = [];

    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      pointsRef.current.push({
        x: e.clientX,
        y: e.clientY,
        t: now,
      });

      if (targetRef.current) {
        const rect = targetRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);
        setLiveOffset(Number(dist.toFixed(1)));
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleTargetClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isVerifying) return;
    setIsVerifying(true);
    sound.playClick();

    const clickPoint = { x: e.clientX, y: e.clientY };
    setClickPos(clickPoint);

    const rect = targetRef.current?.getBoundingClientRect();
    const targetPoint = rect
      ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
      : clickPoint;

    // Record the final click coordinate
    pointsRef.current.push({
      x: clickPoint.x,
      y: clickPoint.y,
      t: performance.now(),
    });

    const result = evaluateMouseTrajectory(
      pointsRef.current,
      targetPoint,
      clickPoint,
      4,
      gateStartTimeRef.current
    );

    // Provide visual ping before showing result modal
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
              CHECK 04 // GATE 04
            </span>
            <span className="text-xs font-mono font-bold text-slate-300 tracking-wide">
              IS CLICK SPOT WORTH 20 POINTS
            </span>
          </div>
          <span className="text-[10px] font-mono text-cyan-400 font-bold bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
            TIME: 7.0s
          </span>
        </div>

        {/* Protocol Instruction Description */}
        <div className="mb-4 text-left">
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
            Biometric Click Spot Precision Test
          </h2>
          <p className="mt-1 text-xs text-slate-300 leading-relaxed">
            Robots program clicks to the exact coordinate center. Human physiology naturally trembles with organic offset. Click inside the calibration circle below.
          </p>
        </div>

        {/* The 3 Official Scoring Rules Banner */}
        <div className="mb-5 grid grid-cols-3 gap-2 text-center font-mono text-[10px]">
          <div className="rounded-lg bg-slate-950 p-2 border border-rose-500/30">
            <span className="text-rose-400 font-bold block">EXACT CENTER</span>
            <span className="text-white font-black text-sm block mt-0.5">0 PTS</span>
            <span className="text-[9px] text-slate-400 block">&lt; 1.8 px (Synthetic)</span>
          </div>

          <div className="rounded-lg bg-slate-950 p-2 border border-amber-500/30">
            <span className="text-amber-400 font-bold block">LITTLE OFF-CENTER</span>
            <span className="text-white font-black text-sm block mt-0.5">1 PT</span>
            <span className="text-[9px] text-slate-400 block">1.8 - 4.0 px</span>
          </div>

          <div className="rounded-lg bg-slate-950 p-2 border border-emerald-500/30">
            <span className="text-emerald-400 font-bold block">ORGANIC OFFSET</span>
            <span className="text-white font-black text-sm block mt-0.5">20 PTS</span>
            <span className="text-[9px] text-slate-400 block">&gt; 4.0 px (Full Human)</span>
          </div>
        </div>

        {/* Interactive Calibration Crosshair Chamber */}
        <div
          ref={containerRef}
          className="relative h-64 sm:h-72 w-full rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center overflow-hidden cursor-crosshair select-none"
          onMouseEnter={() => setHoveringTarget(true)}
          onMouseLeave={() => setHoveringTarget(false)}
        >
          {/* Subtle Grid Backdrop */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b08_1px,transparent_1px),linear-gradient(to_bottom,#1e293b08_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

          {/* Crosshair Guides */}
          <div className="absolute inset-x-0 top-1/2 h-px bg-slate-800/80 pointer-events-none" />
          <div className="absolute inset-y-0 left-1/2 w-px bg-slate-800/80 pointer-events-none" />

          {/* Live Reticle Coordinates HUD */}
          <div className="absolute top-3 left-3 text-[10px] font-mono text-slate-400 flex items-center gap-2">
            <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              LIVE OFFSET:{' '}
              <strong className={liveOffset !== null && liveOffset < 1.8 ? 'text-rose-400' : liveOffset !== null && liveOffset < 4 ? 'text-amber-400' : 'text-emerald-400'}>
                {liveOffset !== null ? `${liveOffset} px` : '--'}
              </strong>
            </span>
          </div>

          <div className="absolute top-3 right-3 text-[10px] font-mono text-cyan-400 bg-cyan-950/70 border border-cyan-800/60 px-2 py-0.5 rounded">
            TARGET: CALIBRATION SPOT
          </div>

          {/* The Target Calibration Disc */}
          <div
            ref={targetRef}
            onClick={handleTargetClick}
            className={`relative w-44 h-44 rounded-full flex items-center justify-center transition-transform active:scale-95 cursor-pointer ${
              isVerifying ? 'pointer-events-none opacity-80' : 'hover:scale-102'
            }`}
          >
            {/* Outer Zone (20 Points) */}
            <div className="absolute inset-0 rounded-full border-2 border-emerald-500/40 bg-emerald-950/10 flex items-center justify-center">
              <span className="absolute top-1 text-[8px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                20 PTS ZONE
              </span>
            </div>

            {/* Middle Zone (1 Point) */}
            <div className="absolute w-24 h-24 rounded-full border border-amber-500/50 bg-amber-950/20 flex items-center justify-center">
              <span className="absolute top-1 text-[7px] font-mono text-amber-300 font-bold">
                1 PT ZONE
              </span>
            </div>

            {/* Exact Center Bullseye (0 Points) */}
            <div className="absolute w-7 h-7 rounded-full border border-rose-500/80 bg-rose-950/60 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping opacity-75" />
              <div className="absolute w-1.5 h-1.5 rounded-full bg-rose-300" />
            </div>

            {/* Concentric Cross lines on target */}
            <div className="absolute w-full h-px bg-cyan-500/20 pointer-events-none" />
            <div className="absolute h-full w-px bg-cyan-500/20 pointer-events-none" />

            {/* Click Visual Ripple */}
            {isVerifying && (
              <div className="absolute inset-0 rounded-full border-4 border-cyan-400 animate-ping pointer-events-none" />
            )}
          </div>

          {/* Bottom Live Hint */}
          <div className="absolute bottom-2.5 text-center font-mono text-[10px] text-slate-400">
            {isVerifying ? (
              <span className="text-cyan-300 font-bold animate-pulse">
                PROCESSING BIOMETRIC SPOT ACCURACY...
              </span>
            ) : liveOffset !== null && liveOffset < 1.8 ? (
              <span className="text-rose-400 font-bold">
                WARNING: On exact center! Bot score (0 PTS). Move slightly off-center!
              </span>
            ) : liveOffset !== null && liveOffset < 4.0 ? (
              <span className="text-amber-400 font-medium">
                Slight offset detected: 1 PT. Shift more for full 20 PTS!
              </span>
            ) : (
              <span className="text-emerald-400 font-bold">
                Natural Human Range: Click now for full 20 PTS!
              </span>
            )}
          </div>
        </div>

        {/* Footer Prompt */}
        <div className="mt-4 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>Remember: Straight fast moves score &lt; 30.</span>
          <span className="text-cyan-400">Curve your cursor into the target!</span>
        </div>
      </div>
    </div>
  );
};
