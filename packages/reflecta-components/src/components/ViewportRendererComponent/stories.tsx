import {
    Meta,
    StoryObj
} from '@storybook/react';

import ViewportRendererComponent from './index';

import {
    IViewportRendererComponent
} from './types';

type Story = StoryObj<IViewportRendererComponent>;

const meta: Meta = {
    component: ViewportRendererComponent,
    title: 'Viewport Renderer'
};

export const Default: Story = {
    render: (args: IViewportRendererComponent) => (
        <ViewportRendererComponent
            {...args}
            viewportOptions={{
                breakpointBeginMedium: <p>{'This is the desktop view...'}</p>
            }}
        >
            <p>{'This is the default view...'}</p>
        </ViewportRendererComponent>
    )
};

export default meta;
