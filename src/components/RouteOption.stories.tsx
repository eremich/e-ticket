import type { Meta, StoryObj } from '@storybook/react-vite';
import { RouteOption, type RouteOptionProps } from './RouteOption';

const WORK: RouteOptionProps = {
  legs: [
    { kind: 'walk', minutes: 3 },
    { kind: 'ride', transport: 'metro', number: 2 },
    { kind: 'ride', transport: 'metro', number: 1 },
    { kind: 'walk', minutes: 2 },
  ],
  totalMin: 24,
  depart: 494,
  arrive: 518,
  leavesIn: 2,
  from: 'Saltivska',
  transfers: 1,
  walkMin: 5,
  fare: 8,
  freeTransfer: true,
  stepFree: true,
};

const TRAM: RouteOptionProps = {
  legs: [
    { kind: 'walk', minutes: 4 },
    { kind: 'ride', transport: 'bus', number: '115' },
    { kind: 'walk', minutes: 6 },
  ],
  totalMin: 41,
  depart: 497,
  arrive: 538,
  leavesIn: 5,
  from: 'Saltivske Shose',
  transfers: 0,
  walkMin: 10,
  fare: 12,
};

const meta = {
  title: 'Components/Route option',
  component: RouteOption,
  args: WORK,
  parameters: {
    docs: {
      description: {
        component:
          'One option in Routes. Time first, the chain of rides at a glance, then what decides it: when it leaves, from where, transfers, walking, and the total fare. The fastest option is outlined. Step-free options carry the wheelchair mark; if the balance does not cover the fare, the option says so before you leave.',
      },
    },
  },
  decorators: [(S) => <div className="w-[358px]"><S /></div>],
} satisfies Meta<typeof RouteOption>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Best: Story = { args: { best: true, onClick: () => {} } };
export const Default: Story = { args: TRAM };
export const BalanceShort: Story = { name: 'Balance does not cover it', args: { short: true, best: true } };

export const List: Story = {
  render: () => (
    <div className="flex flex-col gap-3 bg-canvas p-4">
      <RouteOption {...WORK} best short onClick={() => {}} />
      <RouteOption {...TRAM} onClick={() => {}} />
    </div>
  ),
};

export const Ukrainian: Story = {
  args: { ...WORK, from: 'Салтівська', best: true, short: true },
  globals: { lang: 'uk' },
};
