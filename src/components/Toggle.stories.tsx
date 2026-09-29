import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Toggle } from './Toggle';

const meta = {
  title: 'Components/Toggle',
  component: Toggle,
  args: { label: 'Auto top-up', checked: true, onChange: () => {} },
  parameters: { docs: { description: { component: 'iOS switch, 51 × 31. Used for auto top-up and notifications. The row holds the visible label.' } } },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  render: (args) => {
    const [on, setOn] = useState(args.checked);
    return <Toggle {...args} checked={on} onChange={setOn} />;
  },
};
export const Off: Story = { args: { checked: false } };
export const Disabled: Story = { args: { disabled: true } };
