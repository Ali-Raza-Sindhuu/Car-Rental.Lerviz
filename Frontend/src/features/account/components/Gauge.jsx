import { useEffect, useState } from "react";

const GAUGE_ARC_LENGTH = 157;

const Gauge = ({ value = 0.78, reading = "3.8s", label = "0-100 km/h" }) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-44 rounded-2xl border border-white/10 bg-white/5 p-4 text-white backdrop-blur-md">
      <svg viewBox="0 0 120 70" className="w-full" aria-hidden="true">
        <path
          d="M10 62 A50 50 0 0 1 110 62"
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M10 62 A50 50 0 0 1 110 62"
          fill="none"
          stroke="#f05a1a"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={GAUGE_ARC_LENGTH}
          strokeDashoffset={isReady ? GAUGE_ARC_LENGTH * (1 - value) : GAUGE_ARC_LENGTH}
          style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(.2,.8,.2,1)" }}
        />
      </svg>
      <p className="-mt-7 text-center text-2xl font-semibold">{reading}</p>
      <p className="mt-1 text-center text-[11px] text-white/60">{label}</p>
    </div>
  );
};

export default Gauge;
