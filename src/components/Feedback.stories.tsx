import type { Meta, StoryObj } from '@storybook/react-vite';
import { Banner } from './Banner';
import { Button } from './Button';
import { Toast } from './Toast';
import { Skeleton, SkeletonRow } from './Skeleton';

const meta = {
  title: 'Components/Feedback',
  parameters: {
    docs: {
      description: {
        component:
          'Banner for states that stay on screen (low balance, offline, service change), toast for a moment of confirmation, skeleton for the 600 ms before live data appears. Each says what happened and what to do next.',
      },
    },
  },
  decorators: [(S) => <div className="flex w-[358px] flex-col gap-3"><S /></div>],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Banners: Story = {
  render: () => (
    <>
      <Banner tone="warn" title="₴6 left" action={<Button size="md" variant="tinted">Top up</Button>}>
        Not enough for a metro ride (₴8).
      </Banner>
      <Banner tone="error" title="Payment didn't go through">Your card was declined. Try another card or Apple Pay.</Banner>
      <Banner tone="offline" title="Works offline">Balance syncs when you are back online.</Banner>
      <Banner tone="info" title="Stop Akademika Pavlova closed today">Trains pass without stopping. Use Studentska.</Banner>
    </>
  ),
};

export const Toasts: Story = {
  render: () => (
    <>
      <Toast message="₴100 added" />
      <Toast message="₴8 returned" />
      <Toast tone="error" message="No connection" />
    </>
  ),
};

export const Skeletons: Story = {
  render: () => (
    <div className="rounded-group bg-surface">
      <SkeletonRow />
      <SkeletonRow />
      <div className="px-4 pb-4">
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  ),
};

export const Ukrainian: Story = {
  render: () => (
    <>
      <Banner tone="warn" title="Залишилось 6 ₴" action={<Button size="md" variant="tinted">Поповнити</Button>}>
        Не вистачає на поїздку в метро (8 ₴).
      </Banner>
      <Toast message="Додано 100 ₴" />
    </>
  ),
};
