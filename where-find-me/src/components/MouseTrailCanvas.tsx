import React, { useEffect, useRef } from 'react';

interface TrailPoint {
  x: number;
  y: number;
  t: number;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  life: number;
  maxLife: number;
  size: number;
}

export const MouseTrailCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointsRef = useRef<TrailPoint[]>([]);
  const sparksRef = useRef<Spark[]>([]);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      const x = e.clientX;
      const y = e.clientY;

      pointsRef.current.push({ x, y, t: now });

      // Spawn subtle glowing cyan sparks on motion
      if (lastPosRef.current) {
        const dx = x - lastPosRef.current.x;
        const dy = y - lastPosRef.current.y;
        const dist = Math.hypot(dx, dy);

        if (dist > 8) {
          const count = Math.min(2, Math.floor(dist / 18) + 1);
          for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 0.7 + 0.2;
            sparksRef.current.push({
              x: x + (Math.random() - 0.5) * 4,
              y: y + (Math.random() - 0.5) * 4,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              alpha: 0.8,
              life: 0,
              maxLife: 20 + Math.random() * 15,
              size: Math.random() * 2 + 1,
            });
          }
        }
      }
      lastPosRef.current = { x, y };
    };

    window.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      const now = performance.now();
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Prune points older than 1000ms (1s fade)
      pointsRef.current = pointsRef.current.filter((p) => now - p.t <= 1000);
      const pts = pointsRef.current;

      // Draw Glowing Cyan Laser Trail
      if (pts.length >= 2) {
        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        for (let i = 1; i < pts.length; i++) {
          const p1 = pts[i - 1];
          const p2 = pts[i];
          const age = now - p2.t;
          const progress = Math.min(1, Math.max(0, age / 1000));
          const alpha = (1 - progress) * 0.85;

          if (alpha <= 0.01) continue;

          // Outer glowing aura
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.lineWidth = Math.max(1, 4 * (1 - progress));
          ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
          ctx.shadowColor = '#00f2fe';
          ctx.shadowBlur = 14 * (1 - progress);
          ctx.stroke();

          // Bright neon core line
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.lineWidth = Math.max(0.7, 1.8 * (1 - progress));
          ctx.strokeStyle = `rgba(224, 253, 255, ${alpha * 0.95})`;
          ctx.shadowBlur = 0;
          ctx.stroke();
        }

        ctx.restore();
      }

      // Draw glowing sparks
      if (sparksRef.current.length > 0) {
        ctx.save();
        sparksRef.current = sparksRef.current.filter((s) => {
          s.x += s.vx;
          s.y += s.vy;
          s.life++;
          const progress = s.life / s.maxLife;
          const currentAlpha = s.alpha * (1 - progress);

          if (currentAlpha <= 0.02) return false;

          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size * (1 - progress * 0.4), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(34, 211, 238, ${currentAlpha})`;
          ctx.shadowColor = '#00f2fe';
          ctx.shadowBlur = 6;
          ctx.fill();

          return true;
        });
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-30 select-none"
      aria-hidden="true"
    />
  );
};
