import {
    StoryObj
} from '@storybook/react';

import FlexboxComponent from '@components/FlexboxComponent';

import PopoverComponent from './index';

import {
    IPopoverComponent
} from './types';

type Story = StoryObj<IPopoverComponent>;

export default {
    component: PopoverComponent,
    title: 'Popover'
};

const actions = [
    {
        groupActions: [
            {
                label: 'Settings',
                onClick: () => {}
            }
        ],
        groupLabel: 'default'
    },
    {
        groupActions: [
            {
                label: 'Do something',
                onClick: () => {}
            },
            {
                label: 'My profile',
                onClick: () => {}
            }
        ],
        groupLabel: 'profile'
    },
    {
        groupActions: [
            {
                label: 'Logout',
                onClick: () => {}
            }
        ],
        groupLabel: 'logout'
    }
];

export const Default: Story = {
    args: {
        actions
    },
    render: (args: IPopoverComponent) => (
        <FlexboxComponent justifyContent={'space-between'}>
            <PopoverComponent
                {...args}
                label={'Test drop - left'}
            />
            <PopoverComponent
                {...args}
                label={'Test drop - right'}
            />
        </FlexboxComponent>
    )
};
