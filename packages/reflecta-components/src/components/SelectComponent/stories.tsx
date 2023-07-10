import {
    Meta,
    StoryObj
} from '@storybook/react';
import {
    useState
} from 'react';

import StorybookExampleComponent from '@components/_internal/StorybookExampleComponent';

import SelectComponent from './index';

import {
    ISelectComponent, Option
} from './types';

type Story = StoryObj<ISelectComponent>;

const meta: Meta = {
    component: SelectComponent,
    title: 'Select'
};

const options: Option[] = [
    {
        label: 'Labore irure occaecat occaecat consequat tempor deserunt',
        value: 'a'
    },
    {
        label: 'Nulla cillum',
        value: 'b'
    },
    {
        label: 'Pariatur ipsum aliqua officia velit duis Lorem proident mollit',
        value: 'c'
    },
    {
        label: 'Excepteur consectetur amet',
        value: 'd'
    },
    {
        label: 'Anim sit nostrud',
        value: 'e'
    },
    {
        label: 'Excepteur proident nisi',
        value: 'f'
    }
];

export const Default: Story = {
    args: {
        label: 'Sample select',
        name: 'sampleSelect',
        options
    },
    render: (args: ISelectComponent) => {
        const [
            selectedOption1,
            setSelectedOption1
        ] = useState('');
        const [
            selectedOption2,
            setSelectedOption2
        ] = useState('b');
        const [
            selectedOption3,
            setSelectedOption3
        ] = useState('');

        return (
            <>
                <StorybookExampleComponent label={'Enabled'}>
                    <SelectComponent
                        {...args}
                        onChange={setSelectedOption1}
                        value={selectedOption1}
                    />
                    <SelectComponent
                        {...args}
                        onChange={setSelectedOption1}
                        required
                        value={selectedOption1}
                    />
                    <SelectComponent
                        {...args}
                        label={'Preselected'}
                        onChange={setSelectedOption2}
                        value={selectedOption2}
                    />
                    <SelectComponent
                        {...args}
                        label={'Placeholder'}
                        onChange={setSelectedOption3}
                        placeholder={'Select an option'}
                        value={selectedOption3}
                    />
                </StorybookExampleComponent>
                <StorybookExampleComponent label={'Disabled'}>
                    <SelectComponent
                        {...args}
                        disabled
                        onChange={() => {}}
                        value={''}
                    />
                    <SelectComponent
                        {...args}
                        disabled
                        onChange={() => {}}
                        required
                        value={''}
                    />
                    <SelectComponent
                        {...args}
                        disabled
                        label={'Preselected'}
                        onChange={() => {}}
                        value={'d'}
                    />
                    <SelectComponent
                        {...args}
                        label={'Placeholder'}
                        onChange={setSelectedOption3}
                        placeholder={'Select an option'}
                        value={selectedOption3}
                    />
                </StorybookExampleComponent>
            </>
        );
    }
};

export default meta;
