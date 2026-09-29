import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProblemReport, type ReportReasonKey } from './ProblemReport';

const meta = {
  title: 'Components/Problem report',
  component: ProblemReport,
  args: { reason: null, note: '', onReasonChange: () => {}, onNoteChange: () => {}, onSubmit: () => {} },
  parameters: {
    docs: {
      description: {
        component: 'Report a problem with a trip: three reasons as a radio list, an optional note, and one button that says what happens. Send stays off until a reason is picked.',
      },
    },
  },
  decorators: [(S) => <div className="flex min-h-[560px] w-[390px] flex-col bg-canvas"><S /></div>],
} satisfies Meta<typeof ProblemReport>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};
export const ReasonPicked: Story = { args: { reason: 'double', note: 'Two charges at 07:52.' } };
export const Interactive: Story = {
  render: (args) => {
    const [reason, setReason] = useState<ReportReasonKey | null>(null);
    const [note, setNote] = useState('');
    return <ProblemReport {...args} reason={reason} onReasonChange={setReason} note={note} onNoteChange={setNote} />;
  },
};
export const Ukrainian: Story = { globals: { lang: 'uk' }, args: { reason: 'gate' } };
