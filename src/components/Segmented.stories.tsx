import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Segmented } from './Segmented';

const meta = {
  title: 'Components/Segmented',
  component: Segmented,
  parameters: {
    docs: { description: { component: 'iOS segmented control for two or three views of the same content: List / Map, Weekday / Weekend. The thumb slides in 200 ms.' } },
  },
  decorators: [(S) => <div className="w-[358px]"><S /></div>],
} satisfies Meta<typeof Segmented>;

export default meta;
type Story = StoryObj;

export const ListMap: Story = {
  name: 'List / Map',
  render: () => {
    const [v, setV] = useState<'list' | 'map'>('list');
    return <Segmented label="View" value={v} onChange={setV} options={[{ key: 'list', label: 'List' }, { key: 'map', label: 'Map' }]} />;
  },
};

export const Timetable: Story = {
  render: () => {
    const [v, setV] = useState<'weekday' | 'weekend'>('weekday');
    return <Segmented label="Days" value={v} onChange={setV} options={[{ key: 'weekday', label: 'Weekday' }, { key: 'weekend', label: 'Weekend' }]} />;
  },
};

export const Ukrainian: Story = {
  render: () => {
    const [v, setV] = useState<'weekday' | 'weekend'>('weekend');
    return <Segmented label="Дні" value={v} onChange={setV} options={[{ key: 'weekday', label: 'Будні' }, { key: 'weekend', label: 'Вихідні' }]} />;
  },
};
