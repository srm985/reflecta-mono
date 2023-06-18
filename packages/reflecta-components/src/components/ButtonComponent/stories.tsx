import {
    Meta,
    StoryObj
} from '@storybook/react';

import StorybookExampleComponent from '@components/StorybookExampleComponent';

import ButtonComponent from './index';

import {
    IButtonComponent
} from './types';

type Story = StoryObj<IButtonComponent>;

const meta: Meta<IButtonComponent> = {
    component: ButtonComponent,
    title: 'ButtonComponent'
};

// const Default = (args: IButtonComponent) => (<ButtonComponent {...args} />);

export const Primary: Story = {
    args: {
        label: 'Primary Button',
        styleType: 'primary'
    },
    render: (args) => (
        <>
            <StorybookExampleComponent label={'Primary'}>
                <ButtonComponent
                    {...args}
                    label={'Primary Button'}
                />
            </StorybookExampleComponent>
            <StorybookExampleComponent label={'Primary - Disabled'}>
                <ButtonComponent
                    {...args}
                    disabled
                    label={'Primary Button'}
                />
            </StorybookExampleComponent>

        </>
    )
};

export const Secondary: Story = {
    args: {
        label: 'Secondary Button',
        styleType: 'secondary'
    },
    render: (args) => (
        <>
            <StorybookExampleComponent label={'Secondary'}>
                <ButtonComponent
                    {...args}
                    label={'Secondary Button'}
                />
            </StorybookExampleComponent>
            <StorybookExampleComponent label={'Secondary - Disabled'}>
                <ButtonComponent
                    {...args}
                    disabled
                    label={'Secondary Button'}
                />
            </StorybookExampleComponent>

        </>
    )
};

export const Inline: Story = {
    args: {
        styleType: 'inline'
    },
    render: (args) => (
        <>
            <StorybookExampleComponent label={'Default Inline'}>
                <ButtonComponent
                    {...args}
                    label={'InlineButton'}
                />
            </StorybookExampleComponent>
            <StorybookExampleComponent label={'Inline Text'}>
                <p>
                    You'll fine that something is <ButtonComponent
                        {...args}
                        label={'linked'}
                    /> here.
                </p>
            </StorybookExampleComponent>

        </>
    )
};

export default meta;
