import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showWordmark = false,
  className = '',
}) => {
  const sizeMap = {
    sm: { box: 28, text: 'text-sm', badge: 'text-[9px]' },
    md: { box: 36, text: 'text-base', badge: 'text-[10px]' },
    lg: { box: 48, text: 'text-xl', badge: 'text-xs' },
    xl: { box: 64, text: 'text-2xl', badge: 'text-xs' },
  };

  const dim = sizeMap[size].box;

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Hand-Crafted Biometric Security Shield Logo Mark */}
      <div
        className="relative flex items-center justify-center shrink-0 rounded-xl bg-slate-900 border border-cyan-500/40 p-1 shadow-sm transition-transform hover:scale-105"
        style={{ width: dim, height: dim }}
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Subtle Outer Protective Hex Shield */}
          <path
            d="M24 3L41 11V25C41 35.5 24 43 24 43C24 43 7 35.5 7 25V11L24 3Z"
            fill="#091322"
            stroke="#0ea5e9"
            strokeWidth="1.75"
            strokeLinejoin="round"
          />

          {/* Biometric Organic Fingerprint Ridges (Human half) */}
          <path
            d="M17 19C17 15.134 20.134 12 24 12C27.866 12 31 15.134 31 19V22"
            stroke="#38bdf8"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M14 23C13.5 20 15 15 19 14"
            stroke="#0284c7"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
          <path
            d="M20 22C20 19.7909 21.7909 18 24 18C26.2091 18 28 19.7909 28 22V26"
            stroke="#00e5ff"
            strokeWidth="1.75"
            strokeLinecap="round"
          />

          {/* Living Human Pulse line turning into crisp verification checkmark */}
          <path
            d="M12 28L18 28L21 24L24 33L27 28L36 17"
            stroke="#22d3ee"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Center Biometric Core Node */}
          <circle cx="24" cy="33" r="1.75" fill="#38bdf8" />
        </svg>
      </div>

      {/* Optional Wordmark */}
      {showWordmark && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5">
            <span className={`font-black tracking-tight text-white uppercase font-sans ${sizeMap[size].text}`}>
              Verify<span className="text-cyan-400">Me</span>
            </span>
            <span className="rounded bg-cyan-950/80 border border-cyan-500/40 px-1 py-0.5 text-[8px] font-mono font-bold text-cyan-300 uppercase tracking-widest">
              v2.4
            </span>
          </div>
          <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase mt-0.5">
            Reverse Turing Laboratory
          </span>
        </div>
      )}
    </div>
  );
};
