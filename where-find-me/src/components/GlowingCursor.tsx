import React, { useEffect, useState, useRef } from 'react';

export const GlowingCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isClicking, setIsClicking] = useState(false);
  const [isHoveringClickable, setIsHoveringClickable] = useState(false);
  const [visible, setVisible] = useState(false);

  // Smooth lag for outer reticle
  const reticlePosRef = useRef({ x: -100, y: -100 });
  const mousePosRef = useRef({ x: -100, y: -100 });
  const reticleElRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animId: number;

    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
      setPos({ x: e.clientX, y: e.clientY });
      if (!visible) setVisible(true);

      // Check if hovering clickable element
      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable =
          target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.getAttribute('role') === 'button' ||
          target.closest('button') !== null ||
          target.classList.contains('cursor-pointer') ||
          target.classList.contains('cursor-grab');
        setIsHoveringClickable(!!isClickable);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setVisible(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Smooth animation loop for the trailing reticle
    const render = () => {
      const targetX = mousePosRef.current.x;
      const targetY = mousePosRef.current.y;

      reticlePosRef.current.x += (targetX - reticlePosRef.current.x) * 0.22;
      reticlePosRef.current.y += (targetY - reticlePosRef.current.y) * 0.22;

      if (reticleElRef.current) {
        reticleElRef.current.style.transform = `translate3d(${reticlePosRef.current.x}px, ${reticlePosRef.current.y}px, 0)`;
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden select-none">
      {/* Outer Glowing Reticle Ring */}
      <div
        ref={reticleElRef}
        className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 will-change-transform"
      >
        <div
          className={`relative flex items-center justify-center transition-all duration-150 ${
            isClicking
              ? 'h-10 w-10 scale-90'
              : isHoveringClickable
              ? 'h-11 w-11 scale-110'
              : 'h-8 w-8 scale-100'
          }`}
        >
          {/* Glowing Ring */}
          <div
            className={`absolute inset-0 rounded-full border transition-colors ${
              isClicking
                ? 'border-cyan-300 bg-cyan-400/20 shadow-[0_0_18px_#22d3ee]'
                : isHoveringClickable
                ? 'border-cyan-400 bg-cyan-500/15 shadow-[0_0_16px_rgba(6,182,212,0.8)]'
                : 'border-cyan-400/80 shadow-[0_0_12px_rgba(6,182,212,0.6)]'
            }`}
          />

          {/* Micro Corner Crosshair Ticks */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 h-1 w-0.5 bg-cyan-400" />
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-0.5 bg-cyan-400" />
          <div className="absolute -left-1 top-1/2 -translate-y-1/2 h-0.5 w-1 bg-cyan-400" />
          <div className="absolute -right-1 top-1/2 -translate-y-1/2 h-0.5 w-1 bg-cyan-400" />
        </div>
      </div>

      {/* Inner Precision Glowing Dot */}
      <div
        className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
        style={{
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
        }}
      >
        <div
          className={`rounded-full bg-cyan-300 transition-all ${
            isClicking
              ? 'h-3.5 w-3.5 shadow-[0_0_16px_#ffffff]'
              : 'h-2 w-2 shadow-[0_0_8px_#22d3ee]'
          }`}
        />
      </div>
    </div>
  );
};
