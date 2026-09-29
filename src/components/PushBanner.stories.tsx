import type { Meta, StoryObj } from '@storybook/react-vite';
import { PushBanner } from './PushBanner';

const meta = {
  title: 'Components/Push banner',
  component: PushBanner,
  args: { app: 'Eticket', title: 'Vokzalna is next', body: 'Get off at the next stop.', time: 'now' },
  parameters: { docs: { description: { component: 'An iOS notification at the top of the screen: the get-off alert on a live trip and arrival alerts. Drops in with a slight overshoot; a crossfade with reduced motion.' } } },
  decorators: [(S) => <div className="w-[374px] bg-canvas p-2"><S /></div>],
} satisfies Meta<typeof PushBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const GetOff: Story = { name: 'Get off alert' };
export const Arrival: Story = { args: { title: 'Tram 27 in 5 min', body: 'Saltivska metro · towards Tsentralnyi Rynok' } };
export const Ukrainian: Story = { args: { title: 'Наступна: Вокзальна', body: 'Виходьте на наступній станції.', time: 'зараз' }, globals: { lang: 'uk' } };
