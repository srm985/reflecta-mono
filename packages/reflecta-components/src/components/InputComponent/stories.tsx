import {
    Meta,
    StoryObj
} from '@storybook/react';
import {
    useState
} from 'react';

import StorybookExampleComponent from '@components/_internal/StorybookExampleComponent';

import InputComponent from './index';

import {
    IInputComponent
} from './types';

type Story = StoryObj<IInputComponent>;

const meta: Meta = {
    component: InputComponent,
    title: 'Input'
};

export const Default: Story = {
    render: (args: IInputComponent) => {
        const [
            firstName,
            setFirstName
        ] = useState('');
        const [
            emailAddress,
            setEmailAddress
        ] = useState('');

        return (
            <>
                <StorybookExampleComponent label={'Enabled'}>
                    <InputComponent
                        {...args}
                        label={'First name'}
                        name={'firstName'}
                        onChange={setFirstName}
                        value={firstName}
                    />
                    <InputComponent
                        {...args}
                        label={'Email address'}
                        name={'emailAddress'}
                        onChange={setEmailAddress}
                        required
                        type={'email'}
                        value={emailAddress}
                    />
                </StorybookExampleComponent>
                <StorybookExampleComponent label={'Disabled'}>
                    <InputComponent
                        {...args}
                        disabled
                        label={'First name'}
                        name={'firstName'}
                        onChange={() => {}}
                        value={''}
                    />
                    <InputComponent
                        {...args}
                        disabled
                        label={'Email address'}
                        name={'emailAddress'}
                        onChange={() => {}}
                        required
                        type={'email'}
                        value={''}
                    />
                </StorybookExampleComponent>
            </>
        );
    }
};

export default meta;
