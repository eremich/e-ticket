import type { Meta, StoryObj } from '@storybook/react-vite';
import { CardStrip, EticketCard } from './EticketCard';

const REDUCED = { kind: 'student' as const, until: new Date(2027, 5, 30) };

const meta = {
  title: 'Components/Eticket card',
  component: EticketCard,
  args: { name: 'Eticket', number: '0124 0125 0556 2255', balance: 98, fare: 8, express: true },
  parameters: {
    docs: {
      description: {
        component:
          "The hero of paying: Kharkiv's card as a recognizable object. Balance in 40 pt, trips left at the typical fare, and a white pill when something needs attention (low balance, blocked). The wordmark keeps the original E with its floating middle arm. Pills stay in the light palette on the face in both themes.",
      },
    },
  },
  decorators: [(S) => <div className="w-[358px]"><S /></div>],
} satisfies Meta<typeof EticketCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {};
export const LowBalance: Story = { args: { balance: 12 } };
export const NotEnough: Story = { name: 'Not enough for a ride', args: { balance: 6 } };
export const ReducedFare: Story = { args: { balance: 46, fare: 4, reduced: REDUCED } };
export const Virtual: Story = { args: { kind: 'virtual', name: 'Olena', number: '9900 1204 7781 3306', balance: 40, express: false } };
export const Blocked: Story = { args: { blocked: true, express: false } };
export const Ukrainian: Story = { args: { balance: 6, reduced: REDUCED }, globals: { lang: 'uk' } };

export const Strip: Story = {
  name: 'Card strip (Home)',
  parameters: { docs: { description: { story: 'The one-line summary at the top of Home. Top up appears only when the balance runs low.' } } },
  render: () => (
    <div className="flex flex-col gap-3 bg-canvas p-4">
      <CardStrip balance={98} fare={8} onOpen={() => {}} onTopUp={() => {}} />
      <CardStrip balance={12} fare={8} onOpen={() => {}} onTopUp={() => {}} />
      <CardStrip balance={6} fare={8} onOpen={() => {}} onTopUp={() => {}} />
    </div>
  ),
};
