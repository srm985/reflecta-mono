
import {
    Meta, StoryObj
} from '@storybook/react';
import {
    useState
} from 'react';

import StorybookExampleComponent from '@components/_internal/StorybookExampleComponent';

import CheckboxComponent from './index';

import {
    ICheckboxComponent
} from './types';

type Story = StoryObj<ICheckboxComponent>;

const meta: Meta = {
    component: CheckboxComponent,
    title: 'Checkbox'
};

export const Default: Story = {
    args: {
        label: 'Sample checkbox'
    },
    render: (args: ICheckboxComponent) => {
        const [
            isChecked,
            setChecked
        ] = useState(false);

        return (
            <>
                <StorybookExampleComponent label={'Enabled'}>
                    <CheckboxComponent
                        {...args}
                        checked={isChecked}
                        onChange={setChecked}
                    />
                    <CheckboxComponent
                        {...args}
                        checked={isChecked}
                        onChange={setChecked}
                        required
                    />
                </StorybookExampleComponent>
                <StorybookExampleComponent label={'Disabled'}>
                    <CheckboxComponent
                        {...args}
                        disabled
                    />
                    <CheckboxComponent
                        {...args}
                        disabled
                        required
                    />
                </StorybookExampleComponent>
            </>
        );
    }
};

export default meta;
