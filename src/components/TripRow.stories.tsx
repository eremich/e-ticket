import type { Meta, StoryObj } from '@storybook/react-vite';
import { TripRow } from './TripRow';

const meta = {
  title: 'Components/Trip row',
  component: TripRow,
  args: { kind: 'ride', transport: 'metro', number: 2, place: 'Saltivska', time: 494, amount: -8 },
  parameters: { docs: { description: { component: 'History on Card and in Profile > Trips: line, stop, time and money. Charges in ink, free transfers muted at ₴0, credits in green with a plus.' } } },
  decorators: [(S) => <div className="w-[390px] rounded-group bg-surface"><S /></div>],
} satisfies Meta<typeof TripRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ride: Story = {};
export const Kinds: Story = {
  render: () => (
    <div className="divide-y divide-line">
      <TripRow kind="ride" transport="metro" number={2} place="Saltivska" time={494} amount={-8} />
      <TripRow kind="transfer" transport="tram" number="7" place="Vokzalna Square" time={522} amount={0} />
      <TripRow kind="ride" transport="bus" number="115" place="Saltivske Shose" time={1130} amount={-12} />
      <TripRow kind="topup" time={493} amount={100} method="Apple Pay" />
      <TripRow kind="refund" transport="metro" number={2} place="Saltivska" time={494} amount={8} />
      <TripRow kind="sent" time={600} amount={-50} />
    </div>
  ),
};
export const Ukrainian: Story = { globals: { lang: 'uk' }, args: { place: 'Салтівська' } };
