import type { Meta, StoryObj } from '@storybook/react-vite';
import { LineStopList } from './LineStopList';

const STOPS = [
  { name: 'Saltivska metro', minutes: 3, here: true },
  { name: 'Studentska metro', minutes: 7 },
  { name: 'Akademika Pavlova metro', minutes: 11 },
  { name: 'Barabashova Market', minutes: 15 },
  { name: 'Kyivska metro', minutes: 20 },
  { name: 'Tsentralnyi Rynok', minutes: 34 },
];

const meta = {
  title: 'Components/Line stop list',
  component: LineStopList,
  args: { transport: 'tram', stops: STOPS, vehicles: [-0.4, 2.6] },
  parameters: {
    docs: {
      description: {
        component:
          "A line's stops as a timeline in its transport color. Vehicles ride between stops; live times sit on the right, or timetable times in muted type without live data. The rider's stop is marked.",
      },
    },
  },
  decorators: [(S) => <div className="w-[390px] rounded-group bg-surface py-2"><S /></div>],
} satisfies Meta<typeof LineStopList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Tram: Story = {};
export const Trolleybus: Story = { args: { transport: 'trolleybus', vehicles: [1.3] } };
export const Scheduled: Story = { args: { stops: STOPS.map((s, i) => ({ name: s.name, here: s.here, scheduled: 500 + i * 4 })), vehicles: [] } };
export const Ukrainian: Story = {
  globals: { lang: 'uk' },
  args: { stops: [{ name: 'Метро «Салтівська»', minutes: 3, here: true }, { name: 'Метро «Студентська»', minutes: 7 }, { name: 'Ринок Барабашова', minutes: 15 }] },
};
