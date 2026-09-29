import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { TimetableGrid } from './TimetableGrid';
import { Segmented } from './Segmented';
import { timetable } from '../lib/arrivals';

const meta = {
  title: 'Components/Timetable grid',
  component: TimetableGrid,
  args: { times: timetable(9, false, 2), now: 494 },
  parameters: {
    docs: {
      description: {
        component:
          'A day of departures by hour, like the board at the stop. Past departures fade, the current hour is tinted and the next departure is filled. A Weekday / Weekend segmented control switches the table.',
      },
    },
  },
  decorators: [(S) => <div className="h-[520px] w-[390px] overflow-y-auto bg-surface"><S /></div>],
} satisfies Meta<typeof TimetableGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Weekday: Story = {};

export const WithDaySwitch: Story = {
  name: 'Weekday / Weekend',
  render: () => {
    const [d, setD] = useState<'weekday' | 'weekend'>('weekday');
    return (
      <div>
        <div className="sticky top-0 z-10 bg-surface p-4">
          <Segmented label="Days" value={d} onChange={setD} options={[{ key: 'weekday', label: 'Weekday' }, { key: 'weekend', label: 'Weekend' }]} />
        </div>
        <TimetableGrid times={timetable(9, d === 'weekend', 2)} now={494} />
      </div>
    );
  },
};
