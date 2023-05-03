import ButtonComponent from './index';
import {
    IButtonComponent
} from './types';

export default {
    component: ButtonComponent,
    title: 'ButtonComponent'
};

const Template = (args: IButtonComponent) => <ButtonComponent {...args} />;

export const Default = Template.bind({});
