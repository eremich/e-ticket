import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { TicketOption } from './TicketOption';

const meta = {
  title: 'Components/Ticket option',
  component: TicketOption,
  args: { name: '1 day', body: 'Unlimited rides for 24 hours', price: '₴60', selected: false, onSelect: () => {} },
  parameters: { docs: { description: { component: 'A ticket the visitor can pick: name, what it covers and the price. It is a radio card; selected takes the action tint and a 2px action ring so it never relies on color alone (the ring is the shape cue).' } } },
  decorators: [(S) => <div className="w-[358px]"><S /></div>],
} satisfies Meta<typeof TicketOption>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Selected: Story = { args: { selected: true } };
export const Group: Story = {
  render: () => {
    const [k, setK] = useState('day');
    const items = [
      { key: 'single', name: 'Single ride', body: 'One ride, transfers free for 60 min', price: '₴8' },
      { key: 'day', name: '1 day', body: 'Unlimited rides for 24 hours', price: '₴60' },
      { key: 'days3', name: '3 days', body: 'Unlimited rides for 72 hours', price: '₴150' },
    ];
    return (
      <div role="radiogroup" aria-label="Tickets" className="flex flex-col gap-3">
        {items.map((i) => (
          <div key={i.key}><TicketOption name={i.name} body={i.body} price={i.price} selected={k === i.key} onSelect={() => setK(i.key)} /></div>
        ))}
      </div>
    );
  },
};
export const Ukrainian: Story = { globals: { lang: 'uk' }, args: { name: '3 дні', body: 'Безлімітні поїздки 72 години', price: '150 ₴', selected: true } };
