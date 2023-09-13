import {
    Meta,
    StoryObj
} from '@storybook/react';

import StorybookExampleComponent from '@components/_internal/StorybookExampleComponent';

import FieldDisplayComponent from './index';

import {
    IFieldDisplayComponent
} from './types';

type Story = StoryObj<IFieldDisplayComponent>;

const meta: Meta = {
    component: FieldDisplayComponent,
    title: 'Field Display'
};

export const Primary: Story = {
    render: (args: IFieldDisplayComponent) => (
        <StorybookExampleComponent label={'Primary'}>
            <FieldDisplayComponent
                {...args}
                label={'First name'}
                value={'Claude'}
            />
            <FieldDisplayComponent
                {...args}
                label={'Last name'}
                value={'Reilly'}
            />
        </StorybookExampleComponent>
    )
};

export default meta;
