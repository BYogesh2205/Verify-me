import React, { useState, useRef } from 'react';
import { MousePoint, ScoreBreakdown } from '../types';
import { evaluateMouseTrajectory } from '../utils/scoring';
import { sound } from '../utils/audio';
import { Puzzle, MoveHorizontal, Crosshair } from 'lucide-react';

interface Gate2PuzzleProps {
  onComplete: (result: ScoreBreakdown) => void;
  onMovementUpdate?: (count: number) => void;
}

export const Gate2Puzzle: React.FC<Gate2PuzzleProps> = ({
  onComplete,
  onMovementUpdate,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSnapped, setIsSnapped] = useState(false);

  const targetX = 350;
  const targetY = 90;
  const startX = 60;
  const startY = 90;

  const [piecePos, setPiecePos] = useState({ x: startX, y: startY });
  const gateStartTimeRef = useRef<number>(performance.now());
  const dragPointsRef = useRef<MousePoint[]>([]);
  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isSnapped) return;
    try {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    setIsDragging(true);
    sound.playClick();
    dragPointsRef.current = [
      { x: e.clientX, y: e.clientY, t: performance.now() },
    ];

    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scaleX = 480 / rect.width;
    const scaleY = 240 / rect.height;

    const curCanvasX = (e.clientX - rect.left) * scaleX;
    const curCanvasY = (e.clientY - rect.top) * scaleY;

    dragOffsetRef.current = {
      x: curCanvasX - piecePos.x,
      y: curCanvasY - piecePos.y,
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || isSnapped || !containerRef.current) return;

    dragPointsRef.current.push({
      x: e.clientX,
      y: e.clientY,
      t: performance.now(),
    });

    if (onMovementUpdate) {
      onMovementUpdate(dragPointsRef.current.length);
    }

    const rect = containerRef.current.getBoundingClientRect();
    const scaleX = 480 / rect.width;
    const scaleY = 240 / rect.height;

    const curCanvasX = (e.clientX - rect.left) * scaleX;
    const curCanvasY = (e.clientY - rect.top) * scaleY;

    const newX = Math.max(30, Math.min(430, curCanvasX - dragOffsetRef.current.x));
    const newY = Math.max(30, Math.min(190, curCanvasY - dragOffsetRef.current.y));

    setPiecePos({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging || isSnapped) return;
    setIsDragging(false);

    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    const distToTarget = Math.hypot(piecePos.x - targetX, piecePos.y - targetY);

    if (distToTarget <= 34) {
      setIsSnapped(true);
      setPiecePos({ x: targetX, y: targetY });
      sound.playPuzzleSnap();

      dragPointsRef.current.push({
        x: e.clientX,
        y: e.clientY,
        t: performance.now(),
      });

      const rect = containerRef.current?.getBoundingClientRect();
      const screenTarget = rect
        ? {
            x: rect.left + (targetX / 480) * rect.width,
            y: rect.top + (targetY / 240) * rect.height,
          }
        : { x: e.clientX, y: e.clientY };

      const clickPoint = { x: e.clientX, y: e.clientY };
      const result = evaluateMouseTrajectory(
        dragPointsRef.current,
        screenTarget,
        clickPoint,
        2,
        gateStartTimeRef.current
      );

      setTimeout(() => {
        if (result.passed) {
          sound.playCheckmark();
        } else {
          sound.playWarning();
        }
        onComplete(result);
      }, 500);
    } else {
      sound.playWarning();
      setPiecePos({ x: startX, y: startY });
      dragPointsRef.current = [];
    }
  };

  const puzzlePath = `
    M 0,0
    H 24
    C 24,10 40,10 40,0
    H 64
    V 24
    C 74,24 74,40 64,40
    V 64
    H 40
    C 40,54 24,54 24,64
    H 0
    V 40
    C 10,40 10,24 0,24
    Z
  `;

  const currentDist = Math.round(Math.hypot(piecePos.x - targetX, piecePos.y - targetY));

  return (
    <div className="relative mx-auto w-full max-w-xl px-4 py-6 select-none animate-in fade-in zoom-in-95 duration-200">
      {/* Light card with cyber accents */}
      <div className="relative rounded-2xl bg-slate-100 p-6 sm:p-8 text-slate-900 border-2 border-slate-300 shadow-2xl cyan-glow">
        {/* Tactical Corner Markers */}
        <div className="pointer-events-none absolute top-2 left-2 h-3 w-3 border-t-2 border-l-2 border-cyan-600" />
        <div className="pointer-events-none absolute top-2 right-2 h-3 w-3 border-t-2 border-r-2 border-cyan-600" />
        <div className="pointer-events-none absolute bottom-2 left-2 h-3 w-3 border-b-2 border-l-2 border-cyan-600" />
        <div className="pointer-events-none absolute bottom-2 right-2 h-3 w-3 border-b-2 border-r-2 border-cyan-600" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-700">
              GATE 02 · KINEMATIC INTEGRITY
            </span>
            <h2 className="text-2xl font-black text-slate-950 tracking-tight mt-0.5">
              Holographic Puzzle Fit
            </h2>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-100 border border-cyan-300 text-cyan-700 shadow-sm">
            <Puzzle className="w-6 h-6" />
          </div>
        </div>

        {/* Rule Banner */}
        <div className="mb-4 rounded-xl bg-slate-900 p-3.5 text-xs text-slate-200 border border-slate-800 shadow-inner flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MoveHorizontal className="w-4 h-4 text-cyan-400" />
            <span>
              Drag the blue shard into the socket. <strong className="text-cyan-300">Wobble on purpose!</strong>
            </span>
          </div>
          <span className="font-mono text-xs font-bold text-cyan-400 tabular-nums">
            {currentDist}px to socket
          </span>
        </div>

        {/* Interactive Cyber Puzzle Terminal Canvas */}
        <div
          ref={containerRef}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="relative w-full aspect-[2/1] rounded-xl overflow-hidden bg-slate-950 border-2 border-slate-800 shadow-inner cursor-grab active:cursor-grabbing touch-none select-none"
        >
          {/* Cyber Blueprint Lines */}
          <svg viewBox="0 0 480 240" className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <pattern id="gridPattern" width="24" height="24" patternUnits="userSpaceOnUse">
                <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#1e293b" strokeWidth="0.6" />
              </pattern>
            </defs>
            <rect width="480" height="240" fill="#090e1a" />
            <rect width="480" height="240" fill="url(#gridPattern)" />

            {/* Circuit traces */}
            <path d="M 60 90 L 180 90 L 220 140 L 350 90" fill="none" stroke="#0ea5e9" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
            <circle cx="180" cy="90" r="3" fill="#0284c7" />
            <circle cx="220" cy="140" r="3" fill="#0284c7" />

            {/* Target Socket (Glowing silhouette) */}
            <g transform={`translate(${targetX - 32}, ${targetY - 32})`}>
              <path
                d={puzzlePath}
                fill="#020617"
                stroke="#00f2fe"
                strokeWidth="2.5"
                strokeDasharray="4 3"
                className="animate-pulse"
                filter="drop-shadow(0 0 8px #00f2fe)"
              />
              <text
                x="32"
                y="36"
                fill="#38bdf8"
                fontSize="8"
                fontFamily="monospace"
                fontWeight="bold"
                textAnchor="middle"
              >
                ALIGN HERE
              </text>
            </g>
          </svg>

          {/* Draggable Shard */}
          <div
            onPointerDown={handlePointerDown}
            style={{
              transform: `translate(${piecePos.x - 32}px, ${piecePos.y - 32}px)`,
              left: 0,
              top: 0,
              position: 'absolute',
            }}
            className={`cursor-grab active:cursor-grabbing select-none transition-transform ${
              isDragging ? 'scale-105 filter drop-shadow-[0_0_12px_#06b6d4]' : ''
            }`}
          >
            <svg width="64" height="64" viewBox="0 0 64 64" className="overflow-visible">
              <path
                d={puzzlePath}
                fill="#0284c7"
                stroke="#e0f2fe"
                strokeWidth="2.5"
                filter="drop-shadow(0 4px 6px rgba(0,0,0,0.4))"
              />
              <circle cx="32" cy="32" r="6" fill="#0c4a6e" stroke="#7dd3fc" strokeWidth="1.5" />
              <circle cx="32" cy="32" r="2.5" fill="#38bdf8" />
            </svg>
          </div>
        </div>

        {/* Telemetry info */}
        <div className="mt-4 flex items-center justify-between text-xs font-mono text-slate-600">
          <span className="flex items-center gap-1.5">
            <Crosshair className="w-3.5 h-3.5 text-cyan-700" />
            Status: {isDragging ? 'Sampling Kinematic Arc...' : 'Awaiting Shard Drag'}
          </span>
          <span className="text-cyan-700 font-bold">Fast straight moves score &lt; 30</span>
        </div>
      </div>
    </div>
  );
};
