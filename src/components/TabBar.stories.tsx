import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { CreditCard, House, Path, User } from '@phosphor-icons/react';
import { TabBar } from './TabBar';

const meta = {
  title: 'Components/Tab bar',
  component: TabBar,
  parameters: {
    docs: {
      description: {
        component:
          'Four labeled tabs: Home, Routes, Card, Profile. Classic iOS bar: solid surface with a hairline, no floating glass. A red dot on a tab means something needs attention (low balance on Card).',
      },
    },
  },
  decorators: [(S) => <div className="w-[390px]"><S /></div>],
} satisfies Meta<typeof TabBar>;

export default meta;
type Story = StoryObj;

const EN = [
  { key: 'home', label: 'Home', icon: House },
  { key: 'routes', label: 'Routes', icon: Path },
  { key: 'card', label: 'Card', icon: CreditCard, badge: true },
  { key: 'profile', label: 'Profile', icon: User },
];

export const Default: Story = {
  render: () => {
    const [active, setActive] = useState('home');
    return <TabBar items={EN} active={active} onSelect={setActive} />;
  },
};

export const Ukrainian: Story = {
  render: () => {
    const [active, setActive] = useState('routes');
    const labels = ['Головна', 'Маршрути', 'Картка', 'Профіль'];
    return <TabBar items={EN.map((t, i) => ({ ...t, label: labels[i] }))} active={active} onSelect={setActive} />;
  },
};
