import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from './Button';
import { Sheet } from './Sheet';
import { ListGroup, ListRow } from './ListRow';
import { LineBadge } from './LineBadge';

const meta = {
  title: 'Components/Sheet',
  component: Sheet,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Bottom sheet with a grabber and detents, for short focused tasks: a station, a stop, a top-up. Drag the grabber up to the large detent, down to the medium one, and below it to close. Escape, backdrop tap and the close button dismiss. Opens in 300 ms on the drawer curve, closes in 200 ms.',
      },
      story: { inline: false, iframeHeight: 700 },
    },
  },
  args: { open: true, title: 'Saltivska', onClose: () => {}, children: null },
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

const Frame = ({ children, onOpen }: { children: React.ReactNode; onOpen: () => void }) => (
  <div className="relative h-[700px] w-[390px] overflow-hidden bg-canvas p-4">
    <Button size="md" onClick={onOpen}>Open sheet</Button>
    <div id="sheet-root" className="pointer-events-none absolute inset-0" />
    {children}
  </div>
);

export const WithDetents: Story = {
  name: 'Medium and large detents',
  render: (args) => {
    const [open, setOpen] = useState(true);
    return (
      <Frame onOpen={() => setOpen(true)}>
        <Sheet {...args} open={open} onClose={() => setOpen(false)} description="Line 2 · Step-free" detents={['medium', 'large']}>
          <ListGroup header="Next trains">
            <ListRow leading={<LineBadge transport="metro" number={2} size="sm" />} title="To Istorychnyi Muzei" trailing="2 min" />
            <ListRow leading={<LineBadge transport="metro" number={2} size="sm" />} title="To Istorychnyi Muzei" trailing="7 min" />
          </ListGroup>
        </Sheet>
      </Frame>
    );
  },
};

export const FitWithFooter: Story = {
  name: 'Fit content, with footer',
  render: (args) => {
    const [open, setOpen] = useState(true);
    return (
      <Frame onOpen={() => setOpen(true)}>
        <Sheet
          {...args}
          title="Top up"
          open={open}
          onClose={() => setOpen(false)}
          description="Balance ₴6. Fare ₴8."
          footer={<Button block onClick={() => setOpen(false)}>Top up ₴100</Button>}
        >
          <p className="text-body text-ink">Pay with Apple Pay. The balance is ready at the turnstile right away.</p>
        </Sheet>
      </Frame>
    );
  },
};
