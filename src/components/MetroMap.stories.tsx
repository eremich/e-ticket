import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { MetroMap } from './MetroMap';
import { ZoomPan } from './ZoomPan';

const meta = {
  title: 'Components/Metro map',
  component: MetroMap,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Schematic map of the three Kharkiv metro lines with current (post-2024) names: 1 Kholodnohirsko-Zavodska (red), 2 Saltivska (blue), 3 Oleksiivska (green). Transfers are connected pairs. The rider\'s station pulses; a trip dims everything off its path. Every station is focusable and tappable. Wrap in ZoomPan for pinch, wheel and buttons.',
      },
      story: { inline: false, iframeHeight: 700 },
    },
  },
  decorators: [(S) => <div className="h-[680px] w-[390px] bg-canvas"><S /></div>],
} satisfies Meta<typeof MetroMap>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CurrentStation: Story = { name: 'Current station', args: { current: 'saltivska' } };

export const StationSelected: Story = {
  name: 'Station selected',
  render: () => {
    const [sel, setSel] = useState('universytet');
    return <MetroMap current="saltivska" selected={sel} onSelect={setSel} />;
  },
};

export const Transfer: Story = {
  name: 'Trip with a transfer',
  args: {
    path: ['saltivska', 'studentska', 'akademika-pavlova', 'akademika-barabashova', 'kyivska', 'yaroslava-mudroho', 'universytet', 'istorychnyi-muzei', 'maidan-konstytutsii', 'tsentralnyi-rynok', 'vokzalna'],
    train: 'kyivska',
  },
};

export const Zoomable: Story = {
  render: () => (
    <ZoomPan initial={{ scale: 1.4, x: -40, y: 80 }}>
      <MetroMap current="saltivska" onSelect={() => {}} />
    </ZoomPan>
  ),
};

export const Ukrainian: Story = { args: { current: 'saltivska', selected: 'derzhprom' }, globals: { lang: 'uk' } };
