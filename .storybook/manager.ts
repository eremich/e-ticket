import { addons } from 'storybook/manager-api';
import { eticketTheme } from './theme';

addons.setConfig({ theme: eticketTheme, sidebar: { showRoots: true } });
