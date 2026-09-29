import type { ReactNode } from 'react';
import { cx } from '../lib/cx';
import { TRANSPORT_ICON, type Transport } from '../lib/icons';

export const CITY_VIEWBOX = { w: 390, h: 460 };

/**
 * Stylized neighbourhood map (Saltivka): blocks, a park, the river and main streets, drawn in map tokens.
 * Not geographic; it stands in for a map tile, so overlays (routes, stops, vehicles) stay crisp in both themes.
 */
export const CityMap = ({ children, className }: { children?: ReactNode; className?: string }) => (
  <svg viewBox={`0 0 ${CITY_VIEWBOX.w} ${CITY_VIEWBOX.h}`} preserveAspectRatio="xMidYMid slice" className={cx('h-full w-full bg-map-land', className)} aria-hidden={!children}>
    <g aria-hidden>
      {/* River along the south-west */}
      <path d="M-10 380 C 60 350, 90 420, 160 400 S 260 470, 300 470 L -10 470 Z" className="fill-map-water" />
      {/* Parks */}
      <path d="M40 40 h90 a10 10 0 0 1 10 10 v50 a10 10 0 0 1 -10 10 h-90 a10 10 0 0 1 -10 -10 v-50 a10 10 0 0 1 10 -10z" className="fill-map-park" />
      <path d="M300 330 h70 v60 h-70z" className="fill-map-park" />
      {/* Blocks on a slanted grid, like Saltivka's microdistricts */}
      {Array.from({ length: 7 }, (_, r) =>
        Array.from({ length: 6 }, (_, c) => {
          const x = 20 + c * 62 + (r % 2) * 14;
          const y = 130 + r * 44;
          if ((r < 1 && c < 2) || (x > 290 && y > 320) || y > 380 - (c < 3 ? 20 : 0)) return null;
          return <rect key={`${r}-${c}`} x={x} y={y} width="44" height="28" rx="4" className="fill-map-block" />;
        }),
      )}
      {Array.from({ length: 4 }, (_, c) => (
        <rect key={`n${c}`} x={170 + c * 52} y={20} width="38" height="30" rx="4" className="fill-map-block" />
      ))}
      {/* Main streets */}
      {[
        'M0 115 L390 105',
        'M150 0 L120 460',
        'M300 0 L230 460',
        'M0 300 L390 250',
        'M370 40 L30 330',
      ].map((d) => (
        <path key={d} d={d} fill="none" strokeWidth="9" strokeLinecap="round" className="stroke-map-road" />
      ))}
    </g>
    {children}
  </svg>
);

const MARKER_FILL: Record<Transport, string> = {
  metro: 'fill-metro-badge',
  tram: 'fill-tram-badge',
  trolleybus: 'fill-trolleybus-badge',
  bus: 'fill-bus-badge',
};

export interface VehicleMarkerProps {
  transport: Transport;
  number: string;
  x: number;
  y: number;
  onClick?: () => void;
  label?: string;
}

/** A vehicle on the map: colored pill with icon and number, never color alone. Moves with a soft transition. */
export const VehicleMarker = ({ transport, number, x, y, onClick, label }: VehicleMarkerProps) => {
  const Icon = TRANSPORT_ICON[transport];
  const w = 20 + number.length * 7;
  return (
    <g
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={label ?? `${transport} ${number}`}
      onClick={onClick}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick?.()}
      className={cx('outline-none transition-transform duration-1000 ease-linear', onClick && 'cursor-pointer')}
      style={{ transform: `translate(${x}px, ${y}px)` }}
    >
      <rect x={-w / 2 - 6} y={-18} width={w + 12} height={36} className="fill-transparent" />
      <rect x={-w / 2} y={-10} width={w} height={20} rx={10} className={cx(MARKER_FILL[transport], 'stroke-surface')} strokeWidth="2" />
      <Icon x={-w / 2 + 4} y={-6} width={12} height={12} weight="fill" className={transport === 'bus' ? 'text-on-bus' : 'text-on-transport'} />
      <text x={-w / 2 + 18} y={4} className={cx('text-[11px] font-bold', transport === 'bus' ? 'fill-on-bus' : 'fill-on-transport')}>
        {number}
      </text>
    </g>
  );
};

/** A stop on the map: white dot with a dark ring, the rider's stops slightly larger */
export const StopDot = ({ x, y, label, onClick }: { x: number; y: number; label: string; onClick?: () => void }) => (
  <g role="button" tabIndex={0} aria-label={label} onClick={onClick} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick?.()} className="cursor-pointer outline-none">
    <circle cx={x} cy={y} r={16} className="fill-transparent" />
    <circle cx={x} cy={y} r={6} strokeWidth={3} className="fill-surface stroke-ink" />
  </g>
);

/** The rider: blue dot with a soft halo */
export const YouAreHere = ({ x, y }: { x: number; y: number }) => (
  <g aria-hidden>
    <circle cx={x} cy={y} r={18} className="fill-action/15" />
    <circle cx={x} cy={y} r={7} strokeWidth={3} className="fill-action stroke-white" />
  </g>
);
