import type { Meta, StoryObj } from '@storybook/react-vite';
import { CityMap, StopDot, VehicleMarker, YouAreHere } from './CityMap';
import { ROUTES, STOPS } from '../data/surface';
import { vehiclesOn } from '../lib/arrivals';

const meta = {
  title: 'Components/City map',
  component: CityMap,
  parameters: {
    docs: {
      description: {
        component:
          'The neighbourhood map behind Home\'s Map view: a stylized static map in map tokens, with SVG overlays. VehicleMarker is a colored pill with icon and number — never color alone — and glides between positions. StopDot marks stops, YouAreHere the rider.',
      },
    },
  },
  decorators: [(S) => <div className="h-[460px] w-[390px] overflow-hidden rounded-group"><S /></div>],
} satisfies Meta<typeof CityMap>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const WithVehicles: Story = {
  name: 'Vehicles, stops, you',
  render: () => (
    <CityMap>
      {ROUTES.filter((r) => r.path.length).map((r) => (
        <polyline key={r.id} points={r.path.map((p) => p.join(',')).join(' ')} fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="stroke-muted/40" />
      ))}
      {STOPS.filter((s) => s.x !== undefined).map((s) => (
        <StopDot key={s.id} x={s.x!} y={s.y!} label={s.name.en} />
      ))}
      <YouAreHere x={345} y={95} />
      {ROUTES.filter((r) => r.path.length).flatMap((r) =>
        vehiclesOn(r).map((v) => <VehicleMarker key={v.id} transport={r.transport} number={r.number} x={v.point[0]} y={v.point[1]} onClick={() => {}} />),
      )}
    </CityMap>
  ),
};

export const Markers: Story = {
  render: () => (
    <svg viewBox="0 0 240 40" className="w-[360px]">
      <VehicleMarker transport="tram" number="27" x={30} y={20} />
      <VehicleMarker transport="tram" number="16A" x={90} y={20} />
      <VehicleMarker transport="trolleybus" number="35" x={150} y={20} />
      <VehicleMarker transport="bus" number="115" x={210} y={20} />
    </svg>
  ),
};
