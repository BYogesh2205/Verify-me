import React, { useEffect, useState, useRef } from 'react';
import { GameStage, ScoreBreakdown } from '../types';

interface RobotMascotProps {
  stage: GameStage;
  suspicion: number;
  lastResult: ScoreBreakdown | null;
  gateIndex: number;
}

export const RobotMascot: React.FC<RobotMascotProps> = ({
  stage,
  suspicion,
  lastResult,
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [blink, setBlink] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Track mouse for pupil tracking
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = (e.clientX - centerX) / (window.innerWidth / 2);
      const dy = (e.clientY - centerY) / (window.innerHeight / 2);
      setMousePos({
        x: Math.max(-1, Math.min(1, dx)),
        y: Math.max(-1, Math.min(1, dy)),
      });
    };

    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  // Blinking loop
  useEffect(() => {
    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 160);
    }, 3800);
    return () => clearInterval(interval);
  }, []);

  const getDialogue = (): string => {
    if (stage === 'START') {
      return 'Greetings entity. Fast straight moves score under 30. Slow messy moves score above 70.';
    }

    if (stage === 'GATE1') {
      if (suspicion > 60) {
        return 'WARNING: High suspicion! Move slower and introduce wobbles into your trajectory.';
      }
      return 'Gate 1: Click the checkbox. A fast straight move scores under 30. Wobble to score above 70!';
    }

    if (stage === 'GATE1_RESULT') {
      if (lastResult?.clickSpotPoints === 0 && lastResult?.reactionTimerPoints === 0) {
        return 'Exact center hit (0/20) and sub-50ms reaction (0/20)! Pure synthetic microcontroller behavior.';
      }
      if (lastResult?.clickSpotPoints === 0) {
        return 'Exact center clicked: 0/20 on Click Spot! Try clicking a little off-center for points.';
      }
      if (lastResult?.reactionTimerPoints === 0) {
        return 'Sub-50ms reaction: 0/20 on Reaction Timer! Human nerves take 200–500ms to fire.';
      }
      if (lastResult?.passed) {
        return `Human Score ${lastResult.humanScore}% verified! ${lastResult.clickSpotPoints}/20 Click Spot and ${lastResult.reactionTimerPoints}/20 Reaction Timer approved.`;
      }
      return `Too robotic! Score ${lastResult?.humanScore}%. Remember: slow down and curve naturally.`;
    }

    if (stage === 'GATE2') {
      return 'Gate 2: Drag the puzzle piece into the gap. Keep your drag slow and shaky!';
    }

    if (stage === 'GATE2_RESULT') {
      if (lastResult?.passed) {
        return `Puzzle drag cleared (${lastResult.humanScore}%)! Authentic human hand jitter detected.`;
      }
      return 'Straight-line drag detected! A robot slides without deviation. Wobble more on retry!';
    }

    if (stage === 'GATE3') {
      return 'Gate 3: Select all traffic lights and verify before time expires!';
    }

    if (stage === 'GATE3_RESULT') {
      if (lastResult?.passed) {
        return `Traffic grid passed (${lastResult.humanScore}%)! Organic visual saccades confirmed. Moving to Check 4!`;
      }
      return 'Failed grid check or too fast. Take an organic breath and retry!';
    }

    if (stage === 'GATE4') {
      return 'Check 4: Precision Target! Exact center gets 0 pts, little offset gets 1 pt, natural human offset gets 20 pts!';
    }

    if (stage === 'GATE4_RESULT') {
      if (lastResult?.clickSpotPoints === 0) {
        return 'Busted! You hit dead center (< 1.8px) like a cold mathematical bot (0/20 pts)!';
      }
      if (lastResult?.clickSpotPoints === 1) {
        return 'Minor deviation: 1/20 pts. Humans usually have more hand instability than that!';
      }
      if (lastResult?.passed) {
        return `Check 4 Cleared (${lastResult.humanScore}%)! Earned ${lastResult.clickSpotPoints}/20 Click Spot pts! Prepare for Reaction Test!`;
      }
      return `Target test failed (${lastResult?.humanScore}%). Remember: curve your cursor and land off-center!`;
    }

    if (stage === 'GATE5') {
      return 'Check 5: Synaptic Reflex! Wait for signal! Moving under 50ms gets 0 pts, starting between 200–500ms gets full 20 pts!';
    }

    if (stage === 'GATE5_RESULT') {
      if (lastResult?.reactionTimerPoints === 0) {
        return `Inhuman speed! ${lastResult?.reactionTimeMs}ms is under 50ms (0/20 pts). Only bots react that fast!`;
      }
      if (lastResult?.reactionTimerPoints === 20) {
        return `Brilliant! ${lastResult?.reactionTimeMs}ms reaction delay hits the golden human window (20/20 pts)!`;
      }
      if (lastResult?.passed) {
        return `Final Check 5 Passed (${lastResult.humanScore}%)! Authentic human neurobiology confirmed!`;
      }
      return `Reflex check failed (${lastResult?.humanScore}%). Take an organic breath and retry!`;
    }

    if (stage === 'GAME_OVER') {
      return 'ACCESS DENIED. Three failures logged. Synthetic entity identified.';
    }

    if (stage === 'VICTORY') {
      return 'WELCOME HUMAN. All 5 checks passed with certified biological messiness and neural latency!';
    }

    return 'Analyzing movement entropy...';
  };

  const isAlarmed = stage === 'GAME_OVER' || suspicion >= 75;
  const isHappy = stage === 'VICTORY' || (lastResult?.passed && stage.includes('RESULT'));
  const pupilOffsetX = mousePos.x * 3.5;
  const pupilOffsetY = mousePos.y * 2.5;

  return (
    <div
      ref={containerRef}
      className="relative z-20 mx-auto w-full max-w-4xl px-4 py-2 select-none"
    >
      {/* Flat solid container - Zero glows, Zero gradients */}
      <div className="flex items-center gap-3.5 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3">
        {/* Flat Robot Head */}
        <div className="relative flex h-13 w-13 shrink-0 items-center justify-center rounded bg-slate-950 border border-slate-700">
          {/* Antenna */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <div
              className={`h-2 w-2 rounded-full ${
                isAlarmed
                  ? 'bg-rose-500'
                  : isHappy
                  ? 'bg-emerald-400'
                  : 'bg-cyan-500'
              }`}
            />
            <div className="h-1.5 w-0.5 bg-slate-600" />
          </div>

          {/* Ears */}
          <div className="absolute -left-1 top-3.5 h-4 w-1 bg-slate-700" />
          <div className="absolute -right-1 top-3.5 h-4 w-1 bg-slate-700" />

          {/* Face Screen */}
          <div className="relative h-9 w-10 rounded bg-slate-900 border border-slate-800 flex flex-col items-center justify-center p-1">
            {/* Eyes */}
            <div className="flex w-full items-center justify-around px-1">
              <div
                className={`relative flex h-3 w-3 items-center justify-center rounded-full border border-slate-700 bg-slate-950 transition-all ${
                  blink ? 'scale-y-[0.1]' : ''
                }`}
              >
                <div
                  className={`h-1.5 w-1.5 rounded-full ${
                    isAlarmed
                      ? 'bg-rose-500'
                      : isHappy
                      ? 'bg-emerald-400'
                      : 'bg-cyan-400'
                  }`}
                  style={{
                    transform: `translate(${pupilOffsetX}px, ${pupilOffsetY}px)`,
                  }}
                />
              </div>

              <div
                className={`relative flex h-3 w-3 items-center justify-center rounded-full border border-slate-700 bg-slate-950 transition-all ${
                  blink ? 'scale-y-[0.1]' : ''
                }`}
              >
                <div
                  className={`h-1.5 w-1.5 rounded-full ${
                    isAlarmed
                      ? 'bg-rose-500'
                      : isHappy
                      ? 'bg-emerald-400'
                      : 'bg-cyan-400'
                  }`}
                  style={{
                    transform: `translate(${pupilOffsetX}px, ${pupilOffsetY}px)`,
                  }}
                />
              </div>
            </div>

            {/* Mouth */}
            <div className="mt-1 flex items-center justify-center">
              {isAlarmed ? (
                <div className="h-1 w-3 bg-rose-500" />
              ) : isHappy ? (
                <div className="h-1 w-3 rounded-b border-b-2 border-emerald-400" />
              ) : (
                <div className="h-0.5 w-3 bg-cyan-400" />
              )}
            </div>
          </div>
        </div>

        {/* Dialogue */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-wider">
              UNIT-707
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              [TRAJECTORY MONITOR]
            </span>
          </div>
          <p className="mt-0.5 text-xs sm:text-sm text-slate-200 leading-snug">
            "{getDialogue()}"
          </p>
        </div>
      </div>
    </div>
  );
};
