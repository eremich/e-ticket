import type { Meta, StoryObj } from '@storybook/react-vite';
import { StatusTimeline, type TimelineStep } from './StatusTimeline';

const meta = {
  title: 'Components/Status timeline',
  component: StatusTimeline,
  args: { label: 'Request status', steps: [] },
  parameters: {
    docs: {
      description: {
        component:
          'Vertical progress for a problem report, a refund or a reduced-fare renewal. Done steps are filled green with a check, the current step has an action ring, upcoming steps are empty and a failed step turns red with a cross. Every step says what happened and, when useful, when.',
      },
    },
  },
  decorators: [(S) => <div className="w-[358px] rounded-group bg-surface p-4"><S /></div>],
} satisfies Meta<typeof StatusTimeline>;

export default meta;
type Story = StoryObj<typeof meta>;

const s = (state: TimelineStep['state'], title: string, when?: string, body?: string): TimelineStep => ({ state, title, when, body });

export const RefundPending: Story = {
  args: { steps: [s('done', 'Second charge found', '07:52'), s('current', 'Returning ₴8', undefined, 'Back on your card in a moment')] },
};
export const Refunded: Story = {
  args: { steps: [s('done', 'Second charge found', '07:52'), s('done', '₴8 back on your card', '08:14')] },
};
export const RequestSent: Story = {
  args: { steps: [s('current', 'Request sent', 'Today, 08:14'), s('upcoming', 'In review'), s('upcoming', 'Answer', undefined, 'Within 3 days')] },
};
export const InReview: Story = {
  args: { steps: [s('done', 'Request sent', 'Today, 08:14'), s('current', 'In review', undefined, 'We check the trip with the validator log.'), s('upcoming', 'Answer', undefined, 'Within 3 days')] },
};
export const Answered: Story = {
  args: { steps: [s('done', 'Request sent', '13 Oct'), s('done', 'In review', '14 Oct'), s('done', 'Answered', '15 Oct', 'The charge is fixed. Balance updated.')] },
};

const RENEW = { label: 'Renewal status' };
export const RenewalReminder: Story = {
  args: { ...RENEW, steps: [s('current', 'Reminder', '16 Jun 2027', 'We remind you 14 days before it ends'), s('upcoming', 'Photo uploaded'), s('upcoming', 'Checked'), s('upcoming', 'Renewed until 30.06.2028')] },
};
export const RenewalUploaded: Story = {
  args: { ...RENEW, steps: [s('done', 'Reminder', '16 Jun 2027'), s('done', 'Photo uploaded', '13 Oct'), s('current', 'Checked', undefined, 'Usually a few minutes'), s('upcoming', 'Renewed until 30.06.2028')] },
};
export const RenewalApproved: Story = {
  args: { ...RENEW, steps: [s('done', 'Reminder', '16 Jun 2027'), s('done', 'Photo uploaded', '13 Oct'), s('done', 'Checked', '13 Oct'), s('done', 'Renewed until 30.06.2028')] },
};
export const RenewalDeclined: Story = {
  args: { ...RENEW, steps: [s('done', 'Reminder', '16 Jun 2027'), s('done', 'Photo uploaded', '13 Oct'), s('error', 'Photo declined', '13 Oct', 'The photo is blurry. Upload a clearer one.'), s('upcoming', 'Renewed')] },
};
export const Ukrainian: Story = {
  globals: { lang: 'uk' },
  args: {
    label: 'Стан звернення',
    steps: [s('done', 'Звернення надіслано', 'Сьогодні, 08:14'), s('current', 'Розглядаємо', undefined, 'Звіряємо поїздку з журналом валідатора.'), s('upcoming', 'Відповідь', undefined, 'Протягом 3 днів')],
  },
};
