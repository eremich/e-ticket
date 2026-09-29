import type { Meta, StoryObj } from '@storybook/react-vite';
import { Bell, Plus } from '@phosphor-icons/react';
import { Button } from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  args: { children: 'Top up ₴100', variant: 'filled', size: 'lg' },
  parameters: {
    docs: {
      description: {
        component:
          'iOS button styles. Filled appears once per screen and says what happens: "Top up ₴100", "Notify me", "Block card". Scales to 0.97 on press. Heights: lg 52, md 44.',
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Filled: Story = {};
export const Tinted: Story = { args: { variant: 'tinted', children: 'Notify me', icon: <Bell aria-hidden className="size-5" /> } };
export const Gray: Story = { args: { variant: 'gray', children: 'Add card', icon: <Plus aria-hidden className="size-5" /> } };
export const Plain: Story = { args: { variant: 'plain', children: 'Enter card number' } };
export const Destructive: Story = { args: { variant: 'destructive', children: 'Block card' } };
export const Loading: Story = { args: { loading: true, children: 'Paying…' } };
export const Disabled: Story = { args: { disabled: true, children: 'Transfer' } };
export const Ukrainian: Story = { args: { children: 'Поповнити на 100 ₴' } };

export const States: Story = {
  render: () => (
    <div className="grid grid-cols-5 gap-3">
      {(['filled', 'tinted', 'gray', 'plain', 'destructive'] as const).map((v) => (
        <div key={v} className="flex flex-col gap-2">
          <Button variant={v} size="md">Default</Button>
          <Button variant={v} size="md" id={`hover-${v}`}>Hover</Button>
          <Button variant={v} size="md" id={`focus-${v}`}>Focus</Button>
          <Button variant={v} size="md" id={`active-${v}`}>Pressed</Button>
          <Button variant={v} size="md" disabled>Disabled</Button>
        </div>
      ))}
    </div>
  ),
  parameters: {
    pseudo: {
      hover: ['#hover-filled', '#hover-tinted', '#hover-gray', '#hover-plain', '#hover-destructive'],
      focusVisible: ['#focus-filled', '#focus-tinted', '#focus-gray', '#focus-plain', '#focus-destructive'],
      active: ['#active-filled', '#active-tinted', '#active-gray', '#active-plain', '#active-destructive'],
    },
  },
};
