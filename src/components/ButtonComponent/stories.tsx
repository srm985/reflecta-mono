import type {
    Meta, StoryObj
} from '@storybook/react';

import ButtonComponent from './index';

const meta: Meta<typeof ButtonComponent> = {
    component: ButtonComponent
};

export default meta;
type Story = StoryObj<typeof ButtonComponent>;

export const Primary: Story = {
    render: () => (
        <ButtonComponent
            label={'Button'}
            primary
        />
    )
};
