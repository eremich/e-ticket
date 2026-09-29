import { forwardRef, type ReactElement } from 'react';
import { Bus, IconBase, Subway, Tram, type Icon, type IconProps, type IconWeight } from '@phosphor-icons/react';

/**
 * Icon set: Phosphor. Regular weight in the interface, fill for selected tabs and on colored badges
 * (the same outline/fill pairing as SF Symbols on iOS).
 */

/** Phosphor's bus path, used as the body of the trolleybus */
const BUS = {
  regular:
    'M184,32H72A32,32,0,0,0,40,64V208a16,16,0,0,0,16,16H80a16,16,0,0,0,16-16V192h64v16a16,16,0,0,0,16,16h24a16,16,0,0,0,16-16V64A32,32,0,0,0,184,32ZM56,176V120H200v56Zm0-96H200v24H56ZM72,48H184a16,16,0,0,1,16,16H56A16,16,0,0,1,72,48Zm8,160H56V192H80Zm96,0V192h24v16Zm-72-60a12,12,0,1,1-12-12A12,12,0,0,1,104,148Zm72,0a12,12,0,1,1-12-12A12,12,0,0,1,176,148Z',
  bold: 'M184,28H72A36,36,0,0,0,36,64V208a20,20,0,0,0,20,20H84a20,20,0,0,0,20-20V192h48v16a20,20,0,0,0,20,20h28a20,20,0,0,0,20-20V64A36,36,0,0,0,184,28ZM60,168V112H196v56ZM72,52H184a12,12,0,0,1,12,12V88H60V64A12,12,0,0,1,72,52Zm8,152H60V192H80Zm96,0V192h20v12Zm-68-64a16,16,0,1,1-16-16A16,16,0,0,1,108,140Zm72,0a16,16,0,1,1-16-16A16,16,0,0,1,180,140Z',
  fill: 'M216,64V208a16,16,0,0,1-16,16H184a16,16,0,0,1-16-16v-8H88v8a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V64A32,32,0,0,1,72,32H184A32,32,0,0,1,216,64ZM104,148a12,12,0,1,0-12,12A12,12,0,0,0,104,148Zm72,0a12,12,0,1,0-12,12A12,12,0,0,0,176,148Zm24-76H56v40H200Z',
};

/** Phosphor has no trolleybus: its bus, lowered, with two roof poles to the overhead wires */
const trolleybus = (d: string, pole: number): ReactElement => (
  <>
    <path d="M104 78 80 14M160 78 136 14" fill="none" stroke="currentColor" strokeWidth={pole} strokeLinecap="round" />
    <path d={d} transform="translate(25.6 50) scale(0.8)" />
  </>
);

const TROLLEYBUS_WEIGHTS = new Map<IconWeight, ReactElement>([
  ['thin', trolleybus(BUS.regular, 12)],
  ['light', trolleybus(BUS.regular, 12)],
  ['regular', trolleybus(BUS.regular, 14)],
  ['duotone', trolleybus(BUS.regular, 14)],
  ['bold', trolleybus(BUS.bold, 20)],
  ['fill', trolleybus(BUS.fill, 16)],
]);

export const Trolleybus: Icon = forwardRef<SVGSVGElement, IconProps>((props, ref) => <IconBase ref={ref} {...props} weights={TROLLEYBUS_WEIGHTS} />);
Trolleybus.displayName = 'Trolleybus';

export type Transport = 'metro' | 'tram' | 'trolleybus' | 'bus';
export const TRANSPORTS: Transport[] = ['metro', 'tram', 'trolleybus', 'bus'];

export const TRANSPORT_ICON: Record<Transport, Icon> = {
  metro: Subway,
  tram: Tram,
  trolleybus: Trolleybus,
  bus: Bus,
};
