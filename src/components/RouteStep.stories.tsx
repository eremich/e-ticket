import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArrivalChip } from './ArrivalChip';
import { RouteStep, RouteSteps } from './RouteStep';

const meta = {
  title: 'Components/Route step',
  component: RouteStep,
  args: { kind: 'ride', time: 497, title: 'Line 2 towards Istorychnyi Muzei', transport: 'metro', number: 2 },
  parameters: {
    docs: {
      description: {
        component:
          'Steps of a route on a vertical rail: time, what to do, and the live detail on the right. Rides draw a solid rail in the line color, walks and transfers a dotted one. On a live trip the current step gets the only brand tint on the screen and finished steps fade.',
      },
    },
  },
  decorators: [(S) => <div className="w-[390px] bg-surface p-4"><S /></div>],
} satisfies Meta<typeof RouteStep>;

export default meta;
type Story = StoryObj<typeof meta>;

const Trip = ({ live = false }: { live?: boolean }) => (
  <RouteSteps>
    <RouteStep kind="walk" time={494} title="Walk to Saltivska" detail="3 min · 220 m · Entrance with a lift" status={live ? 'done' : undefined} />
    <RouteStep
      kind="ride"
      time={497}
      transport="metro"
      number={2}
      title="Line 2 towards Istorychnyi Muzei"
      detail="7 stops · 14 min"
      aside={live ? undefined : <ArrivalChip transport="metro" number={2} minutes={2} />}
      status={live ? 'current' : undefined}
    />
    <RouteStep kind="transfer" time={511} title="Change to line 1 at Maidan Konstytutsii" detail="No new tap: transfers inside the metro are free." status={live ? 'next' : undefined} />
    <RouteStep kind="ride" time={514} transport="metro" number={1} title="Line 1 towards Kholodna Hora" detail="2 stops · 4 min" />
    <RouteStep kind="arrive" time={518} title="Arrive at Work" last />
  </RouteSteps>
);

export const Planned: Story = { render: () => <Trip /> };
export const Live: Story = { render: () => <Trip live /> };
