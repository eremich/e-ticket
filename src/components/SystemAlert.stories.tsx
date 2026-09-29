import type { Meta, StoryObj } from '@storybook/react-vite';
import { SystemAlert } from './SystemAlert';

const noop = () => {};

const meta = {
  title: 'Components/System alert',
  component: SystemAlert,
  args: {
    title: 'Allow "Eticket" to use your location?',
    body: 'Nearby stops and live arrivals need your location.',
    actions: [
      { label: 'Allow once', onPress: noop },
      { label: 'Allow while using the app', onPress: noop, primary: true },
      { label: "Don't allow", onPress: noop },
    ],
  },
  parameters: { docs: { description: { component: 'Simulated iOS permission alert: a centered 270pt dialog with a blurred surface and vertically stacked buttons split by hairlines. Used for the location prompt in onboarding.' } } },
  decorators: [(S) => <div className="relative h-[420px] w-[390px] bg-canvas"><S /></div>],
} satisfies Meta<typeof SystemAlert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Location: Story = {};
export const TwoButtons: Story = {
  args: { title: 'Turn on Bluetooth?', body: 'Eticket can find validators nearby.', actions: [{ label: 'Not now', onPress: noop }, { label: 'Turn on', onPress: noop, primary: true }] },
};
export const Ukrainian: Story = {
  globals: { lang: 'uk' },
  args: {
    title: 'Дозволити «Eticket» використовувати вашу геопозицію?',
    body: 'Зупинки поруч і прибуття наживо потребують геопозиції.',
    actions: [
      { label: 'Дозволити раз', onPress: noop },
      { label: 'Дозволити під час використання', onPress: noop, primary: true },
      { label: 'Не дозволяти', onPress: noop },
    ],
  },
};
