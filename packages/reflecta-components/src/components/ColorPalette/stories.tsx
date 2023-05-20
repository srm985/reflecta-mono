import ColorPaletteComponent from './index';
import {
    IColorPalette
} from './types';

export default {
    component: ColorPaletteComponent,
    title: 'ColorPalette'
};

const Template = (args: IColorPalette) => <ColorPaletteComponent {...args} />;

export const Default = Template.bind({});
