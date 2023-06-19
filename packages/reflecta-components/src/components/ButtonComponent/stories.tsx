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
        styleType: 'primary'
    },
    render: (args) => (
        <>
            <StorybookExampleComponent label={'Primary'}>
                <ButtonComponent
                    {...args}
                    color={'primary'}
                >{'Primary Button'}
                </ButtonComponent>
                <ButtonComponent
                    {...args}
                    color={'secondary'}
                >{'Primary Button'}
                </ButtonComponent>
                <ButtonComponent
                    {...args}
                    color={'accent'}
                >{'Primary Button'}
                </ButtonComponent>
            </StorybookExampleComponent>
            <StorybookExampleComponent label={'Primary - Disabled'}>
                <ButtonComponent
                    {...args}
                    color={'primary'}
                    disabled
                >{'Primary Button'}
                </ButtonComponent>
                <ButtonComponent
                    {...args}
                    color={'secondary'}
                    disabled
                >{'Primary Button'}
                </ButtonComponent>
                <ButtonComponent
                    {...args}
                    color={'accent'}
                    disabled
                >{'Primary Button'}
                </ButtonComponent>
            </StorybookExampleComponent>

        </>
    )
};

export const Secondary: Story = {
    args: {
        styleType: 'secondary'
    },
    render: (args) => (
        <>
            <StorybookExampleComponent label={'Secondary'}>
                <ButtonComponent
                    {...args}
                    color={'primary'}
                >{'Secondary Button'}
                </ButtonComponent>
                <ButtonComponent
                    {...args}
                    color={'secondary'}
                >{'Secondary Button'}
                </ButtonComponent>
                <ButtonComponent
                    {...args}
                    color={'accent'}
                >{'Secondary Button'}
                </ButtonComponent>
            </StorybookExampleComponent>
            <StorybookExampleComponent label={'Secondary - Disabled'}>
                <ButtonComponent
                    {...args}
                    color={'primary'}
                    disabled
                >{'Secondary Button'}
                </ButtonComponent>
                <ButtonComponent
                    {...args}
                    color={'secondary'}
                    disabled
                >{'Secondary Button'}
                </ButtonComponent>
                <ButtonComponent
                    {...args}
                    color={'accent'}
                    disabled
                >{'Secondary Button'}
                </ButtonComponent>
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
                    color={'primary'}
                >{'Inline Button'}
                </ButtonComponent>
                <ButtonComponent
                    {...args}
                    color={'secondary'}
                >{'Inline Button'}
                </ButtonComponent>
                <ButtonComponent
                    {...args}
                    color={'accent'}
                >{'Inline Button'}
                </ButtonComponent>
            </StorybookExampleComponent>
            <StorybookExampleComponent label={'Inline Text'}>
                <p>
                    You'll find that something is&nbsp;
                    <ButtonComponent
                        {...args}
                        color={'primary'}
                        href={'#foo'}
                    >{'linked'}
                    </ButtonComponent>&nbsp;here.
                </p>
                <p>
                    You'll find that something is&nbsp;
                    <ButtonComponent
                        {...args}
                        color={'secondary'}
                        href={'#foo'}
                    >{'linked'}
                    </ButtonComponent>&nbsp;here.
                </p>
                <p>
                    You'll find that something is&nbsp;
                    <ButtonComponent
                        {...args}
                        color={'accent'}
                        href={'#foo'}
                    >{'linked'}
                    </ButtonComponent>&nbsp;here.
                </p>
            </StorybookExampleComponent>
            <StorybookExampleComponent label={'Default Inline - Disabled'}>
                <ButtonComponent
                    {...args}
                    color={'primary'}
                    disabled
                >{'Inline Button'}
                </ButtonComponent>
                <ButtonComponent
                    {...args}
                    color={'secondary'}
                    disabled
                >{'Inline Button'}
                </ButtonComponent>
                <ButtonComponent
                    {...args}
                    color={'accent'}
                    disabled
                >{'Inline Button'}
                </ButtonComponent>
            </StorybookExampleComponent>
        </>
    )
};

export default meta;
