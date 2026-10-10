import React, { useState, useRef, useEffect } from 'react';
import { MousePoint, ScoreBreakdown } from '../types';
import { evaluateMouseTrajectory } from '../utils/scoring';
import { sound } from '../utils/audio';
import { Check, CheckCircle, Car, AlertCircle, Eye } from 'lucide-react';

interface Gate3TrafficLightProps {
  onComplete: (result: ScoreBreakdown) => void;
  onMovementUpdate?: (count: number) => void;
}

interface TileItem {
  id: number;
  hasTrafficLight: boolean;
  name: string;
}

export const Gate3TrafficLight: React.FC<Gate3TrafficLightProps> = ({
  onComplete,
  onMovementUpdate,
}) => {
  const [tiles] = useState<TileItem[]>([
    { id: 0, hasTrafficLight: true, name: 'Signal Pole North' },
    { id: 1, hasTrafficLight: false, name: 'Park Tree' },
    { id: 2, hasTrafficLight: true, name: 'Overhead Intersection Light' },
    { id: 3, hasTrafficLight: false, name: 'Sedan Vehicle' },
    { id: 4, hasTrafficLight: false, name: 'Crosswalk Stripes' },
    { id: 5, hasTrafficLight: true, name: 'Pedestrian Signal Pole' },
    { id: 6, hasTrafficLight: false, name: 'Bicycle Path' },
    { id: 7, hasTrafficLight: true, name: 'Avenue Stoplight' },
    { id: 8, hasTrafficLight: false, name: 'Fire Hydrant' },
  ]);

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const gateStartTimeRef = useRef<number>(performance.now());
  const pointsRef = useRef<MousePoint[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    gateStartTimeRef.current = performance.now();
    pointsRef.current = [];
    const handleMove = (e: MouseEvent) => {
      pointsRef.current.push({
        x: e.clientX,
        y: e.clientY,
        t: performance.now(),
      });
      if (onMovementUpdate) {
        onMovementUpdate(pointsRef.current.length);
      }
    };

    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [onMovementUpdate]);

  const toggleTile = (id: number) => {
    sound.playClick();
    setErrorMsg(null);
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleVerify = (e: React.MouseEvent<HTMLButtonElement>) => {
    sound.playClick();
    const correctIds = tiles.filter((t) => t.hasTrafficLight).map((t) => t.id);

    const isExactMatch =
      correctIds.length === selectedIds.length &&
      correctIds.every((id) => selectedIds.includes(id));

    const clickPoint = { x: e.clientX, y: e.clientY };
    const rect = buttonRef.current?.getBoundingClientRect();
    const targetPoint = rect
      ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
      : clickPoint;

    const result = evaluateMouseTrajectory(
      pointsRef.current,
      targetPoint,
      clickPoint,
      3,
      gateStartTimeRef.current
    );

    if (!isExactMatch) {
      sound.playWarning();
      setErrorMsg('Incorrect selection. Please tag all 4 squares with traffic lights!');
      result.passed = false;
      result.humanScore = Math.min(28, result.humanScore);
      result.feedbackReason = 'Missed traffic light tiles or selected non-light items.';
      setTimeout(() => onComplete(result), 800);
      return;
    }

    if (result.passed) {
      sound.playCheckmark();
    } else {
      sound.playWarning();
    }

    setTimeout(() => {
      onComplete(result);
    }, 400);
  };

  // High contrast procedural vector graphics for tiles
  const renderTileGraphic = (tile: TileItem) => {
    switch (tile.id) {
      case 0:
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" fill="#0f172a" />
            <line x1="50" y1="95" x2="50" y2="25" stroke="#94a3b8" strokeWidth="4" />
            <rect x="38" y="20" width="24" height="52" rx="4" fill="#020617" stroke="#38bdf8" strokeWidth="2" />
            <circle cx="50" cy="30" r="5" fill="#ef4444" filter="drop-shadow(0 0 4px #ef4444)" />
            <circle cx="50" cy="46" r="5" fill="#eab308" opacity="0.3" />
            <circle cx="50" cy="62" r="5" fill="#22c55e" opacity="0.3" />
          </svg>
        );
      case 1:
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" fill="#0f172a" />
            <rect x="46" y="60" width="8" height="35" fill="#78350f" />
            <circle cx="50" cy="45" r="22" fill="#15803d" />
            <circle cx="38" cy="40" r="14" fill="#16a34a" />
            <circle cx="62" cy="40" r="14" fill="#16a34a" />
          </svg>
        );
      case 2:
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" fill="#090e1a" />
            <path d="M 0 30 Q 50 15 100 30" fill="none" stroke="#64748b" strokeWidth="3" />
            <rect x="36" y="26" width="28" height="50" rx="3" fill="#020617" stroke="#38bdf8" strokeWidth="1.5" />
            <circle cx="50" cy="36" r="5" fill="#ef4444" opacity="0.3" />
            <circle cx="50" cy="51" r="5" fill="#eab308" opacity="0.3" />
            <circle cx="50" cy="66" r="5" fill="#22c55e" filter="drop-shadow(0 0 5px #22c55e)" />
          </svg>
        );
      case 3:
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" fill="#0f172a" />
            <rect x="15" y="70" width="70" height="5" fill="#334155" />
            <path d="M 22 62 L 32 45 L 68 45 L 80 62 Z" fill="#0284c7" />
            <rect x="18" y="58" width="64" height="14" rx="3" fill="#0369a1" />
            <circle cx="32" cy="72" r="7" fill="#020617" stroke="#94a3b8" strokeWidth="2" />
            <circle cx="68" cy="72" r="7" fill="#020617" stroke="#94a3b8" strokeWidth="2" />
          </svg>
        );
      case 4:
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" fill="#1e293b" />
            <rect x="10" y="25" width="80" height="10" fill="#f8fafc" />
            <rect x="10" y="45" width="80" height="10" fill="#f8fafc" />
            <rect x="10" y="65" width="80" height="10" fill="#f8fafc" />
          </svg>
        );
      case 5:
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" fill="#0f172a" />
            <line x1="50" y1="95" x2="50" y2="28" stroke="#94a3b8" strokeWidth="4" />
            <rect x="36" y="22" width="28" height="52" rx="3" fill="#020617" stroke="#38bdf8" strokeWidth="1.5" />
            <circle cx="50" cy="34" r="6" fill="#ef4444" opacity="0.3" />
            <circle cx="50" cy="48" r="6" fill="#eab308" filter="drop-shadow(0 0 5px #eab308)" />
            <circle cx="50" cy="62" r="6" fill="#22c55e" opacity="0.3" />
          </svg>
        );
      case 6:
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" fill="#0f172a" />
            <circle cx="30" cy="65" r="14" fill="none" stroke="#64748b" strokeWidth="3" />
            <circle cx="70" cy="65" r="14" fill="none" stroke="#64748b" strokeWidth="3" />
            <path d="M 30 65 L 48 65 L 62 48 L 42 48 Z" fill="none" stroke="#0ea5e9" strokeWidth="3" />
            <line x1="48" y1="65" x2="42" y2="40" stroke="#0ea5e9" strokeWidth="3" />
            <line x1="70" y1="65" x2="60" y2="38" stroke="#0ea5e9" strokeWidth="3" />
          </svg>
        );
      case 7:
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" fill="#090e1a" />
            <line x1="20" y1="95" x2="20" y2="30" stroke="#94a3b8" strokeWidth="4" />
            <line x1="20" y1="35" x2="85" y2="35" stroke="#94a3b8" strokeWidth="3" />
            <rect x="38" y="38" width="24" height="48" rx="4" fill="#020617" stroke="#38bdf8" strokeWidth="2" />
            <circle cx="50" cy="47" r="4.5" fill="#ef4444" filter="drop-shadow(0 0 4px #ef4444)" />
            <circle cx="50" cy="62" r="4.5" fill="#eab308" opacity="0.3" />
            <circle cx="50" cy="76" r="4.5" fill="#22c55e" opacity="0.3" />
          </svg>
        );
      case 8:
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" fill="#0f172a" />
            <rect x="42" y="38" width="16" height="46" rx="2" fill="#dc2626" />
            <circle cx="50" cy="35" r="10" fill="#dc2626" />
            <rect x="36" y="52" width="28" height="6" rx="2" fill="#b91c1c" />
            <circle cx="50" cy="26" r="4" fill="#991b1b" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-lg px-4 py-4 select-none animate-in fade-in zoom-in-95 duration-200">
      {/* Light card with cyber accents */}
      <div className="relative rounded-2xl bg-slate-100 p-6 sm:p-7 text-slate-900 border-2 border-slate-300 shadow-2xl cyan-glow">
        {/* Tactical Corner Markers */}
        <div className="pointer-events-none absolute top-2 left-2 h-3 w-3 border-t-2 border-l-2 border-cyan-600" />
        <div className="pointer-events-none absolute top-2 right-2 h-3 w-3 border-t-2 border-r-2 border-cyan-600" />
        <div className="pointer-events-none absolute bottom-2 left-2 h-3 w-3 border-b-2 border-l-2 border-cyan-600" />
        <div className="pointer-events-none absolute bottom-2 right-2 h-3 w-3 border-b-2 border-r-2 border-cyan-600" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-700">
              GATE 03 · VISUAL SACCADE SCAN
            </span>
            <h2 className="text-2xl font-black text-slate-950 tracking-tight mt-0.5">
              Traffic Light Matrix
            </h2>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-100 border border-cyan-300 text-cyan-700 shadow-sm">
            <Car className="w-6 h-6" />
          </div>
        </div>

        {/* Guidance Banner */}
        <div className="mb-4 rounded-xl bg-slate-900 p-3 text-xs text-slate-200 border border-slate-800 shadow-inner flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-cyan-400" />
            <div>
              <p className="font-bold text-white">
                Select all 4 squares with traffic lights
              </p>
              <p className="text-[10px] text-slate-400">
                Click tiles, then click Verify before time runs out.
              </p>
            </div>
          </div>
          <span className="font-mono text-xs text-cyan-400 font-bold tabular-nums">
            {selectedIds.length} / 4
          </span>
        </div>

        {errorMsg && (
          <div className="mb-3 flex items-center gap-2 rounded-lg bg-rose-100 p-2 text-xs text-rose-900 border border-rose-300 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-700" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 3x3 Surveillance Matrix */}
        <div className="grid grid-cols-3 gap-2.5 rounded-xl bg-slate-900 p-2.5 border border-slate-800 shadow-inner">
          {tiles.map((tile, idx) => {
            const isSelected = selectedIds.includes(tile.id);
            return (
              <button
                key={tile.id}
                type="button"
                onClick={() => toggleTile(tile.id)}
                className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-cyan-400 scale-[0.97] shadow-[0_0_14px_#06b6d4]'
                    : 'border-slate-800 hover:border-slate-600'
                }`}
                aria-label={`Select ${tile.name}`}
              >
                {/* CAM Index Label */}
                <span className="absolute top-1 left-1.5 z-10 font-mono text-[8px] font-bold text-slate-400 bg-black/60 px-1 rounded">
                  CAM-0{idx + 1}
                </span>

                {renderTileGraphic(tile)}

                {/* Selected Holographic Badge */}
                {isSelected && (
                  <div className="absolute top-1.5 right-1.5 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-cyan-400 text-slate-950 font-bold shadow-md">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Verify Action Bar */}
        <div className="mt-5 flex items-center justify-between pt-2 border-t border-slate-200">
          <span className="text-xs text-slate-600 font-mono font-bold">
            Shortest timer: Hurry!
          </span>

          <button
            ref={buttonRef}
            type="button"
            onClick={handleVerify}
            className="flex items-center gap-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 px-6 py-2.5 text-xs sm:text-sm font-bold text-white transition-all shadow-md active:scale-95 cursor-pointer cyan-glow-sm"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Verify Traffic Grid</span>
          </button>
        </div>
      </div>
    </div>
  );
};
