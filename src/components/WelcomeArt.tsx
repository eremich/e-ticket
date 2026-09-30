import { useEffect, useState } from 'react';
import { LINES, TRANSFERS, stationById } from '../data/metro';
import { pointAt } from '../lib/arrivals';
import { cx } from '../lib/cx';

/** A train on the illustration: which line, how long one way takes, and where in its run it starts */
const TRAINS: { line: 1 | 2 | 3; seconds: number; offset: number }[] = [
  { line: 2, seconds: 16, offset: 0 },
  { line: 2, seconds: 16, offset: 8 },
  { line: 1, seconds: 22, offset: 5 },
  { line: 3, seconds: 18, offset: 11 },
];

const pointsOf = (line: 1 | 2 | 3) => LINES.find((l) => l.id === line)!.stations.map((s) => [s.x, s.y] as [number, number]);

/** Ease in and out, so a train slows into each terminus and pulls away again */
const ease = (f: number) => (f < 0.5 ? 2 * f * f : 1 - (-2 * f + 2) ** 2 / 2);

/** Where along its line a train is at time t: out to the terminus and back */
const trainAt = (t: number, seconds: number, offset: number) => {
  const phase = (((t + offset) % (2 * seconds)) + 2 * seconds) % (2 * seconds) / (2 * seconds);
  return ease(phase < 0.5 ? phase * 2 : 2 - phase * 2);
};

/** Seconds since mount, updated every frame; stays 0 when motion is reduced */
const useClock = (running: boolean) => {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!running) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      setT((now - start) / 1000);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running]);
  return t;
};

const prefersReducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Welcome illustration: the Kharkiv metro in thin white lines on the brand blue, home station marked,
 * with trains gliding back and forth along the lines. Built from the same metro data as the map.
 * Decorative only (aria-hidden). With reduced motion the trains stand still at stations.
 */
export const WelcomeArt = ({ className }: { className?: string }) => {
  const still = prefersReducedMotion();
  const t = useClock(!still);
  return (
    // The map fades out towards the logotype instead of ending at a hard edge
    <div aria-hidden className={cx('pointer-events-none relative [mask-image:linear-gradient(to_bottom,black_65%,transparent)]', className)}>
      <svg viewBox="60 30 380 440" preserveAspectRatio="xMidYMin slice" className="absolute inset-0 h-full w-full">
        {LINES.map((l) => (
          <polyline
            key={l.id}
            points={l.stations.map((s) => `${s.x},${s.y}`).join(' ')}
            fill="none"
            stroke="white"
            strokeOpacity="0.32"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
        {TRANSFERS.map(([a, b]) => {
          const s1 = stationById(a);
          const s2 = stationById(b);
          return <line key={a} x1={s1.x} y1={s1.y} x2={s2.x} y2={s2.y} stroke="white" strokeOpacity="0.5" strokeWidth="10" strokeLinecap="round" />;
        })}
        {LINES.flatMap((l) => l.stations).map((s) => (
          <circle key={s.id} cx={s.x} cy={s.y} r="4" fill="white" fillOpacity="0.55" />
        ))}
        {/* Home: Saltivska, where the rider's day starts */}
        <circle cx={stationById('saltivska').x} cy={stationById('saltivska').y} r="9" fill="white" />

        {/* Trains: a bright dot with a soft halo, out and back along the line, eased at the ends like a real stop */}
        {TRAINS.map((train, i) => {
          const [x, y] = pointAt(pointsOf(train.line), trainAt(t, train.seconds, train.offset));
          return (
            <g key={i} transform={`translate(${x} ${y})`}>
              <circle r="13" fill="white" fillOpacity="0.18" />
              <circle r="6" fill="white" />
            </g>
          );
        })}
      </svg>
    </div>
  );
};
