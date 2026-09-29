import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArrivalChip } from './ArrivalChip';

const meta = {
  title: 'Components/Arrival chip',
  component: ArrivalChip,
  args: { transport: 'tram', number: '27', minutes: 3 },
  parameters: {
    docs: {
      description: {
        component:
          'The hero of waiting: "Tram 27 · 3 min". Live minutes are bold with a calm pulsing dot; "Now" turns green; a delay turns amber and says so; without live data the chip shows the timetable time, muted and labelled "Scheduled". Metro chips name the direction instead of the route.',
      },
    },
  },
} satisfies Meta<typeof ArrivalChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Live: Story = {};
export const Now: Story = { args: { minutes: 0 } };
export const Scheduled: Story = { args: { minutes: undefined, scheduled: 500 } };
export const Delayed: Story = { args: { minutes: 6, delay: 3 } };
export const MetroDirection: Story = { name: 'Metro direction', args: { transport: 'metro', number: 2, towards: 'Istorychnyi Muzei', minutes: 2 } };

export const PerTransport: Story = {
  name: 'Per transport',
  render: () => (
    <div className="flex max-w-[390px] flex-wrap gap-2">
      <ArrivalChip transport="metro" number={1} towards="Vokzalna" minutes={2} />
      <ArrivalChip transport="metro" number={2} towards="Saltivska" minutes={5} />
      <ArrivalChip transport="tram" number="27" minutes={3} />
      <ArrivalChip transport="tram" number="7" minutes={0} />
      <ArrivalChip transport="trolleybus" number="35" minutes={11} />
      <ArrivalChip transport="bus" number="115" scheduled={500} />
    </div>
  ),
};

export const Ukrainian: Story = {
  globals: { lang: 'uk' },
  render: () => (
    <div className="flex max-w-[390px] flex-wrap gap-2">
      <ArrivalChip transport="metro" number={2} towards="Історичний музей" minutes={2} />
      <ArrivalChip transport="tram" number="27" minutes={3} />
      <ArrivalChip transport="tram" number="7" minutes={0} />
      <ArrivalChip transport="bus" number="115" scheduled={500} />
    </div>
  ),
};
