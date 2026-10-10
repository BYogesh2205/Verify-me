/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameStage, ScoreBreakdown } from './types';
import { sound } from './utils/audio';
import { MouseTrailCanvas } from './components/MouseTrailCanvas';
import { GlowingCursor } from './components/GlowingCursor';
import { TopBar } from './components/TopBar';
import { RobotMascot } from './components/RobotMascot';
import { StartScreen } from './components/StartScreen';
import { Gate1Checkbox } from './components/Gate1Checkbox';
import { Gate2Puzzle } from './components/Gate2Puzzle';
import { Gate3TrafficLight } from './components/Gate3TrafficLight';
import { Check4ClickSpot } from './components/Check4ClickSpot';
import { Check5ReactionTimer } from './components/Check5ReactionTimer';
import { PathComparisonModal } from './components/PathComparisonModal';
import { AccessDenied } from './components/AccessDenied';
import { WelcomeHuman } from './components/WelcomeHuman';

// Decreasing countdown timers per gate: each gate is strictly shorter than the last!
const GATE_TIMES: Record<number, number> = {
  1: 18,
  2: 13,
  3: 9,
  4: 7,
  5: 5,
};

export default function App() {
  const [stage, setStage] = useState<GameStage>('START');
  const [gateIndex, setGateIndex] = useState<number>(1);
  const [lives, setLives] = useState<number>(3);
  const [suspicion, setSuspicion] = useState<number>(10);
  const [timeLeft, setTimeLeft] = useState<number>(GATE_TIMES[1]);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentResult, setCurrentResult] = useState<ScoreBreakdown | null>(null);
  const [gateScores, setGateScores] = useState<number[]>([]);

  // Key to force-remount gate components when retrying
  const [gateKey, setGateKey] = useState<number>(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleToggleMute = useCallback(() => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  }, []);

  const handleLoseLife = useCallback(() => {
    sound.playLifeLost();
    setLives((prev) => {
      const nextLives = prev - 1;
      if (nextLives <= 0) {
        setSuspicion(100);
        setStage('GAME_OVER');
      } else {
        setSuspicion((s) => Math.min(95, s + 25));
      }
      return Math.max(0, nextLives);
    });
  }, []);

  // Timer loop for active gate gameplay (Supports Gates 1 through 5)
  useEffect(() => {
    const isPlaying =
      stage === 'GATE1' ||
      stage === 'GATE2' ||
      stage === 'GATE3' ||
      stage === 'GATE4' ||
      stage === 'GATE5';

    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const interval = 100;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.1) {
          clearInterval(timerRef.current as NodeJS.Timeout);

          // Life lost due to timeout
          sound.playLifeLost();
          setLives((l) => {
            const nextL = l - 1;
            if (nextL <= 0) {
              setSuspicion(100);
              setStage('GAME_OVER');
            } else {
              setSuspicion((s) => Math.min(95, s + 28));
              setTimeLeft(GATE_TIMES[gateIndex] || 7);
              setGateKey((k) => k + 1);
            }
            return Math.max(0, nextL);
          });
          return 0;
        }

        // Urgent tick when under 3s
        if (prev <= 3 && Math.floor(prev * 10) % 5 === 0) {
          sound.playTimerTick(true);
        }

        return Math.max(0, prev - 0.1);
      });
    }, interval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [stage, gateIndex]);

  // Start test from StartScreen
  const handleStartTest = () => {
    setLives(3);
    setGateIndex(1);
    setSuspicion(10);
    setTimeLeft(GATE_TIMES[1]);
    setGateScores([]);
    setCurrentResult(null);
    setGateKey((k) => k + 1);
    setStage('GATE1');
  };

  // Play Again from Game Over or Victory: resets lives and scores completely
  const handlePlayAgain = () => {
    setLives(3);
    setGateIndex(1);
    setSuspicion(10);
    setTimeLeft(GATE_TIMES[1]);
    setGateScores([]);
    setCurrentResult(null);
    setGateKey((k) => k + 1);
    setStage('START');
  };

  // Gate 1 Complete (Checkbox)
  const handleGate1Complete = (result: ScoreBreakdown) => {
    setCurrentResult(result);
    setStage('GATE1_RESULT');

    if (result.passed) {
      setGateScores([result.humanScore]);
      setSuspicion((s) => Math.max(5, s - 12));
    } else {
      handleLoseLife();
    }
  };

  // Gate 2 Complete (Puzzle Drag)
  const handleGate2Complete = (result: ScoreBreakdown) => {
    setCurrentResult(result);
    setStage('GATE2_RESULT');

    if (result.passed) {
      setGateScores((prev) => [prev[0] ?? 70, result.humanScore]);
      setSuspicion((s) => Math.max(5, s - 10));
    } else {
      handleLoseLife();
    }
  };

  // Gate 3 Complete (Traffic Grid)
  const handleGate3Complete = (result: ScoreBreakdown) => {
    setCurrentResult(result);
    setStage('GATE3_RESULT');

    if (result.passed) {
      setGateScores((prev) => [prev[0] ?? 70, prev[1] ?? 75, result.humanScore]);
      setSuspicion((s) => Math.max(0, s - 10));
    } else {
      handleLoseLife();
    }
  };

  // Gate 4 Complete (Check 4: Is Click Spot Worth 20 Points)
  const handleGate4Complete = (result: ScoreBreakdown) => {
    setCurrentResult(result);
    setStage('GATE4_RESULT');

    if (result.passed) {
      setGateScores((prev) => [
        prev[0] ?? 70,
        prev[1] ?? 75,
        prev[2] ?? 80,
        result.humanScore,
      ]);
      setSuspicion((s) => Math.max(0, s - 12));
    } else {
      handleLoseLife();
    }
  };

  // Gate 5 Complete (Check 5: Why Is Reaction Timer Worth 20 Points)
  const handleGate5Complete = (result: ScoreBreakdown) => {
    setCurrentResult(result);
    setStage('GATE5_RESULT');

    if (result.passed) {
      setGateScores((prev) => [
        prev[0] ?? 70,
        prev[1] ?? 75,
        prev[2] ?? 80,
        prev[3] ?? 85,
        result.humanScore,
      ]);
      setSuspicion(0);
    } else {
      handleLoseLife();
    }
  };

  // Try Again on Result Screen: resets current gate cleanly
  const handleTryAgainCurrentGate = () => {
    if (lives <= 0) {
      setStage('GAME_OVER');
      return;
    }

    setGateKey((k) => k + 1);
    if (gateIndex === 1) {
      setTimeLeft(GATE_TIMES[1]);
      setStage('GATE1');
    } else if (gateIndex === 2) {
      setTimeLeft(GATE_TIMES[2]);
      setStage('GATE2');
    } else if (gateIndex === 3) {
      setTimeLeft(GATE_TIMES[3]);
      setStage('GATE3');
    } else if (gateIndex === 4) {
      setTimeLeft(GATE_TIMES[4]);
      setStage('GATE4');
    } else if (gateIndex === 5) {
      setTimeLeft(GATE_TIMES[5]);
      setStage('GATE5');
    }
  };

  // Next Gate on Result Screen: Advances smoothly through all 5 Gates to VICTORY
  const handleNextFromGateResult = () => {
    if (currentResult && !currentResult.passed) {
      handleTryAgainCurrentGate();
      return;
    }

    setGateKey((k) => k + 1);
    if (gateIndex === 1) {
      setGateIndex(2);
      setTimeLeft(GATE_TIMES[2]);
      setStage('GATE2');
    } else if (gateIndex === 2) {
      setGateIndex(3);
      setTimeLeft(GATE_TIMES[3]);
      setStage('GATE3');
    } else if (gateIndex === 3) {
      setGateIndex(4);
      setTimeLeft(GATE_TIMES[4]);
      setStage('GATE4');
    } else if (gateIndex === 4) {
      setGateIndex(5);
      setTimeLeft(GATE_TIMES[5]);
      setStage('GATE5');
    } else if (gateIndex === 5) {
      setStage('VICTORY');
    }
  };

  // Redirect to main page of the game
  const handleGoHome = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setLives(3);
    setGateIndex(1);
    setSuspicion(10);
    setTimeLeft(GATE_TIMES[1]);
    setGateScores([]);
    setCurrentResult(null);
    setGateKey((k) => k + 1);
    setStage('START');
  }, []);

  const finalScore =
    gateScores.length > 0
      ? Math.round(gateScores.reduce((a, b) => a + b, 0) / gateScores.length)
      : 85;

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between bg-lab-terminal text-slate-100 overflow-x-hidden selection:bg-cyan-500 selection:text-slate-950">
      {/* Custom Glowing Cursor with Outer Reticle Ring */}
      <GlowingCursor />

      {/* 1-Second Glowing Cyan Laser Trail */}
      <MouseTrailCanvas />

      {/* Top Bar Navigation with Handcrafted Logo and Home button */}
      <TopBar
        stage={stage}
        gateIndex={gateIndex}
        lives={lives}
        maxLives={3}
        suspicion={suspicion}
        timeLeft={timeLeft}
        maxTime={GATE_TIMES[gateIndex] || 18}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onGoHome={handleGoHome}
      />

      {/* Main Testing Chamber */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-3 sm:p-6 w-full max-w-5xl mx-auto">
        {/* Screen 1: Start Screen */}
        {stage === 'START' && (
          <StartScreen onStart={handleStartTest} lives={lives} />
        )}

        {/* Gate 1: Checkbox */}
        {stage === 'GATE1' && (
          <Gate1Checkbox key={`gate1-${gateKey}`} onComplete={handleGate1Complete} />
        )}

        {/* Gate 1 Result */}
        {stage === 'GATE1_RESULT' && currentResult && (
          <PathComparisonModal
            result={currentResult}
            onTryAgain={handleTryAgainCurrentGate}
            onNext={handleNextFromGateResult}
          />
        )}

        {/* Gate 2: Puzzle Drag */}
        {stage === 'GATE2' && (
          <Gate2Puzzle key={`gate2-${gateKey}`} onComplete={handleGate2Complete} />
        )}

        {/* Gate 2 Result */}
        {stage === 'GATE2_RESULT' && currentResult && (
          <PathComparisonModal
            result={currentResult}
            onTryAgain={handleTryAgainCurrentGate}
            onNext={handleNextFromGateResult}
          />
        )}

        {/* Gate 3: Traffic Lights Grid */}
        {stage === 'GATE3' && (
          <Gate3TrafficLight key={`gate3-${gateKey}`} onComplete={handleGate3Complete} />
        )}

        {/* Gate 3 Result */}
        {stage === 'GATE3_RESULT' && currentResult && (
          <PathComparisonModal
            result={currentResult}
            onTryAgain={handleTryAgainCurrentGate}
            onNext={handleNextFromGateResult}
          />
        )}

        {/* Gate 4: Check 4 (Is Click Spot Worth 20 Points) */}
        {stage === 'GATE4' && (
          <Check4ClickSpot key={`gate4-${gateKey}`} onComplete={handleGate4Complete} />
        )}

        {/* Gate 4 Result */}
        {stage === 'GATE4_RESULT' && currentResult && (
          <PathComparisonModal
            result={currentResult}
            onTryAgain={handleTryAgainCurrentGate}
            onNext={handleNextFromGateResult}
          />
        )}

        {/* Gate 5: Check 5 (Why Is Reaction Timer Worth 20 Points) */}
        {stage === 'GATE5' && (
          <Check5ReactionTimer key={`gate5-${gateKey}`} onComplete={handleGate5Complete} />
        )}

        {/* Gate 5 Result */}
        {stage === 'GATE5_RESULT' && currentResult && (
          <PathComparisonModal
            result={currentResult}
            onTryAgain={handleTryAgainCurrentGate}
            onNext={handleNextFromGateResult}
          />
        )}

        {/* Game Over: Access Denied */}
        {stage === 'GAME_OVER' && (
          <AccessDenied
            failedGateIndex={gateIndex}
            onRestart={handlePlayAgain}
          />
        )}

        {/* Victory: Welcome Human */}
        {stage === 'VICTORY' && (
          <WelcomeHuman
            finalScore={finalScore}
            gateScores={gateScores}
            onPlayAgain={handlePlayAgain}
          />
        )}
      </main>

      {/* Animated Robot Mascot (Unit-707) with dynamic eye tracking and commentary */}
      <footer className="w-full pb-3">
        <RobotMascot
          stage={stage}
          suspicion={suspicion}
          lastResult={currentResult}
          gateIndex={gateIndex}
        />
      </footer>
    </div>
  );
}
