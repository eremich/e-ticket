import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { CardNumberField } from './CardNumberField';

const meta = {
  title: 'Components/Card number field',
  component: CardNumberField,
  args: { value: '', onChange: () => {} },
  parameters: { docs: { description: { component: 'Eticket number entry for onboarding: 16 digits grouped by four, must start with 0124, with a drawing of the card back that highlights where the number is printed.' } } },
  decorators: [(S) => <div className="w-[358px]"><S /></div>],
  render: (args) => {
    const [v, setV] = useState(args.value);
    return <CardNumberField value={v} onChange={setV} />;
  },
} satisfies Meta<typeof CardNumberField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};
export const Valid: Story = { args: { value: '0124 0431 7788 9016' } };
export const WrongStart: Story = { args: { value: '0555 12' } };
export const Ukrainian: Story = { globals: { lang: 'uk' }, args: { value: '0124 04' } };
