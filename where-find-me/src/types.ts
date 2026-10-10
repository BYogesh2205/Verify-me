export interface MousePoint {
  x: number;
  y: number;
  t: number;
}

export type GameStage =
  | 'START'
  | 'GATE1'
  | 'GATE1_RESULT'
  | 'GATE2'
  | 'GATE2_RESULT'
  | 'GATE3'
  | 'GATE3_RESULT'
  | 'GATE4'
  | 'GATE4_RESULT'
  | 'GATE5'
  | 'GATE5_RESULT'
  | 'GAME_OVER'
  | 'VICTORY';

export interface ScoreBreakdown {
  humanScore: number; // 0 to 100
  curvatureScore: number;
  jitterScore: number;
  offsetScore: number;
  speedVarianceScore: number;
  timeScore: number;

  // The 5 Formal Biometric Verification Checks
  check1Name: string; // 'Check 1: Path Curvature & Non-Linearity'
  check1Score: number;
  check1Verdict: string;

  check2Name: string; // 'Check 2: Micro-Tremor Neuromuscular Jitter'
  check2Score: number;
  check2Verdict: string;

  check3Name: string; // 'Check 3: Velocity & Acceleration Variance'
  check3Score: number;
  check3Verdict: string;

  check4Name: string; // 'Check 4: Is Click Spot Worth 20 Points'
  check4Points: number; // 0 to 20 points
  check4Verdict: string;
  clickSpotPoints: number;
  clickSpotVerdict: string;

  check5Name: string; // 'Check 5: Why Is Reaction Timer Worth 20 Points'
  check5Points: number; // 0 to 20 points
  check5Verdict: string;
  reactionTimerPoints: number;
  reactionTimerVerdict: string;
  reactionTimeMs: number;

  rawCurvatureRatio: number;
  rawTotalPathPx: number;
  rawStraightDistancePx: number;
  rawJitterRad: number;
  rawOffsetPx: number;
  rawAvgSpeedPxMs: number;
  durationMs: number;
  passed: boolean;
  pathPoints: MousePoint[];
  startPoint: { x: number; y: number };
  targetPoint: { x: number; y: number };
  gateName: string;
  gateIndex: number; // 1, 2, 3
  feedbackReason: string;
}

export interface GateConfig {
  id: number;
  name: string;
  title: string;
  subtitle: string;
  durationSeconds: number;
  passThreshold: number;
}
