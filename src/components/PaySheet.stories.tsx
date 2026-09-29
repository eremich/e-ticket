import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from './Button';
import { PaySheet } from './PaySheet';

const meta = {
  title: 'Components/Pay sheet',
  component: PaySheet,
  args: { open: true, amount: 100, merchant: 'Eticket Kharkiv', onDone: () => {}, onCancel: () => {} },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Simulated Apple Pay sheet. Always dark, like the system sheet. It confirms by itself: side button hint → Face ID → check, then calls onDone. Used for top-ups (also inside the declined turnstile screen) and, Face ID only, for transfers.',
      },
      story: { inline: false, iframeHeight: 600 },
    },
  },
} satisfies Meta<typeof PaySheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Replay: Story = {
  render: (args) => {
    const [open, setOpen] = useState(true);
    return (
      <div className="relative h-[600px] w-[390px] overflow-hidden bg-canvas p-4">
        <Button size="md" onClick={() => setOpen(true)}>Pay ₴100</Button>
        <div id="sheet-root" className="pointer-events-none absolute inset-0" />
        <PaySheet {...args} open={open} onDone={() => setOpen(false)} onCancel={() => setOpen(false)} />
      </div>
    );
  },
};

/** Stays on the final step so the confirmed state can be inspected */
export const Confirmed: Story = {
  render: (args) => (
    <div className="relative h-[600px] w-[390px] overflow-hidden bg-canvas p-4">
      <div id="sheet-root" className="pointer-events-none absolute inset-0" />
      <PaySheet {...args} open onDone={() => {}} onCancel={() => {}} />
    </div>
  ),
};
