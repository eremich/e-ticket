import type { Meta, StoryObj } from '@storybook/react-vite';
import { LineBadge, TransportTile } from './LineBadge';
import { TRANSPORTS } from '../lib/icons';

const meta = {
  title: 'Components/Line badge',
  component: LineBadge,
  args: { transport: 'tram', number: '27', size: 'md' },
  parameters: {
    docs: {
      description: {
        component:
          'Transport identity: color, icon and number, always together, so a route reads in grayscale. Metro uses the line color (1 red, 2 blue, 3 green) with the M mark. TransportTile is the icon-only square for stop rows.',
      },
    },
  },
} satisfies Meta<typeof LineBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Tram: Story = {};
export const Bus: Story = { args: { transport: 'bus', number: '115' } };
export const MetroLine2: Story = { name: 'Metro line 2', args: { transport: 'metro', number: 2 } };

export const All: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <LineBadge transport="metro" number={1} />
        <LineBadge transport="metro" number={2} />
        <LineBadge transport="metro" number={3} />
        <LineBadge transport="tram" number="27" />
        <LineBadge transport="tram" number="16A" />
        <LineBadge transport="trolleybus" number="35" />
        <LineBadge transport="bus" number="115" />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <LineBadge size="sm" transport="metro" number={2} />
        <LineBadge size="sm" transport="tram" number="7" />
        <LineBadge size="sm" transport="trolleybus" number="35" />
        <LineBadge size="sm" transport="bus" number="115" />
      </div>
      <div className="flex gap-2">
        {TRANSPORTS.map((t) => (
          <TransportTile key={t} transport={t} line={t === 'metro' ? 2 : undefined} />
        ))}
      </div>
    </div>
  ),
};

export const Grayscale: Story = {
  parameters: { docs: { description: { story: 'Color removed: every badge is still identifiable by icon or M and number.' } } },
  render: () => (
    <div className="flex gap-2 grayscale">
      <LineBadge transport="metro" number={2} />
      <LineBadge transport="tram" number="27" />
      <LineBadge transport="trolleybus" number="35" />
      <LineBadge transport="bus" number="115" />
    </div>
  ),
};
