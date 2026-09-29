import type { KeyboardEvent } from 'react';
import { LINES, TRANSFERS, stationById, type Station } from '../data/metro';
import { useName } from '../i18n';
import { cx } from '../lib/cx';
import type { MetroLine } from './LineBadge';

export interface MetroMapProps {
  /** Where the rider is: pulsing ring */
  current?: string;
  /** Tapped station: bigger dot, bold label */
  selected?: string;
  /** Station ids of a trip in order: the rest of the map dims */
  path?: string[];
  /** Train position on a live trip */
  train?: string;
  onSelect?: (stationId: string) => void;
}

export const METRO_VIEWBOX = { w: 470, h: 640 };

const STROKE: Record<MetroLine, string> = { 1: 'stroke-m1', 2: 'stroke-m2', 3: 'stroke-m3' };
const FILL: Record<MetroLine, string> = { 1: 'fill-m1', 2: 'fill-m2', 3: 'fill-m3' };

const LABEL_GAP = 9;

/** Label placement from the station's label side */
const labelProps = (s: Station) => {
  switch (s.label) {
    case 'l':
      return { x: s.x - LABEL_GAP, y: s.y + 4, textAnchor: 'end' as const };
    case 'r':
      return { x: s.x + LABEL_GAP, y: s.y + 4, textAnchor: 'start' as const };
    case 't':
      return { x: s.x, y: s.y - LABEL_GAP - 2, textAnchor: 'middle' as const };
    case 'b':
      return { x: s.x, y: s.y + LABEL_GAP + 9, textAnchor: 'middle' as const };
    case 'd':
      // Reads up to the dot from below-left; parallel labels on a tight horizontal run never touch
      return { x: s.x - 6, y: s.y + 10, textAnchor: 'end' as const, transform: `rotate(-45 ${s.x - 6} ${s.y + 10})` };
  }
};

/** Line number badge beside each terminus */
/** Termini inside the map, where above or below would sit on another line */
const BADGE_AT: Record<string, [number, number]> = {
  'istorychnyi-muzei': [12, -9],
  metrobudivnykiv: [8, 9],
};

const TerminusBadge = ({ s, line }: { s: Station; line: MetroLine }) => {
  const up = s.y < 100;
  const at = BADGE_AT[s.id];
  const x = at ? s.x + at[0] : s.label === 'd' ? s.x - 30 : s.x - 11;
  const y = at ? s.y + at[1] : s.label === 'd' ? s.y - 11 : up ? s.y - 32 : s.y + 12;
  return (
    <g aria-hidden>
      <rect x={x} y={y} width="22" height="18" rx="5" className={FILL[line]} />
      <text x={x + 11} y={y + 13} textAnchor="middle" className="fill-on-transport text-[11px] font-bold">
        M{line}
      </text>
    </g>
  );
};

/**
 * Schematic map of the three Kharkiv metro lines. Not geographic: straight runs and 45° turns.
 * Transfers are drawn as connected pairs. Every station is a 28 px touch target with a spoken name.
 */
export const MetroMap = ({ current, selected, path, train, onSelect }: MetroMapProps) => {
  const name = useName();
  const onPath = (id: string) => !path || path.includes(id);
  const lineOnPath = (l: MetroLine) => !path || path.some((id) => stationById(id).line === l);

  const onKey = (e: KeyboardEvent, id: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect?.(id);
    }
  };

  return (
    <svg viewBox={`0 0 ${METRO_VIEWBOX.w} ${METRO_VIEWBOX.h}`} className="h-full w-full select-none" role="group" aria-label="Kharkiv metro map">
      {/* Lines: a canvas-colored casing under each one leaves a clean gap where lines cross */}
      {LINES.map((l) => {
        const pts = l.stations.map((s) => `${s.x},${s.y}`).join(' ');
        return (
          <g key={l.id} className={cx('transition-opacity duration-200', !lineOnPath(l.id) && 'opacity-25')}>
            <polyline points={pts} fill="none" strokeWidth="13" strokeLinejoin="round" strokeLinecap="round" className="stroke-canvas" />
            <polyline points={pts} fill="none" strokeWidth="7" strokeLinejoin="round" strokeLinecap="round" className={STROKE[l.id]} />
          </g>
        );
      })}

      {/* Trip highlight: segments between consecutive path stations on the same line */}
      {path && (
        <g>
          {path.slice(1).map((id, i) => {
            const a = stationById(path[i]);
            const b = stationById(id);
            const walk = a.line !== b.line;
            return (
              <line
                key={id}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                strokeWidth={walk ? 4 : 11}
                strokeLinecap="round"
                strokeDasharray={walk ? '2 6' : undefined}
                className={walk ? 'stroke-ink' : STROKE[a.line]}
              />
            );
          })}
        </g>
      )}

      {/* Transfer connectors */}
      {TRANSFERS.map(([a, b]) => {
        const s1 = stationById(a);
        const s2 = stationById(b);
        return (
          <line
            key={a}
            x1={s1.x}
            y1={s1.y}
            x2={s2.x}
            y2={s2.y}
            strokeWidth="12"
            strokeLinecap="round"
            className={cx('stroke-ink transition-opacity', path && !(onPath(a) || onPath(b)) && 'opacity-25')}
          />
        );
      })}

      {LINES.map((l) => (
        <g key={`t${l.id}`} className={cx(!lineOnPath(l.id) && 'opacity-25')}>
          <TerminusBadge s={l.stations[0]} line={l.id} />
          <TerminusBadge s={l.stations[l.stations.length - 1]} line={l.id} />
        </g>
      ))}

      {/* Stations */}
      {LINES.flatMap((l) =>
        l.stations.map((s) => {
          const isSel = s.id === selected;
          const isCur = s.id === current;
          const transfer = TRANSFERS.some((p) => p.includes(s.id));
          const dim = !onPath(s.id);
          return (
            <g
              key={s.id}
              role={onSelect ? 'button' : undefined}
              tabIndex={onSelect ? 0 : undefined}
              aria-label={name(s.name)}
              aria-pressed={onSelect ? isSel : undefined}
              onClick={() => onSelect?.(s.id)}
              onKeyDown={(e) => onKey(e, s.id)}
              className={cx('outline-none transition-opacity duration-200 [&:focus-visible>circle.dot]:stroke-action', onSelect && 'cursor-pointer', dim && 'opacity-30')}
            >
              <circle cx={s.x} cy={s.y} r="14" className="fill-transparent" />
              {isCur && (
                <circle cx={s.x} cy={s.y} r="11" className="ring-out fill-action/30 [transform-box:fill-box] [transform-origin:center]" />
              )}
              <circle
                cx={s.x}
                cy={s.y}
                r={isSel || isCur ? 7 : transfer ? 5.5 : 4.5}
                strokeWidth={isSel || isCur ? 3.5 : 2.5}
                className={cx('dot fill-surface', transfer ? 'stroke-ink' : STROKE[l.id], isCur && 'stroke-action')}
              />
              <text
                {...labelProps(s)}
                className={cx('fill-ink text-[11.5px]', isSel || isCur ? 'font-bold' : 'font-semibold')}
                style={{ paintOrder: 'stroke', stroke: 'rgb(var(--c-canvas))', strokeWidth: 3, strokeLinejoin: 'round' }}
              >
                {name(s.name)}
              </text>
            </g>
          );
        }),
      )}

      {/* Live trip: the train */}
      {train && (() => {
        const s = stationById(train);
        return (
          <g aria-hidden className="transition-transform duration-500 ease-out" style={{ transform: `translate(${s.x}px, ${s.y}px)` }}>
            <circle r="10" className="fill-accent stroke-surface" strokeWidth="3" />
            <path d="M-4 -3h8v5h-8zM-3 4l-1.5 2M3 4l1.5 2" className="stroke-on-accent" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          </g>
        );
      })()}
    </svg>
  );
};
