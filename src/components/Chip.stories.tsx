import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Chip } from './Chip';
import { TRANSPORT_ICON, TRANSPORTS } from '../lib/icons';

const meta = {
  title: 'Components/Chip',
  component: Chip,
  args: { label: '₴100' },
  parameters: { docs: { description: { component: 'Selectable pill for filters and amounts. Selected takes the action tint with a hairline ring and sets aria-pressed.' } } },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Amounts: Story = {
  render: () => {
    const [v, setV] = useState('₴100');
    return (
      <div className="flex gap-2">
        {['₴50', '₴100', '₴200', 'Other'].map((a) => (
          <Chip key={a} label={a} selected={v === a} onClick={() => setV(a)} />
        ))}
      </div>
    );
  },
};

export const TransportFilters: Story = {
  render: () => {
    const [on, setOn] = useState<string[]>(['metro', 'tram']);
    const labels = { metro: 'Metro', tram: 'Tram', trolleybus: 'Trolleybus', bus: 'Bus' };
    return (
      <div className="flex w-[390px] flex-wrap gap-2">
        {TRANSPORTS.map((t) => {
          const Icon = TRANSPORT_ICON[t];
          return (
            <Chip
              key={t}
              label={labels[t]}
              icon={<Icon aria-hidden className="size-4" />}
              selected={on.includes(t)}
              onClick={() => setOn((s) => (s.includes(t) ? s.filter((x) => x !== t) : [...s, t]))}
            />
          );
        })}
      </div>
    );
  },
};
