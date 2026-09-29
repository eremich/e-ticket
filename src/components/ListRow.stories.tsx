import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Bell, CreditCard, Globe, Lock, Receipt } from '@phosphor-icons/react';
import { ListGroup, ListRow, RowIcon } from './ListRow';
import { Toggle } from './Toggle';

const meta = {
  title: 'Components/List row',
  component: ListRow,
  args: { title: 'Trips' },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Rows of an iOS inset grouped list (Profile, Card actions). ListGroup draws the rounded block, the uppercase footnote header and the hairline separators, inset past the leading icon. Pressable rows get a chevron and a pressed tint.',
      },
    },
  },
  decorators: [(S) => <div className="w-[390px] bg-canvas py-6"><S /></div>],
} satisfies Meta<typeof ListRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Grouped: Story = {
  render: () => {
    const [alerts, setAlerts] = useState(true);
    return (
      <div className="flex flex-col gap-8">
        <ListGroup header="Account" inset="icon">
          <ListRow leading={<RowIcon><Receipt /></RowIcon>} title="Trips" trailing="12" onClick={() => {}} />
          <ListRow leading={<RowIcon><CreditCard /></RowIcon>} title="My cards" subtitle="Eticket · Mom's card" onClick={() => {}} />
          <ListRow
            leading={<RowIcon tone="warn"><Bell /></RowIcon>}
            title="Low balance alert"
            trailing={<Toggle label="Low balance alert" checked={alerts} onChange={setAlerts} />}
          />
        </ListGroup>
        <ListGroup header="App" footer="Changes the language of the app, not of your phone.">
          <ListRow leading={<RowIcon tone="muted"><Globe /></RowIcon>} title="Language" trailing="English" onClick={() => {}} />
        </ListGroup>
        <ListGroup>
          <ListRow leading={<RowIcon tone="error"><Lock /></RowIcon>} title="Block card" destructive onClick={() => {}} chevron={false} />
        </ListGroup>
      </div>
    );
  },
};

export const Ukrainian: Story = {
  render: () => (
    <ListGroup header="Обліковий запис" inset="icon">
      <ListRow leading={<RowIcon><Receipt /></RowIcon>} title="Поїздки" trailing="12" onClick={() => {}} />
      <ListRow leading={<RowIcon><CreditCard /></RowIcon>} title="Мої картки" subtitle="Eticket · Мамина картка" onClick={() => {}} />
      <ListRow leading={<RowIcon tone="muted"><Globe /></RowIcon>} title="Мова" trailing="Українська" onClick={() => {}} />
    </ListGroup>
  ),
};
