import type { Meta, StoryObj } from '@storybook/react-vite';
import { Sheet } from './Sheet';
import { StationPanel, type StationPanelProps } from './StationPanel';

const SALTIVSKA: StationPanelProps = {
  line: 2,
  lineName: 'Saltivska',
  stepFree: true,
  directions: [{ towards: 'Istorychnyi Muzei', minutes: [2, 7, 12] }],
  exits: [
    { name: 'Saltivska metro', walkMin: 1, arrivals: [{ transport: 'tram', number: '27', minutes: 3 }, { transport: 'tram', number: '16A', minutes: 7 }] },
    { name: 'Saltivske Shose', walkMin: 3, arrivals: [{ transport: 'trolleybus', number: '35', minutes: 0 }, { transport: 'bus', number: '115', minutes: 11 }] },
  ],
};

const UNIVERSYTET: StationPanelProps = {
  line: 2,
  lineName: 'Saltivska',
  stepFree: false,
  directions: [
    { towards: 'Saltivska', minutes: [4, 9, 14] },
    { towards: 'Istorychnyi Muzei', minutes: [1, 6, 11] },
  ],
  transfer: { name: 'Derzhprom', line: 3 },
  exits: [],
};

const meta = {
  title: 'Components/Station sheet',
  component: StationPanel,
  args: SALTIVSKA,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Opens from a station on the metro map or from the nearest station on Home. Medium detent first, drag up for the exits. Trains both ways (one at a terminus), the transfer, step-free access, what waits at the exits, and Route from here / to here.',
      },
      story: { inline: false, iframeHeight: 760 },
    },
  },
  render: (args) => (
    <div className="relative h-[760px] w-[390px] overflow-hidden bg-canvas">
      <div id="sheet-root" className="pointer-events-none absolute inset-0" />
      <Sheet open title={args.lineName === 'Saltivska' && args.transfer ? 'Universytet' : 'Saltivska'} onClose={() => {}} detents={['large']}>
        <StationPanel {...args} />
      </Sheet>
    </div>
  ),
} satisfies Meta<typeof StationPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Terminus: Story = {};
export const WithTransfer: Story = { name: 'With transfer', args: UNIVERSYTET };
export const Ukrainian: Story = {
  globals: { lang: 'uk' },
  args: {
    ...SALTIVSKA,
    lineName: 'Салтівська',
    directions: [{ towards: 'Історичний музей', minutes: [2, 7, 12] }],
    exits: [{ name: 'Метро «Салтівська»', walkMin: 1, arrivals: [{ transport: 'tram', number: '27', minutes: 3 }] }],
  },
};
