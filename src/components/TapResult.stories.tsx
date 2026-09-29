import type { Meta, StoryObj } from '@storybook/react-vite';
import { TapResult } from './TapResult';

const CARD = { name: 'Eticket', number: '0124 0125 0556 2255', balance: 98, fare: 8, express: true };
const PLACE = { transport: 'metro' as const, number: 2, name: 'Saltivska', time: 494 };

const meta = {
  title: 'Components/Tap result',
  component: TapResult,
  args: { state: 'success', card: CARD, place: PLACE, fare: 8, balance: 98, transferUntil: 554, onDone: () => {}, onTapAgain: () => {} },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Paying at the turnstile, the moment with the least patience. Hold: the card and a reader animation, as the Wallet shows it. Paid: the check draws itself, the fare, the new balance and the free transfer window. Declined: says what is missing and is also the fix — top up with Apple Pay right here, then tap again. Transfer: a second tap inside the window costs nothing.',
      },
      story: { inline: false, iframeHeight: 790 },
    },
  },
  decorators: [(S) => <div className="h-[790px] w-[390px] bg-canvas pt-4 text-ink"><S /></div>],
} satisfies Meta<typeof TapResult>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Hold: Story = { args: { state: 'hold', card: { ...CARD, balance: 106 }, onCancel: () => {} } };
export const Success: Story = {};
export const Declined: Story = { args: { state: 'declined', balance: 6, card: { ...CARD, balance: 6 }, onCancel: () => {}, onTopUp: () => {}, onOtherTopUp: () => {} } };
export const Transfer: Story = { args: { state: 'transfer', place: { transport: 'metro', number: 1, name: 'Maidan Konstytutsii', time: 505 } } };
export const ReadyAfterTopUp: Story = { name: 'Ready after top-up', args: { state: 'ready', balance: 106, toppedUp: 100, onCancel: () => {} } };
export const Offline: Story = { args: { state: 'hold', offline: true, onCancel: () => {} } };
export const Ukrainian: Story = {
  args: { state: 'declined', balance: 6, card: { ...CARD, balance: 6 }, place: { ...PLACE, name: 'Салтівська' }, onCancel: () => {}, onTopUp: () => {}, onOtherTopUp: () => {} },
  globals: { lang: 'uk' },
};
