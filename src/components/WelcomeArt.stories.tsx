import type { Meta, StoryObj } from '@storybook/react-vite';
import { WelcomeArt } from './WelcomeArt';

const meta = {
  title: 'Components/Welcome art',
  component: WelcomeArt,
  parameters: {
    docs: {
      description: {
        component:
          'The illustration on the Welcome screen: the Kharkiv metro in thin white lines on the brand blue, with the home station marked and trains gliding out and back along each line (still at stations with reduced motion); the logotype sits over it. Decorative; built from the same metro data as the map, so it stays correct.',
      },
    },
  },
  decorators: [(S) => <div className="h-[420px] w-[358px] overflow-hidden rounded-eticket bg-card-face"><S /></div>],
} satisfies Meta<typeof WelcomeArt>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { className: 'h-full w-full' } };
