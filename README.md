# Verify Me

> **Reverse-CAPTCHA Biometric Verification Challenge**  
> *Prove your organic, messy humanity to security algorithms that detect synthetic perfection.*

---

## 📖 Overview

**Verify Me** is an interactive, satirical reverse-CAPTCHA game where automated security systems suspect you of being an AI bot. Standard CAPTCHAs test whether you can recognize distorted letters or click traffic lights; **Verify Me** tests **how** you move your mouse.

If your movements are mathematically optimal, laser-straight, or instantaneous, you score **under 30** and are flagged as an automated script. To earn your official **Certificate of Humanity**, you must score **70 or higher** across 5 increasingly stringent verification gates by exhibiting genuine human imperfections: micro-tremors, organic curved paths, natural hesitations, and realistic physiological reaction times.

---

## 🎮 Core Scoring Rules

Security algorithms analyze trajectory kinematics, velocity profiles, and click accuracy:

| Metric | Bot Behavior (Score < 30) | Human Behavior (Score ≥ 70) |
| :--- | :--- | :--- |
| **Path Curvature** | Perfectly straight vectors ($R^2 \approx 1.0$) | Smooth, organic arcs with natural deviation |
| **Speed Variance** | Uniform velocity or instant jumps ($0\text{ ms}$) | Acceleration, cruise phase, and deceleration |
| **Micro-Tremor (Jitter)** | Zero jitter ($0.0\text{ px}$ variance) | Natural hand wobble ($1\text{–}6\text{ px}$) |
| **Click Spot Precision** | Exact mathematical center | Organic displacement off center |
| **Reaction Delay** | Sub-human reaction ($< 50\text{ ms}$) | Neurological reflex window ($200\text{–}500\text{ ms}$) |

* **Pass Threshold:** $\ge 70\%$ human confidence score per gate.
* **Failure Penalty:** Failing a gate or letting the timer expire consumes 1 of your **3 Lives**.

---

## 🚪 The 5 Verification Gates

### 1. Gate 1: Checkbox Verification *(18s Limit)*
* **Challenge:** Click the standard *"I am not a robot"* checkbox.
* **Tactic:** Avoid snapping straight to the box. Guide the cursor along a natural curve with slight human deceleration.

### 2. Gate 2: Puzzle Piece Alignment *(13s Limit)*
* **Challenge:** Drag a missing puzzle slider piece into the matching cutout.
* **Tactic:** Bots drag with constant velocity. Humans hesitate, correct their trajectory, and settle the piece gently.

### 3. Gate 3: Traffic Light Grid *(9s Limit)*
* **Challenge:** Identify and select all traffic light images in a $3 \times 3$ grid before clicking Verify.
* **Tactic:** Human visual scanning produces natural arcs and brief pauses between tile selections.

### 4. Gate 4: "Is Click Spot Worth 20 Points" *(7s Limit)*
* **Challenge:** Biometric target calibration reticle measuring click coordinate variance.
* **Specific Rules:**
  * **Exact Center Click ($< 1.8\text{ px}$):** **0 points** *(flagged as synthetic zero-variance script)*.
  * **Little Off-Center Click ($1.8\text{ – }4.0\text{ px}$):** **1 point**.
  * **Human Variance Zone ($4.0\text{ – }15.0\text{ px}$):** Full **20 points** awarded for human calibration.

### 5. Gate 5: "Why Is Reaction Timer Worth 20 Points" *(5s Limit)*
* **Challenge:** Sudden synapse trigger test evaluating physical reflex latency.
* **Specific Rules:**
  * **Movement under $50\text{ ms}$:** **0 points** *(flagged as automated macro / impossible biological reflex)*.
  * **Reaction between $200\text{ ms}$ and $500\text{ ms}$:** Full **20 points** *(natural human neurological reaction window)*.
  * Complete the path to the authentication node with organic hand wobble to clear the gate!

---

## 🌟 Key Features

* **Real-Time Trajectory Visualization:** Live canvas captures every cursor coordinate, velocity delta, and jitter metric.
* **Post-Gate Biometric Audit:** Inspect your raw performance numbers side-by-side with synthetic bot paths.
* **Robot Supervisor Unit-707:** Interactive AI overseer that provides witty dialogue, hints, and suspicious glances.
* **Sound Synthesizer (Web Audio API):** Custom synthesized audio feedback for ticks, clicks, pass chimes, and alert buzzers (with mute toggle).
* **Glowing Cursor Trail:** Custom cursor equipped with kinetic particle tail physics.
* **Official Certificate of Humanity:** Complete all 5 gates to generate your cryptographically styled verification certificate with grade tiers (S-Tier Organic Human, A-Tier Verified Biped).
* **Game Navigation:** Accessible **Home** button on every stage, persistent lives tracking, and gate restart controls.

---

## 🛠️ Tech Stack

* **Framework:** React 19 + TypeScript
* **Build Tool:** Vite 8
* **Styling:** Tailwind CSS v4
* **Icons:** Lucide React
* **Audio:** Web Audio API (Synthesized Oscillators)
* **Graphics:** HTML5 2D Canvas API

---

## 🚀 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* [npm](https://www.npmjs.com/) or [bun](https://bun.sh/)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd verify-me
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build & Production

To create a production build:
```bash
npm run build
```

To run TypeScript verification:
```bash
npm run lint
```

---

## 📂 Project Structure

```text
├── index.html                   # HTML entry point with metadata & fonts
├── metadata.json                # AI Studio application metadata
├── package.json                 # Dependencies & build scripts
├── vite.config.ts               # Vite configuration
└── src/
    ├── App.tsx                  # Main game state orchestrator (stages & scoring)
    ├── main.tsx                 # React DOM mount point
    ├── types.ts                 # TypeScript interfaces, types & thresholds
    ├── components/
    │   ├── TopBar.tsx           # Header with logo, 5 gate badges, timer & lives
    │   ├── StartScreen.tsx      # Welcome splash screen with rules & docket
    │   ├── Gate1Checkbox.tsx    # Gate 1: Checkbox verification challenge
    │   ├── Gate2Puzzle.tsx      # Gate 2: Puzzle slider alignment challenge
    │   ├── Gate3TrafficLight.tsx# Gate 3: Traffic light grid challenge
    │   ├── Check4ClickSpot.tsx  # Gate 4: "Is Click Spot Worth 20 Points"
    │   ├── Check5ReactionTimer.tsx# Gate 5: "Why Is Reaction Timer Worth 20 Points"
    │   ├── PathComparisonModal.tsx# Detailed post-gate biometric breakdown
    │   ├── AccessDenied.tsx     # Game over screen with retry options
    │   ├── WelcomeHuman.tsx     # Final Human Being Certificate screen
    │   ├── RobotMascot.tsx      # Unit-707 assistant avatar with reactive dialogue
    │   ├── MouseTrailCanvas.tsx # Real-time cursor trail renderer
    │   └── CustomCursor.tsx     # Custom glowing cursor physics
    └── utils/
        ├── audio.ts             # Web Audio API sound synthesizer
        └── scoring.ts           # Inverse Turing biometric trajectory algorithms
```

---

## 📄 License

Apache-2.0
