import {
    Meta,
    StoryObj
} from '@storybook/react';

import StorybookExampleComponent from '@components/_internal/StorybookExampleComponent';

import ButtonComponent from './index';

import {
    Color,
    IButtonComponent
} from './types';

type Story = StoryObj<IButtonComponent>;

const meta: Meta = {
    component: ButtonComponent,
    title: 'Button'
};

const buttonColorList: Color[] = [
    'primary',
    'secondary',
    'accent',
    'success',
    'warning',
    'danger',
    'neutral'
];

const generateButtons = (args: IButtonComponent, label: string, isDisabled?: boolean) => buttonColorList.map((buttonColor) => (
    <ButtonComponent
        {...args}
        color={buttonColor}
        disabled={isDisabled}
    >
        {label}
    </ButtonComponent>
));

export const Primary: Story = {
    args: {
        styleType: 'primary'
    },
    render: (args: IButtonComponent) => (
        <>
            <StorybookExampleComponent label={'Primary'}>
                {generateButtons(args, 'Primary button')}
            </StorybookExampleComponent>
            <StorybookExampleComponent label={'Primary - Disabled'}>
                {generateButtons(args, 'Primary button', true)}
            </StorybookExampleComponent>
        </>
    )
};

export const Secondary: Story = {
    args: {
        styleType: 'secondary'
    },
    render: (args: IButtonComponent) => (
        <>
            <StorybookExampleComponent label={'Secondary'}>
                {generateButtons(args, 'Secondary button')}
            </StorybookExampleComponent>
            <StorybookExampleComponent label={'Secondary - Disabled'}>
                {generateButtons(args, 'Secondary button', true)}
            </StorybookExampleComponent>
        </>
    )
};

export const Inline: Story = {
    args: {
        styleType: 'inline'
    },
    render: (args: IButtonComponent) => (
        <>
            <StorybookExampleComponent label={'Default Inline'}>
                {generateButtons(args, 'Inline button')}
            </StorybookExampleComponent>
            <StorybookExampleComponent label={'Inline Text'}>
                <p>
                    You'll find that something is&nbsp;
                    <ButtonComponent
                        {...args}
                        color={'primary'}
                        href={'#foo'}
                        type={undefined}
                    >{'linked'}
                    </ButtonComponent>&nbsp;here.
                </p>
                <p>
                    You'll find that something is&nbsp;
                    <ButtonComponent
                        {...args}
                        color={'secondary'}
                        href={'#foo'}
                        isAccented={false}
                        styleType={'inline'}
                        type={undefined}
                    >{'linked'}
                    </ButtonComponent>&nbsp;here.
                </p>
                <p>
                    You'll find that something is&nbsp;
                    <ButtonComponent
                        {...args}
                        color={'accent'}
                        href={'#foo'}
                        type={undefined}
                    >{'linked'}
                    </ButtonComponent>&nbsp;here.
                </p>
            </StorybookExampleComponent>
            <StorybookExampleComponent label={'Default Inline - Disabled'}>
                {generateButtons(args, 'Inline button', true)}
            </StorybookExampleComponent>
        </>
    )
};

export default meta;
