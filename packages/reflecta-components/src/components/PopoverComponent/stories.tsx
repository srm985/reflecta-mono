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
        <div style={{
            height: 1000
        }}
        >
            <FlexboxComponent layoutDefault={{
                justifyContent: 'space-between'
            }}
            >
                <FlexboxComponent layoutDefault={{
                    alignItems: 'center'
                }}
                >
                    <PopoverComponent
                        {...args}
                        label={'Test drop - left'}
                    />
                    <p className={'ml--2'}>{'Left-aligned'}</p>
                </FlexboxComponent>
                <FlexboxComponent
                    layoutDefault={{
                        alignItems: 'center',
                        justifyContent: 'flex-end'
                    }}
                >
                    <p className={'mr--2'}>{'Right-aligned'}</p>
                    <PopoverComponent
                        {...args}
                        label={'Test drop - right'}
                    />
                </FlexboxComponent>
            </FlexboxComponent>
        </div>
    )
};
