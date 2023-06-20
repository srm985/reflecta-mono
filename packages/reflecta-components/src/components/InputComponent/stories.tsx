import InputComponent from './index';

import {
    IInputComponent
} from './types';

export default {
    component: InputComponent,
    title: 'Input'
};

const Template = (args: IInputComponent) => <InputComponent {...args} />;

export const Default = Template.bind({});
