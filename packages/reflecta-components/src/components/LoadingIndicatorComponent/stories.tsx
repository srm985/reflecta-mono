import {
    Meta,
    StoryObj
} from '@storybook/react';

import LoadingIndicatorComponent from './index';

import {
    ILoadingIndicatorComponent
} from './types';

type Story = StoryObj<ILoadingIndicatorComponent>;

const meta: Meta = {
    component: LoadingIndicatorComponent,
    title: 'Loading Indicator'
};

export const Default: Story = {
    render: (args: ILoadingIndicatorComponent) => (
        <LoadingIndicatorComponent {...args} />
    )
};

export default meta;
