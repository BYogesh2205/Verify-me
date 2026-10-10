import { MousePoint, ScoreBreakdown } from '../types';

export function evaluateMouseTrajectory(
  points: MousePoint[],
  targetPoint: { x: number; y: number },
  clickPoint: { x: number; y: number },
  gateIndex: number = 1,
  gateStartTime?: number
): ScoreBreakdown {
  const defaultGateStart = points.length > 0 ? points[0].t - 250 : performance.now() - 300;
  const actualStartTime = gateStartTime ?? defaultGateStart;

  if (points.length < 2) {
    // Virtually no motion recorded before clicking -> fast instant click -> under 30!
    const reactionTimeMs = Math.max(10, Math.round(points.length === 1 ? points[0].t - actualStartTime : 35));
    const rawOffsetPx = Math.hypot(clickPoint.x - targetPoint.x, clickPoint.y - targetPoint.y);

    // Check 4: Is Click Spot Worth 20 Points
    const clickSpotPoints = rawOffsetPx < 1.8 ? 0 : rawOffsetPx < 3.2 ? 1 : 15;
    const clickSpotVerdict =
      clickSpotPoints === 0
        ? 'Clicking exact center gets 0 points (0 / 20 pts)'
        : clickSpotPoints === 1
        ? 'Clicking a little off-center gets 1 point (1 / 20 pts)'
        : 'Off-center click (15 / 20 pts)';

    // Check 5: Why Is Reaction Timer Worth 20 Points
    const reactionTimerPoints = reactionTimeMs < 50 ? 0 : reactionTimeMs >= 200 && reactionTimeMs <= 500 ? 20 : 12;
    const reactionTimerVerdict =
      reactionTimerPoints === 0
        ? 'Moving is under 50 ms gets 0 points (0 / 20 pts)'
        : reactionTimerPoints === 20
        ? 'Starting between 200 and 500 ms gets full points (20 / 20 pts)'
        : `${reactionTimeMs} ms reaction latency (${reactionTimerPoints} / 20 pts)`;

    return {
      humanScore: 12,
      curvatureScore: 8,
      jitterScore: 10,
      offsetScore: 10,
      speedVarianceScore: 10,
      timeScore: 10,

      check1Name: 'Check 1: Path Curvature & Non-Linearity',
      check1Score: 8,
      check1Verdict: 'Linear vector (8 / 100)',

      check2Name: 'Check 2: Micro-Tremor Hand Jitter',
      check2Score: 10,
      check2Verdict: 'Zero muscle tremor (10 / 100)',

      check3Name: 'Check 3: Velocity & Speed Variance',
      check3Score: 10,
      check3Verdict: 'Zero acceleration deviation (10 / 100)',

      check4Name: 'Check 4: Is Click Spot Worth 20 Points',
      check4Points: clickSpotPoints,
      check4Verdict: clickSpotVerdict,
      clickSpotPoints,
      clickSpotVerdict,

      check5Name: 'Check 5: Why Is Reaction Timer Worth 20 Points',
      check5Points: reactionTimerPoints,
      check5Verdict: reactionTimerVerdict,
      reactionTimerPoints,
      reactionTimerVerdict,
      reactionTimeMs,

      rawCurvatureRatio: 1.0,
      rawTotalPathPx: 0,
      rawStraightDistancePx: 0,
      rawJitterRad: 0,
      rawOffsetPx: Number(rawOffsetPx.toFixed(1)),
      rawAvgSpeedPxMs: 0,
      durationMs: 40,
      passed: false,
      pathPoints: points.length === 1
        ? [points[0], { ...clickPoint, t: points[0].t + 40 }]
        : [{ ...clickPoint, t: 0 }, { ...clickPoint, t: 40 }],
      startPoint: points[0] || clickPoint,
      targetPoint,
      gateName:
        gateIndex === 1
          ? 'Checkbox Verification'
          : gateIndex === 2
          ? 'Puzzle Alignment'
          : gateIndex === 3
          ? 'Traffic Light Grid'
          : gateIndex === 4
          ? 'Is Click Spot Worth 20 Points'
          : 'Why Is Reaction Timer Worth 20 Points',
      gateIndex,
      feedbackReason: 'Instantaneous click with zero trajectory. Automated script detected.',
    };
  }

  const startPoint = { x: points[0].x, y: points[0].y };
  const durationMs = Math.max(1, points[points.length - 1].t - points[0].t);
  const reactionTimeMs = Math.max(10, Math.round(points[0].t - actualStartTime));

  // 1. Calculate Path Curvature / Tortuosity
  let totalPathDistance = 0;
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x;
    const dy = points[i].y - points[i - 1].y;
    totalPathDistance += Math.hypot(dx, dy);
  }

  const straightDistance = Math.hypot(clickPoint.x - startPoint.x, clickPoint.y - startPoint.y);
  const curvatureRatio = straightDistance > 5 ? totalPathDistance / straightDistance : 1.0;

  // 2. Micro-tremor / Direction Jitter & Velocity
  let angularDeviations: number[] = [];
  let speeds: number[] = [];

  for (let i = 1; i < points.length; i++) {
    const dt = Math.max(1, points[i].t - points[i - 1].t);
    const dist = Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
    speeds.push(dist / dt);

    if (i >= 2) {
      const v1x = points[i - 1].x - points[i - 2].x;
      const v1y = points[i - 1].y - points[i - 2].y;
      const v2x = points[i].x - points[i - 1].x;
      const v2y = points[i].y - points[i - 1].y;

      const mag1 = Math.hypot(v1x, v1y);
      const mag2 = Math.hypot(v2x, v2y);

      if (mag1 > 1.2 && mag2 > 1.2) {
        const angle1 = Math.atan2(v1y, v1x);
        const angle2 = Math.atan2(v2y, v2x);
        let diff = Math.abs(angle2 - angle1);
        if (diff > Math.PI) diff = 2 * Math.PI - diff;
        angularDeviations.push(diff);
      }
    }
  }

  const avgAngularDeviation = angularDeviations.length > 0
    ? angularDeviations.reduce((a, b) => a + b, 0) / angularDeviations.length
    : 0;

  const avgSpeed = speeds.length > 0
    ? speeds.reduce((a, b) => a + b, 0) / speeds.length
    : 0;

  const speedVariance = speeds.length > 0
    ? speeds.reduce((acc, s) => acc + Math.pow(s - avgSpeed, 2), 0) / speeds.length
    : 0;

  // 3. Offset from target center
  const rawOffsetPx = Math.hypot(clickPoint.x - targetPoint.x, clickPoint.y - targetPoint.y);

  // USER CHECK 4: "Is Click Spot Worth 20 Points"
  // - Clicking the exact center gets 0.
  // - Clicking a little off-center gets 1 point.
  // - Natural off-center gets up to 20 points.
  let clickSpotPoints = 0;
  let clickSpotVerdict = '';

  if (rawOffsetPx < 1.8) {
    clickSpotPoints = 0; // Clicking exact center gets 0!
    clickSpotVerdict = 'Clicking exact center gets 0 points (0 / 20 pts) · Synthetic accuracy';
  } else if (rawOffsetPx < 3.2) {
    clickSpotPoints = 1; // Clicking a little off-center gets 1 point!
    clickSpotVerdict = 'Clicking a little off-center gets 1 point (1 / 20 pts)';
  } else if (rawOffsetPx < 5.0) {
    clickSpotPoints = 10;
    clickSpotVerdict = 'Moderate offset (10 / 20 pts) · Human zone';
  } else if (rawOffsetPx <= 14.0) {
    clickSpotPoints = 20; // Natural organic offset gets full 20 points!
    clickSpotVerdict = 'Natural organic offset (20 / 20 pts) · Full points';
  } else {
    clickSpotPoints = 14;
    clickSpotVerdict = 'Outer landing (14 / 20 pts)';
  }

  // USER CHECK 5: "Why Is Reaction Timer Worth 20 Points"
  // - Moving is under 50 ms gets 0.
  // - Starting between 200 and 500 ms gets full points.
  let reactionTimerPoints = 0;
  let reactionTimerVerdict = '';

  if (reactionTimeMs < 50) {
    reactionTimerPoints = 0; // Moving under 50 ms gets 0!
    reactionTimerVerdict = `Moving is under 50 ms gets 0 points (${reactionTimeMs} ms) (0 / 20 pts)`;
  } else if (reactionTimeMs >= 200 && reactionTimeMs <= 500) {
    reactionTimerPoints = 20; // Starting between 200 and 500 ms gets full points!
    reactionTimerVerdict = `Starting between 200 and 500 ms gets full points (${reactionTimeMs} ms) (20 / 20 pts)`;
  } else if (reactionTimeMs >= 50 && reactionTimeMs < 200) {
    const ratio = (reactionTimeMs - 50) / 150;
    reactionTimerPoints = Math.round(1 + ratio * 15);
    reactionTimerVerdict = `Fast reflex (${reactionTimeMs} ms) (${reactionTimerPoints} / 20 pts)`;
  } else {
    reactionTimerPoints = 16;
    reactionTimerVerdict = `Deliberate reaction (${reactionTimeMs} ms) (16 / 20 pts)`;
  }

  // Subscore: Curvature (0 - 100)
  let curvatureScore = 15;
  if (curvatureRatio <= 1.03) {
    curvatureScore = 10;
  } else if (curvatureRatio <= 1.08) {
    curvatureScore = 22;
  } else if (curvatureRatio <= 1.15) {
    curvatureScore = 45;
  } else if (curvatureRatio <= 2.2) {
    curvatureScore = Math.round(75 + ((curvatureRatio - 1.15) / 1.05) * 25);
  } else {
    curvatureScore = 80;
  }

  // Subscore: Jitter / Tremor (0 - 100)
  let jitterScore = 15;
  if (avgAngularDeviation < 0.04) {
    jitterScore = 12;
  } else if (avgAngularDeviation < 0.10) {
    jitterScore = 35;
  } else if (avgAngularDeviation <= 0.8) {
    jitterScore = Math.min(100, Math.round(65 + (avgAngularDeviation / 0.8) * 35));
  } else {
    jitterScore = 75;
  }

  // Subscore: Target Offset (normalized from 20 points to 100)
  const offsetScore = Math.round((clickSpotPoints / 20) * 100);

  // Subscore: Speed Variance
  const speedVarianceScore = Math.min(100, Math.max(10, Math.round(speedVariance * 160 + 25)));

  // Subscore: Time Score (normalized from reaction points to 100)
  const timeScore = Math.round((reactionTimerPoints / 20) * 100);

  // Check 1 verdict
  const check1Verdict =
    curvatureRatio < 1.05
      ? `Straight linear line (${curvatureRatio}x) · Robot`
      : `Organic arc (${curvatureRatio}x) · Human`;

  // Check 2 verdict
  const check2Verdict =
    jitterScore < 30
      ? `Flat vector (score: ${jitterScore}%) · Robot`
      : `Living hand tremor (score: ${jitterScore}%) · Human`;

  // Check 3 verdict
  const check3Verdict =
    speedVarianceScore < 30
      ? `Uniform speed · Constant cadence`
      : `Variable biological speed · Dynamic pace`;

  // Base weighted score
  let calculatedScore =
    curvatureScore * 0.30 +
    jitterScore * 0.30 +
    offsetScore * 0.20 +
    timeScore * 0.20;

  calculatedScore = Math.round(calculatedScore);

  // EXPLICIT USER REQUIREMENTS:
  // 1. "A fast right move must score under 30."
  const isFastMove = durationMs < 650 || avgSpeed > 0.85 || reactionTimeMs < 100;
  const isStraightMove = curvatureRatio < 1.14 || avgAngularDeviation < 0.08;
  const isFastRightMove = isFastMove && (isStraightMove || durationMs < 450);

  // 2. "A slow messy move must score above 70."
  const isSlowMove = durationMs >= 750 && reactionTimeMs >= 150;
  const isMessyMove = curvatureRatio >= 1.20 && (avgAngularDeviation >= 0.08 || totalPathDistance > straightDistance + 25);
  const isSlowMessyMove = isSlowMove && isMessyMove;

  let finalHumanScore = calculatedScore;

  if (isFastRightMove) {
    // MUST score under 30!
    finalHumanScore = Math.min(28, Math.max(8, Math.round(calculatedScore * 0.4)));
    if (finalHumanScore >= 30) finalHumanScore = 27;
  } else if (isSlowMessyMove) {
    // MUST score above 70!
    finalHumanScore = Math.max(74, Math.min(98, Math.round(calculatedScore)));
  } else {
    finalHumanScore = Math.min(100, Math.max(8, calculatedScore));
  }

  const passed = finalHumanScore >= 50;

  let feedbackReason = '';
  if (isFastRightMove) {
    feedbackReason = 'Fast linear movement detected. Highly synthetic trajectory scored under 30.';
  } else if (isSlowMessyMove) {
    feedbackReason = 'Slow, organic, wobble-rich trajectory detected. Certified human movement above 70.';
  } else if (clickSpotPoints === 0 && reactionTimerPoints === 0) {
    feedbackReason = 'Check 4 (exact center = 0/20) & Check 5 (sub-50ms = 0/20) triggered. Robotic automation confirmed.';
  } else if (clickSpotPoints === 0) {
    feedbackReason = 'Check 4 failed: Exact center clicked (0/20 pts). Real humans land off-center.';
  } else if (reactionTimerPoints === 0) {
    feedbackReason = 'Check 5 failed: Sub-50ms reaction (0/20 pts). Inhuman response latency.';
  } else if (finalHumanScore < 50) {
    feedbackReason = 'Motion was slightly too direct or fast. Curve your mouse and start naturally.';
  } else {
    feedbackReason = 'Balanced human movement passing all 5 checks with authentic organic traits.';
  }

  return {
    humanScore: finalHumanScore,
    curvatureScore,
    jitterScore,
    offsetScore,
    speedVarianceScore,
    timeScore,

    check1Name: 'Check 1: Path Curvature & Non-Linearity',
    check1Score: curvatureScore,
    check1Verdict,

    check2Name: 'Check 2: Micro-Tremor Hand Jitter',
    check2Score: jitterScore,
    check2Verdict,

    check3Name: 'Check 3: Velocity & Speed Variance',
    check3Score: speedVarianceScore,
    check3Verdict,

    check4Name: 'Check 4: Is Click Spot Worth 20 Points',
    check4Points: clickSpotPoints,
    check4Verdict: clickSpotVerdict,
    clickSpotPoints,
    clickSpotVerdict,

    check5Name: 'Check 5: Why Is Reaction Timer Worth 20 Points',
    check5Points: reactionTimerPoints,
    check5Verdict: reactionTimerVerdict,
    reactionTimerPoints,
    reactionTimerVerdict,
    reactionTimeMs,

    rawCurvatureRatio: Number(curvatureRatio.toFixed(3)),
    rawTotalPathPx: Number(totalPathDistance.toFixed(1)),
    rawStraightDistancePx: Number(straightDistance.toFixed(1)),
    rawJitterRad: Number(avgAngularDeviation.toFixed(3)),
    rawOffsetPx: Number(rawOffsetPx.toFixed(1)),
    rawAvgSpeedPxMs: Number(avgSpeed.toFixed(2)),
    durationMs: Math.round(durationMs),
    passed,
    pathPoints: points,
    startPoint,
    targetPoint,
    gateName:
      gateIndex === 1
        ? 'Checkbox Verification'
        : gateIndex === 2
        ? 'Puzzle Alignment'
        : gateIndex === 3
        ? 'Traffic Light Grid'
        : gateIndex === 4
        ? 'Is Click Spot Worth 20 Points'
        : 'Why Is Reaction Timer Worth 20 Points',
    gateIndex,
    feedbackReason,
  };
}
