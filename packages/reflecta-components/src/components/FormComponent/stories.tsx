import FormComponent from './index';

import {
    IFormComponent
} from './types';

export default {
    component: FormComponent,
    title: 'Form'
};

const Template = (args: IFormComponent) => <FormComponent {...args} />;

export const Default = Template.bind({});
