import InputComponent from './index';

import {
    IInputComponent
} from './types';

export default {
    component: InputComponent,
    title: 'InputComponent'
};

const Template = (args: IInputComponent) => <InputComponent {...args} />;

export const Default = Template.bind({});
