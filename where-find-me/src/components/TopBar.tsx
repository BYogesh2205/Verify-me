import React from 'react';
import { Volume2, VolumeX, ShieldAlert, Heart, Clock, Home } from 'lucide-react';
import { GameStage } from '../types';
import { Logo } from './Logo';
import { sound } from '../utils/audio';

interface TopBarProps {
  stage: GameStage;
  gateIndex: number;
  lives: number;
  maxLives: number;
  suspicion: number;
  timeLeft: number;
  maxTime: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onGoHome: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  stage,
  gateIndex,
  lives,
  maxLives,
  suspicion,
  timeLeft,
  isMuted,
  onToggleMute,
  onGoHome,
}) => {
  const isPlayingGate =
    stage === 'GATE1' ||
    stage === 'GATE2' ||
    stage === 'GATE3' ||
    stage === 'GATE4' ||
    stage === 'GATE5';
  const isUrgent = timeLeft <= 3 && isPlayingGate;
  const isNotOnStart = stage !== 'START';

  let suspicionColor = 'bg-cyan-400 shadow-[0_0_10px_#06b6d4]';
  let suspicionTextColor = 'text-cyan-400';
  if (suspicion >= 70) {
    suspicionColor = 'bg-rose-500 shadow-[0_0_12px_#f43f5e]';
    suspicionTextColor = 'text-rose-400';
  } else if (suspicion >= 40) {
    suspicionColor = 'bg-amber-400 shadow-[0_0_10px_#fbbf24]';
    suspicionTextColor = 'text-amber-400';
  }

  const handleHomeClick = () => {
    sound.playClick();
    onGoHome();
  };

  return (
    <header className="relative z-20 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md px-4 py-2.5 sm:px-8 shadow-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        {/* Brand Zone with Clickable Handcrafted Logo */}
        <button
          onClick={handleHomeClick}
          title="Return to Main Page"
          className="flex items-center gap-3 shrink-0 text-left transition-opacity hover:opacity-90 cursor-pointer focus:outline-none"
        >
          <Logo size="md" showWordmark={true} />
        </button>

        {/* Center Zone: Tactical Protocol Progression & Meters */}
        <div className="flex items-center gap-3 sm:gap-7 shrink-0">
          {/* Active Gate Protocol Badges (All 5 Checks) */}
          <div className="hidden lg:flex items-center gap-1 font-mono text-[10px]">
            <span
              className={`px-1.5 py-0.5 rounded transition-colors ${
                gateIndex === 1 && (isPlayingGate || stage.includes('RESULT'))
                  ? 'bg-cyan-950 border border-cyan-500 text-cyan-300 font-bold'
                  : gateIndex > 1
                  ? 'bg-slate-900 text-emerald-400 line-through'
                  : 'bg-slate-900/60 text-slate-500'
              }`}
            >
              01. Checkbox
            </span>
            <span className="text-slate-600">→</span>
            <span
              className={`px-1.5 py-0.5 rounded transition-colors ${
                gateIndex === 2 && (isPlayingGate || stage.includes('RESULT'))
                  ? 'bg-cyan-950 border border-cyan-500 text-cyan-300 font-bold'
                  : gateIndex > 2
                  ? 'bg-slate-900 text-emerald-400 line-through'
                  : 'bg-slate-900/60 text-slate-500'
              }`}
            >
              02. Puzzle
            </span>
            <span className="text-slate-600">→</span>
            <span
              className={`px-1.5 py-0.5 rounded transition-colors ${
                gateIndex === 3 && (isPlayingGate || stage.includes('RESULT'))
                  ? 'bg-cyan-950 border border-cyan-500 text-cyan-300 font-bold'
                  : gateIndex > 3
                  ? 'bg-slate-900 text-emerald-400 line-through'
                  : 'bg-slate-900/60 text-slate-500'
              }`}
            >
              03. Traffic
            </span>
            <span className="text-slate-600">→</span>
            <span
              className={`px-1.5 py-0.5 rounded transition-colors ${
                gateIndex === 4 && (isPlayingGate || stage.includes('RESULT'))
                  ? 'bg-cyan-950 border border-cyan-500 text-cyan-300 font-bold'
                  : gateIndex > 4
                  ? 'bg-slate-900 text-emerald-400 line-through'
                  : 'bg-slate-900/60 text-slate-500'
              }`}
            >
              04. Click Spot
            </span>
            <span className="text-slate-600">→</span>
            <span
              className={`px-1.5 py-0.5 rounded transition-colors ${
                gateIndex === 5 && (isPlayingGate || stage.includes('RESULT'))
                  ? 'bg-cyan-950 border border-cyan-500 text-cyan-300 font-bold'
                  : 'bg-slate-900/60 text-slate-500'
              }`}
            >
              05. Reaction
            </span>
          </div>

          {/* Compact Gate Indicator for Mobile */}
          <div className="flex lg:hidden items-center font-mono text-xs font-bold px-2 py-1 rounded bg-slate-900 border border-slate-800 text-cyan-400">
            CHECK 0{gateIndex} / 05
          </div>

          {/* Countdown Clock */}
          {isPlayingGate && (
            <div className="flex flex-col items-center">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-mono font-semibold flex items-center gap-1">
                <Clock className="w-2.5 h-2.5" /> Time
              </span>
              <div
                className={`mt-0.5 flex items-center gap-1 font-mono text-xs sm:text-sm font-bold tabular-nums px-2 py-0.5 rounded border transition-colors ${
                  isUrgent
                    ? 'border-rose-500 bg-rose-950/80 text-rose-300 shadow-[0_0_12px_#f43f5e] animate-pulse'
                    : 'border-slate-800 bg-slate-900 text-slate-100'
                }`}
              >
                <span>{timeLeft.toFixed(1)}</span>
                <span className="text-[10px] text-slate-400">s</span>
              </div>
            </div>
          )}

          {/* Suspicion Meter */}
          <div className="flex flex-col gap-1 w-20 sm:w-32">
            <div className="flex items-center justify-between text-[10px]">
              <span className="uppercase tracking-wider text-slate-400 font-mono font-semibold flex items-center gap-1">
                <ShieldAlert className="w-2.5 h-2.5 text-slate-400" /> Suspicion
              </span>
              <span className={`font-mono font-bold tabular-nums ${suspicionTextColor}`}>
                {Math.round(suspicion)}%
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded bg-slate-900 border border-slate-800">
              <div
                className={`h-full rounded transition-all duration-300 ${suspicionColor}`}
                style={{ width: `${Math.min(100, Math.max(0, suspicion))}%` }}
              />
            </div>
          </div>

          {/* Lives Indicator */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-mono font-semibold">
              Lives
            </span>
            <div className="flex items-center gap-1 mt-0.5">
              {Array.from({ length: maxLives }).map((_, i) => (
                <Heart
                  key={i}
                  className={`w-3.5 h-3.5 transition-all duration-300 ${
                    i < lives
                      ? 'fill-rose-500 text-rose-400 drop-shadow-[0_0_6px_rgba(244,63,94,0.7)]'
                      : 'text-slate-800 fill-slate-950 opacity-30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Zone: Home Button & Audio Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Home Button (Available during gameplay or results) */}
          {isNotOnStart && (
            <button
              onClick={handleHomeClick}
              title="Return to Main Menu"
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/90 px-2.5 py-1.5 text-xs font-mono font-bold text-slate-200 transition-all hover:border-cyan-400 hover:text-cyan-300 hover:shadow-[0_0_10px_rgba(6,182,212,0.3)] active:scale-95 cursor-pointer"
            >
              <Home className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Home</span>
            </button>
          )}

          {/* Sound Toggle Button */}
          <button
            onClick={onToggleMute}
            aria-label={isMuted ? 'Unmute sound' : 'Mute sound'}
            title={isMuted ? 'Unmute' : 'Mute'}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300 transition-all hover:border-cyan-500/60 hover:text-cyan-300 cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
