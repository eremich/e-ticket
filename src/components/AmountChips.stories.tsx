import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { AmountChips } from './AmountChips';

const meta = {
  title: 'Components/Amount chips',
  component: AmountChips,
  args: { amounts: [50, 100, 200], value: 100, onChange: () => {}, other: true, label: 'Amount' },
  parameters: { docs: { description: { component: 'Top-up and transfer amounts: three presets and Other, which opens a numeric field with its limits. Selected: action tint with a 2 pt ring.' } } },
  decorators: [(S) => <div className="w-[358px]"><S /></div>],
} satisfies Meta<typeof AmountChips>;

export default meta;
type Story = StoryObj<typeof meta>;

const Live = (args: Parameters<typeof AmountChips>[0]) => {
  const [v, setV] = useState(args.value);
  const [custom, setCustom] = useState(args.custom ?? false);
  return <AmountChips {...args} value={v} onChange={setV} custom={custom} onCustom={setCustom} />;
};

export const Presets: Story = { render: (args) => <Live {...args} /> };
export const Other: Story = { args: { custom: true, value: 350 }, render: (args) => <Live {...args} /> };
export const OtherInvalid: Story = { name: 'Other, out of range', args: { custom: true, value: 5 }, render: (args) => <Live {...args} /> };
export const Ukrainian: Story = { globals: { lang: 'uk' }, render: (args) => <Live {...args} /> };
