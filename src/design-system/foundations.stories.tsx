import type { Meta, StoryObj } from '@storybook/react-vite';
import { ColorsPage, FormatsPage, MotionPage, ShapePage, TransportPage, TypePage } from './Foundations';

const meta = { title: 'Foundations/Tokens', tags: ['!autodocs'], parameters: { layout: 'fullscreen' } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Colors: Story = { render: () => <ColorsPage /> };
export const TransportCode: Story = { name: 'Transport code', render: () => <TransportPage /> };
export const Typography: Story = { render: () => <TypePage /> };
export const Formats: Story = { render: () => <FormatsPage /> };
export const ShapeSpaceElevation: Story = { name: 'Shape, space, elevation', render: () => <ShapePage /> };
export const Motion: Story = { render: () => <MotionPage /> };
