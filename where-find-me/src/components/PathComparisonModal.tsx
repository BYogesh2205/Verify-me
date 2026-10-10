import React, { useMemo } from 'react';
import { ScoreBreakdown } from '../types';
import { RotateCcw, ArrowRight, CheckCircle2, AlertTriangle, Fingerprint, Clock, Crosshair } from 'lucide-react';
import { sound } from '../utils/audio';
import { Logo } from './Logo';

interface PathComparisonModalProps {
  result: ScoreBreakdown;
  onTryAgain: () => void;
  onNext: () => void;
}

export const PathComparisonModal: React.FC<PathComparisonModalProps> = ({
  result,
  onTryAgain,
  onNext,
}) => {
  const {
    humanScore,
    curvatureScore,
    jitterScore,
    offsetScore,
    speedVarianceScore,
    timeScore,
    clickSpotPoints,
    clickSpotVerdict,
    reactionTimerPoints,
    reactionTimerVerdict,
    reactionTimeMs,
    rawCurvatureRatio,
    rawTotalPathPx,
    rawStraightDistancePx,
    rawJitterRad,
    rawOffsetPx,
    rawAvgSpeedPxMs,
    durationMs,
    passed,
    pathPoints,
    startPoint,
    targetPoint,
    gateName,
    gateIndex,
    feedbackReason,
  } = result;

  // Normalize points into coordinate space 0..400 x 0..220 for SVG
  const { normalizedPoints, normStart, normTarget, normEnd } = useMemo(() => {
    if (!pathPoints || pathPoints.length === 0) {
      return {
        normalizedPoints: [],
        normStart: { x: 50, y: 170 },
        normTarget: { x: 350, y: 50 },
        normEnd: { x: 350, y: 50 },
      };
    }

    let minX = Math.min(...pathPoints.map((p) => p.x), targetPoint.x);
    let maxX = Math.max(...pathPoints.map((p) => p.x), targetPoint.x);
    let minY = Math.min(...pathPoints.map((p) => p.y), targetPoint.y);
    let maxY = Math.max(...pathPoints.map((p) => p.y), targetPoint.y);

    const pad = 30;
    const rangeX = Math.max(80, maxX - minX);
    const rangeY = Math.max(60, maxY - minY);

    const scaleX = (400 - pad * 2) / rangeX;
    const scaleY = (220 - pad * 2) / rangeY;
    const scale = Math.min(scaleX, scaleY);

    const midX = (minX + maxX) / 2;
    const midY = (minY + maxY) / 2;

    const transform = (pt: { x: number; y: number }) => ({
      x: 200 + (pt.x - midX) * scale,
      y: 110 + (pt.y - midY) * scale,
    });

    const normalized = pathPoints.map(transform);
    const nStart = transform(startPoint);
    const nTarget = transform(targetPoint);
    const nEnd = transform(pathPoints[pathPoints.length - 1]);

    return {
      normalizedPoints: normalized,
      normStart: nStart,
      normTarget: nTarget,
      normEnd: nEnd,
    };
  }, [pathPoints, startPoint, targetPoint]);

  const humanPathSvg = useMemo(() => {
    if (normalizedPoints.length < 2) return '';
    return normalizedPoints.reduce(
      (acc, pt, i) =>
        i === 0
          ? `M ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`
          : `${acc} L ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`,
      ''
    );
  }, [normalizedPoints]);

  return (
    <div className="relative mx-auto w-full max-w-2xl px-4 py-4 select-none animate-in fade-in zoom-in-95 duration-200">
      {/* Specimen Diagnostics Docket */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-900/95 p-6 sm:p-8 text-white border-2 border-slate-700/80 shadow-2xl backdrop-blur-xl">
        <div className="corner-bracket-tl" />
        <div className="corner-bracket-tr" />
        <div className="corner-bracket-bl" />
        <div className="corner-bracket-br" />

        {/* Header with Logo */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5">
          <div className="flex items-center gap-3">
            <Logo size="sm" showWordmark={false} />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-400">
                  Gate 0{gateIndex} Diagnostics
                </span>
                <span className="text-slate-600">/</span>
                <span className="text-xs font-semibold text-slate-300">{gateName}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-0.5 font-sans">
                Kinematic Telemetry Analysis
              </h2>
            </div>
          </div>

          {/* Pass / Fail Status Stamp */}
          <div
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold font-mono ${
              passed
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/70 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                : 'bg-rose-950/80 text-rose-300 border border-rose-500/70 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
            }`}
          >
            {passed ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>HUMAN CONFIRMED</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>SYNTHETIC REJECTED</span>
              </>
            )}
          </div>
        </div>

        {/* Score & Trajectory Map Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* Main Score Box */}
          <div className="flex flex-col items-center justify-center rounded-xl bg-slate-950 p-5 border border-slate-800 text-center shadow-inner">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              Biological Quotient
            </span>
            <div className="relative my-2 flex items-baseline justify-center">
              <span
                className={`text-5xl sm:text-6xl font-black tracking-tight tabular-nums ${
                  passed ? 'text-cyan-400 cyan-text-glow' : 'text-rose-400'
                }`}
              >
                {humanScore}
              </span>
              <span className="text-base font-bold text-slate-500 ml-1">/100</span>
            </div>
            <p className="text-xs font-semibold text-slate-400 font-mono">
              {passed ? 'Passed (≥ 50 required)' : 'Failed (< 50 threshold)'}
            </p>
          </div>

          {/* Trajectory Canvas: Dual-trace visualizer */}
          <div className="md:col-span-2 relative rounded-xl bg-slate-950 p-3 border border-slate-800 shadow-inner">
            <div className="flex items-center justify-between px-1 pb-2 text-[11px] text-slate-300 font-mono">
              <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                <span className="inline-block h-2 w-3 rounded-none bg-cyan-400 shadow-[0_0_6px_#00f2fe]" />
                Your Motion Path
              </span>
              <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                <span className="inline-block h-0.5 w-3 border-t-2 border-dashed border-amber-400" />
                What a robot does
              </span>
            </div>

            <svg
              viewBox="0 0 400 220"
              className="w-full h-44 rounded-lg bg-black/60 border border-slate-800/80"
            >
              <defs>
                <pattern id="diagGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.4" />
                </pattern>
              </defs>
              <rect width="400" height="220" fill="url(#diagGrid)" />

              {/* Dashed Straight Line: "What a robot does" */}
              <line
                x1={normStart.x}
                y1={normStart.y}
                x2={normTarget.x}
                y2={normTarget.y}
                stroke="#f59e0b"
                strokeWidth="2.5"
                strokeDasharray="6 4"
                opacity="0.9"
              />

              {/* Player's Path in Glowing Cyan */}
              {humanPathSvg && (
                <path
                  d={humanPathSvg}
                  fill="none"
                  stroke="#00e5ff"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="drop-shadow(0 0 6px #00f2fe)"
                />
              )}

              {/* Start Point */}
              <circle cx={normStart.x} cy={normStart.y} r="4.5" fill="#38bdf8" />
              <text
                x={normStart.x + 7}
                y={normStart.y + 3}
                fill="#94a3b8"
                fontSize="9"
                fontFamily="monospace"
              >
                START
              </text>

              {/* Target Point */}
              <circle
                cx={normTarget.x}
                cy={normTarget.y}
                r="7"
                fill="none"
                stroke="#f43f5e"
                strokeWidth="1.5"
                strokeDasharray="2 2"
              />
              <circle cx={normTarget.x} cy={normTarget.y} r="2.5" fill="#f43f5e" />
              <text
                x={normTarget.x + 9}
                y={normTarget.y + 3}
                fill="#f43f5e"
                fontSize="9"
                fontFamily="monospace"
              >
                TARGET
              </text>

              {/* Click Point */}
              <circle
                cx={normEnd.x}
                cy={normEnd.y}
                r="3.5"
                fill="#22d3ee"
                stroke="#ffffff"
                strokeWidth="1.2"
              />
            </svg>
          </div>
        </div>

        {/* EXPLICIT 5-CHECK VERIFICATION SUITE (FEATURING CHECK 4 & CHECK 5) */}
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1 text-[11px] font-mono font-bold text-slate-300">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <Crosshair className="w-3.5 h-3.5" />
              VERIFICATION AUDIT: CHECK 4 & CHECK 5
            </span>
            <span className="text-slate-500">20 POINTS EACH</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
            {/* CHECK 4: Is Click Spot Worth 20 Points */}
            <div className="rounded-xl bg-slate-950 p-3.5 border-2 border-cyan-500/50 shadow-inner flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="rounded bg-cyan-950 border border-cyan-500/50 px-1.5 py-0.5 text-[9px] font-extrabold text-cyan-300">
                      CHECK 4
                    </span>
                    <span className="text-[11px] font-bold text-white">
                      Is Click Spot Worth 20 Points
                    </span>
                  </div>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded ${
                      clickSpotPoints === 20
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/50'
                        : clickSpotPoints === 0
                        ? 'bg-rose-950 text-rose-400 border border-rose-500/50'
                        : 'bg-amber-950 text-amber-400 border border-amber-500/50'
                    }`}
                  >
                    {clickSpotPoints} / 20 pts
                  </span>
                </div>
                <div className="mt-2 text-[10px] space-y-1 text-slate-300">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-400">Target Center Offset:</span>
                    <span className="text-white font-bold">{rawOffsetPx} px</span>
                  </div>
                  <p className="text-[10px] text-slate-400 pt-1 leading-snug">
                    • Clicking exact center (&lt; 1.8px) gets <strong className="text-rose-400">0 pts</strong>.
                  </p>
                  <p className="text-[10px] text-slate-400 leading-snug">
                    • Clicking a little off-center gets <strong className="text-amber-400">1 pt</strong>.
                  </p>
                  <p className="text-[10px] text-slate-400 leading-snug">
                    • Natural organic landing gets <strong className="text-emerald-400">up to 20 pts</strong>.
                  </p>
                </div>
              </div>
              <div className="mt-2 pt-1.5 border-t border-slate-800/80 text-[10px] font-bold text-cyan-300">
                Check 4 Status: {clickSpotVerdict}
              </div>
            </div>

            {/* CHECK 5: Why Is Reaction Timer Worth 20 Points */}
            <div className="rounded-xl bg-slate-950 p-3.5 border-2 border-cyan-500/50 shadow-inner flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="rounded bg-cyan-950 border border-cyan-500/50 px-1.5 py-0.5 text-[9px] font-extrabold text-cyan-300">
                      CHECK 5
                    </span>
                    <span className="text-[11px] font-bold text-white">
                      Why Is Reaction Timer Worth 20 Points
                    </span>
                  </div>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded ${
                      reactionTimerPoints === 20
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/50'
                        : reactionTimerPoints === 0
                        ? 'bg-rose-950 text-rose-400 border border-rose-500/50'
                        : 'bg-amber-950 text-amber-400 border border-amber-500/50'
                    }`}
                  >
                    {reactionTimerPoints} / 20 pts
                  </span>
                </div>
                <div className="mt-2 text-[10px] space-y-1 text-slate-300">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-400">Reaction Latency:</span>
                    <span className="text-white font-bold">{reactionTimeMs} ms</span>
                  </div>
                  <p className="text-[10px] text-slate-400 pt-1 leading-snug">
                    • Moving is under 50 ms gets <strong className="text-rose-400">0 pts</strong>.
                  </p>
                  <p className="text-[10px] text-slate-400 leading-snug">
                    • Starting between 200 and 500 ms gets <strong className="text-emerald-400">full 20 pts</strong>.
                  </p>
                </div>
              </div>
              <div className="mt-2 pt-1.5 border-t border-slate-800/80 text-[10px] font-bold text-cyan-300">
                Check 5 Status: {reactionTimerVerdict}
              </div>
            </div>
          </div>
        </div>

        {/* Primary Metrics */}
        <div className="mt-3.5 grid grid-cols-3 gap-2.5 font-mono">
          <div className="rounded-lg bg-slate-950 p-2.5 border border-slate-800 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              Curvature
            </span>
            <div className="mt-0.5 text-base font-bold text-white">
              {rawCurvatureRatio}x
            </div>
            <p className="text-[9px] text-slate-500">
              {rawCurvatureRatio < 1.12 ? 'Straight (Robot)' : 'Organic Arc'}
            </p>
          </div>

          <div className="rounded-lg bg-slate-950 p-2.5 border border-slate-800 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              Tremor Jitter
            </span>
            <div className="mt-0.5 text-base font-bold text-cyan-400">
              {jitterScore}%
            </div>
            <p className="text-[9px] text-slate-500">
              {jitterScore < 30 ? 'Zero jitter' : 'Living tremor'}
            </p>
          </div>

          <div className="rounded-lg bg-slate-950 p-2.5 border border-slate-800 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              Center Offset
            </span>
            <div className="mt-0.5 text-base font-bold text-white">
              {rawOffsetPx}px
            </div>
            <p className="text-[9px] text-slate-500">
              {rawOffsetPx < 1.8 ? 'Dead center (0 pts)' : rawOffsetPx < 3.2 ? 'Little offset (1 pt)' : 'Human landing'}
            </p>
          </div>
        </div>

        {/* RAW SCORE NUMBERS IN SMALL TEXT (Explicitly Requested) */}
        <div className="mt-3 rounded-lg bg-black/80 p-3 text-slate-300 border border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-1 mb-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
              Exact Diagnostic Telemetry Dump
            </span>
            <span className="text-[9px] font-mono text-slate-500">
              [Raw Values in Small Text]
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-1 gap-x-4 text-[10px] font-mono">
            <div>
              <span className="text-slate-500">Reaction Latency: </span>
              <span className="text-white font-semibold">{reactionTimeMs} ms</span>
            </div>
            <div>
              <span className="text-slate-500">Duration: </span>
              <span className="text-white font-semibold">{durationMs} ms</span>
            </div>
            <div>
              <span className="text-slate-500">Total Path: </span>
              <span className="text-white font-semibold">{rawTotalPathPx} px</span>
            </div>
            <div>
              <span className="text-slate-500">Straight Dist: </span>
              <span className="text-white font-semibold">{rawStraightDistancePx} px</span>
            </div>
            <div>
              <span className="text-slate-500">Curvature Ratio: </span>
              <span className="text-white font-semibold">{rawCurvatureRatio}</span>
            </div>
            <div>
              <span className="text-slate-500">Tremor Angular: </span>
              <span className="text-white font-semibold">{rawJitterRad} rad</span>
            </div>
            <div>
              <span className="text-slate-500">Target Offset: </span>
              <span className="text-white font-semibold">{rawOffsetPx} px</span>
            </div>
            <div>
              <span className="text-slate-500">Click Spot Score: </span>
              <span className="text-cyan-300 font-bold">{clickSpotPoints} / 20 pts</span>
            </div>
            <div>
              <span className="text-slate-500">Reaction Score: </span>
              <span className="text-cyan-300 font-bold">{reactionTimerPoints} / 20 pts</span>
            </div>
            <div>
              <span className="text-slate-500">Avg Velocity: </span>
              <span className="text-white font-semibold">{rawAvgSpeedPxMs} px/ms</span>
            </div>
            <div>
              <span className="text-slate-500">Curvature Subscore: </span>
              <span className="text-white font-semibold">{curvatureScore} / 100</span>
            </div>
            <div>
              <span className="text-slate-500">Jitter Subscore: </span>
              <span className="text-white font-semibold">{jitterScore} / 100</span>
            </div>
          </div>
        </div>

        {/* Diagnostic Note */}
        <div className="mt-3 rounded-lg bg-slate-950 p-2.5 text-xs text-slate-300 border border-slate-800">
          <span className="font-bold text-white">Examiner Verdict: </span>
          {feedbackReason}
        </div>

        {/* Buttons: Try Again & Next Gate */}
        <div className="mt-5 flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
          <button
            onClick={() => {
              sound.playClick();
              onTryAgain();
            }}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs sm:text-sm font-bold text-white transition hover:bg-slate-700 active:scale-95 cursor-pointer font-mono"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onNext();
            }}
            className={`flex items-center gap-1.5 rounded-xl px-6 py-2.5 text-xs sm:text-sm font-bold text-slate-950 transition active:scale-95 cursor-pointer font-mono ${
              passed
                ? 'bg-cyan-400 hover:bg-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                : 'bg-slate-300 hover:bg-white text-slate-900'
            }`}
          >
            <span>
              {passed
                ? gateIndex >= 5
                  ? 'Claim Human Certificate'
                  : 'Next Gate'
                : 'Retry Gate'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
