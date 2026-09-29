import type { Meta, StoryObj } from '@storybook/react-vite';
import { VisitorTicket } from './VisitorTicket';

const meta = {
  title: 'Components/Visitor ticket',
  component: VisitorTicket,
  args: { kind: 'day', validUntil: 1440 + 8 * 60 + 14, rides: 0 },
  parameters: { docs: { description: { component: 'The ticket a visitor buys without an account, drawn like an Apple Wallet pass: brand band, ticket name, when it ends and rides so far. The date appears when it runs past midnight. Expired tickets turn grey and say so.' } } },
  decorators: [(S) => <div className="w-[358px]"><S /></div>],
} satisfies Meta<typeof VisitorTicket>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Day: Story = {};
export const SingleRide: Story = { args: { kind: 'single', validUntil: 9 * 60 + 14, rides: 1 } };
export const ThreeDays: Story = { args: { kind: 'days3', validUntil: 3 * 1440 + 8 * 60 + 14, rides: 5 } };
export const Expired: Story = { args: { kind: 'single', validUntil: 9 * 60 + 14, rides: 1, expired: true } };
export const Ukrainian: Story = { globals: { lang: 'uk' }, args: { kind: 'days3', validUntil: 3 * 1440 + 8 * 60 + 14, rides: 5 } };
