import type { Meta, StoryObj } from '@storybook/react-vite';
import { ServiceChangeBanner } from './ServiceChangeBanner';

const meta = {
  title: 'Components/Service change banner',
  component: ServiceChangeBanner,
  args: {
    title: 'Stop Akademika Pavlova closed today',
    body: 'Trains pass without stopping. Your route still works; this one avoids the closure.',
    actionLabel: 'Use alternative',
    onAction: () => {},
  },
  parameters: {
    docs: { description: { component: 'A closed stop or a detour, during a trip or on a saved route. Amber with the warning icon, names the stop, and offers the alternative in one tap. The compact form marks affected routes in lists.' } },
  },
  decorators: [(S) => <div className="w-[358px]"><S /></div>],
} satisfies Meta<typeof ServiceChangeBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithAlternative: Story = {};
export const Compact: Story = { args: { compact: true, title: 'Service change' } };
export const Ukrainian: Story = {
  args: { title: 'Станція Академіка Павлова сьогодні закрита', body: 'Потяги проїжджають без зупинки.', actionLabel: 'Обрати альтернативу' },
  globals: { lang: 'uk' },
};
