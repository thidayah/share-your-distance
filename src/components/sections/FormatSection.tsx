'use client';

import { useState, useEffect, useRef } from 'react';

export default function FormatSection() {
  const pathRef = useRef<SVGPathElement>(null);
  const [batonPos, setBatonPos] = useState({ x: 235, y: 127 });
  const [runnerNumber, setRunnerNumber] = useState('01');
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    let animationFrameId: number;
    let startTime: number | null = null;
    const duration = 16000; // 16 seconds full cycle for 4 runners (4 seconds per runner)

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) % duration;
      const progress = elapsed / duration; // 0 to 1

      if (pathRef.current) {
        const pathLength = pathRef.current.getTotalLength();
        const currentLength = progress * pathLength;
        const point = pathRef.current.getPointAtLength(currentLength);
        setBatonPos({ x: point.x, y: point.y });
      }

      // 4 runners, 600m each = 2400m
      const currentMeters = Math.min(2400, Math.floor(progress * 2400));
      const currentRunner = Math.min(4, Math.floor(progress * 4) + 1);

      setDistance(currentMeters);
      setRunnerNumber(String(currentRunner).padStart(2, '0'));

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <section id="format" className="section bg-white">
      <div className="wrap grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="eyebrow mb-4 text-[var(--blue)]">Satu lintasan, empat peran</p>
          <h2 className="mb-5 text-4xl font-black leading-tight tracking-tight md:text-5xl text-[var(--ink)]">
            Bukan soal siapa paling cepat. Ini soal saling bawa sampai finis.
          </h2>
          <p className="text-base text-[var(--muted)] leading-relaxed max-w-lg">
            Format estafet 4 × 600 meter dirancang untuk membangun kerjasama tim. Setiap pelari memiliki peran yang sama pentingnya untuk menuntaskan total jarak 2.400 meter bersama.
          </p>
        </div>

        <div className="relay-visual relative w-full max-w-[620px] mx-auto">
          <svg
            className="relay-svg block w-full h-auto overflow-visible"
            viewBox="0 0 560 440"
            role="img"
            aria-labelledby="relay-title relay-desc"
          >
            <title id="relay-title">Lintasan estafet empat pelari</title>
            <desc id="relay-desc">
              Empat pelari bergantian mengelilingi lintasan. Setiap putaran berjarak 600 meter dan total jarak tim 2.400 meter.
            </desc>

            {/* Track surface */}
            <path
              className="relay-track-surface"
              d="M235 120H325A100 100 0 0 1 325 320H235A100 100 0 0 1 235 120"
              transform="rotate(-28 280 220)"
            />

            {/* Lane lines */}
            <path
              className="relay-lane-line"
              d="M235 148H325A72 72 0 0 1 325 292H235A72 72 0 0 1 235 148"
              transform="rotate(-28 280 220)"
            />
            <path
              className="relay-lane-line"
              d="M235 134H325A86 86 0 0 1 325 306H235A86 86 0 0 1 235 134"
              transform="rotate(-28 280 220)"
            />
            <path
              className="relay-lane-line"
              d="M235 120H325A100 100 0 0 1 325 320H235A100 100 0 0 1 235 120"
              transform="rotate(-28 280 220)"
            />
            <path
              className="relay-lane-line"
              d="M235 106H325A114 114 0 0 1 325 334H235A114 114 0 0 1 235 106"
              transform="rotate(-28 280 220)"
            />
            <path
              className="relay-lane-line"
              d="M235 92H325A128 128 0 0 1 325 348H235A128 128 0 0 1 235 92"
              transform="rotate(-28 280 220)"
            />

            {/* Hidden motion path */}
            <path
              ref={pathRef}
              id="relay-route"
              className="relay-motion-path fill-none stroke-transparent pointer-events-none"
              d="M235 127A93 93 0 0 0 235 313H325A93 93 0 0 0 325 127H235"
              transform="rotate(-28 280 220)"
            />

            {/* Baton & Runner Badge */}
            <g
              id="relay-baton"
              style={{
                transform: `translate(${batonPos.x}px, ${batonPos.y}px)`,
                transition: 'transform 0.05s linear',
              }}
            >
              <circle
                className="relay-runner-badge fill-[var(--lime)] stroke-[var(--ink)] stroke-[3] pointer-events-none"
                r="24"
              />
              <text
                id="relay-runner-number"
                className="relay-runner-number fill-[var(--ink)] text-[17px] font-black pointer-events-none"
                textAnchor="middle"
                dominantBaseline="central"
                x="0"
                y="1"
              >
                {runnerNumber}
              </text>
            </g>
          </svg>

          {/* Center metric indicator */}
          <div className="relay-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <span className="eyebrow text-[var(--blue)]">Jarak tim</span>
            <strong
              id="relay-distance"
              className="mt-1 inline-block min-w-[9ch] bg-[var(--ink)] px-4 py-2 text-center text-3xl font-black text-white sm:text-4xl rounded-xl shadow-lg"
            >
              {distance.toLocaleString('id-ID')} M
            </strong>
            <span className="mt-1 block text-xs font-semibold text-[var(--muted)]">
              4 pelari · 600 m per orang
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
