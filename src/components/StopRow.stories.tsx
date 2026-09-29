import type { Meta, StoryObj } from '@storybook/react-vite';
import { NearestStation, StopRow } from './StopRow';

const meta = {
  title: 'Components/Stop row',
  component: StopRow,
  args: {
    name: 'Saltivska metro',
    walkMin: 3,
    meters: 220,
    transport: 'tram',
    arrivals: [
      { transport: 'tram', number: '27', minutes: 3 },
      { transport: 'tram', number: '16A', minutes: 7 },
    ],
  },
  parameters: {
    docs: {
      description: {
        component:
          'Home lists arrivals, not stops. The nearest metro station comes first with a chip per direction; nearby surface stops follow with a chip per line. Tap the row for the stop, a chip for its line. Without live data the chips switch to muted timetable times.',
      },
    },
  },
  decorators: [(S) => <div className="w-[390px] bg-canvas p-4"><S /></div>],
} satisfies Meta<typeof StopRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { decorators: [(S) => <div className="rounded-group bg-surface"><S /></div>] };

export const Nearest: Story = {
  name: 'Nearest station',
  render: () => (
    <NearestStation
      name="Saltivska"
      line={2}
      lineName="Saltivska"
      walkMin={3}
      stepFree
      directions={[{ transport: 'metro', number: 2, towards: 'Istorychnyi Muzei', minutes: 2 }]}
      onClick={() => {}}
    />
  ),
};

export const NoLiveData: Story = {
  name: 'No live data',
  args: {
    arrivals: [
      { transport: 'tram', number: '27', scheduled: 500 },
      { transport: 'tram', number: '16A', scheduled: 506 },
    ],
  },
  decorators: [(S) => <div className="rounded-group bg-surface"><S /></div>],
};

export const Ukrainian: Story = {
  globals: { lang: 'uk' },
  render: () => (
    <div className="flex flex-col gap-4">
      <NearestStation name="Салтівська" line={2} lineName="Салтівська" walkMin={3} stepFree directions={[{ transport: 'metro', number: 2, towards: 'Історичний музей', minutes: 2 }]} />
      <div className="rounded-group bg-surface">
        <StopRow
          name="Метро «Салтівська»"
          walkMin={3}
          meters={220}
          transport="tram"
          favorite
          arrivals={[
            { transport: 'tram', number: '27', minutes: 3 },
            { transport: 'tram', number: '16A', minutes: 7 },
          ]}
        />
      </div>
    </div>
  ),
};
