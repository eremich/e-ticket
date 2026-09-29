import type { Meta, StoryObj } from '@storybook/react-vite';
import { MapTrifold } from '@phosphor-icons/react';
import { NavBar } from './NavBar';

const meta = {
  title: 'Components/Nav bar',
  component: NavBar,
  args: { title: 'Home' },
  parameters: {
    docs: {
      description: {
        component:
          'iOS navigation bar. Tab roots use a large title that collapses into the compact 44 pt bar when it scrolls under it; pushed screens use the compact bar with a back button. The collapsed title is aria-hidden so screen readers hear one heading.',
      },
    },
  },
} satisfies Meta<typeof NavBar>;

export default meta;
type Story = StoryObj<typeof meta>;

const IconButton = () => (
  <button type="button" aria-label="Metro map" className="press flex size-11 items-center justify-end text-action">
    <MapTrifold aria-hidden className="size-6" />
  </button>
);

export const LargeCollapsing: Story = {
  name: 'Large title collapsing on scroll',
  render: () => (
    <div className="scroll-area relative h-[480px] w-[390px] overflow-y-auto bg-canvas">
      <NavBar large title="Routes" trailing={<IconButton />} />
      <div className="flex flex-col gap-3 px-4 pb-6">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="h-20 rounded-group bg-surface" />
        ))}
      </div>
    </div>
  ),
};

export const Compact: Story = {
  name: 'Compact with back',
  render: () => (
    <div className="w-[390px] bg-canvas">
      <NavBar title="Tram 27" onBack={() => {}} backLabel="Home" />
    </div>
  ),
};

export const Ukrainian: Story = {
  render: () => (
    <div className="w-[390px] bg-canvas">
      <NavBar large title="Маршрути" />
      <NavBar title="Трамвай 27" onBack={() => {}} backLabel="Головна" />
    </div>
  ),
};
