import type { Meta, StoryObj } from '@storybook/react-vite';
import { FromTo } from './FromTo';

const meta = {
  title: 'Components/From to',
  component: FromTo,
  args: { fromLabel: 'From', toLabel: 'To', from: 'Current location', fromIsHere: true, placeholder: 'Where to?', swapLabel: 'Swap from and to' },
  parameters: { docs: { description: { component: 'The From / To pair at the top of Routes. From defaults to the current location; To opens search. Swap flips them.' } } },
  decorators: [(S) => <div className="w-[358px] bg-canvas p-2"><S /></div>],
} satisfies Meta<typeof FromTo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};
export const Filled: Story = { args: { to: 'Work · Vokzalna' } };
export const Ukrainian: Story = { args: { fromLabel: 'Звідки', toLabel: 'Куди', from: 'Моє місцезнаходження', to: 'Робота · Вокзальна', placeholder: 'Куди їдемо?', swapLabel: 'Поміняти' }, globals: { lang: 'uk' } };
