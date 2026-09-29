import type { Meta, StoryObj } from '@storybook/react-vite';
import { CardRow } from './CardRow';

const meta = {
  title: 'Components/Card row',
  component: CardRow,
  args: { name: 'Eticket', number: '0124 0125 0556 2255', balance: 98, onClick: () => {} },
  parameters: { docs: { description: { component: 'One card in Profile > My cards: a small card thumbnail, its name, the last four digits and the balance. Blocked cards lose their color.' } } },
  decorators: [(S) => <div className="w-[390px] rounded-group bg-surface"><S /></div>],
} satisfies Meta<typeof CardRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Plastic: Story = {};
export const Virtual: Story = { args: { kind: 'virtual', name: 'Virtual card', number: '0124 0777 3301 5210', balance: 6 } };
export const Blocked: Story = { args: { blocked: true, balance: 0 } };
export const Ukrainian: Story = { globals: { lang: 'uk' }, args: { name: 'Мамина картка', number: '0124 0987 1120 5518', balance: 34, blocked: true } };
