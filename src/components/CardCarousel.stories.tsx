import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { CardCarousel } from './CardCarousel';

const CARDS = [
  { id: 'main', name: 'Eticket', number: '0124 0125 0556 2255', balance: 98, fare: 8, express: true },
  { id: 'mom', name: "Mom's card", number: '0124 0987 1120 5518', balance: 34, fare: 8 },
  { id: 'virtual', name: 'Olena', number: '9900 1204 7781 3306', balance: 12, fare: 8, kind: 'virtual' as const },
];

const meta = {
  title: 'Components/Card carousel',
  component: CardCarousel,
  args: { cards: CARDS, active: 'main', onChange: () => {} },
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Several cards on the Card tab: swipe horizontally with snap, the next card peeks in and the others dim slightly. Dots show position and switch cards.' } },
  },
  decorators: [(S) => <div className="w-[390px] bg-canvas py-4"><S /></div>],
} satisfies Meta<typeof CardCarousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  render: (args) => {
    const [active, setActive] = useState(args.active);
    return <CardCarousel {...args} active={active} onChange={setActive} />;
  },
};
export const Single: Story = { args: { cards: CARDS.slice(0, 1) } };
