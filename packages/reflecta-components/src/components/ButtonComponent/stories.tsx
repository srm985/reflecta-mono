import ButtonComponent from './index';
import {
    IButtonComponent
} from './types';

export default {
    component: ButtonComponent,
    title: 'Button'
};

const Template = (args: IButtonComponent) => <ButtonComponent {...args} />;

export const Default = Template.bind({});
