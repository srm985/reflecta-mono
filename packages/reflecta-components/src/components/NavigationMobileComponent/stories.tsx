
import {
    faPenToSquare
} from '@fortawesome/free-regular-svg-icons';
import {
    faGear, faHouse
} from '@fortawesome/free-solid-svg-icons';
import {
    Meta,
    StoryObj
} from '@storybook/react';

import NavigationMobileComponent from './index';

import {
    INavigationMobileComponent,
    NavigationItem
} from './types';

type Story = StoryObj<INavigationMobileComponent>;

const meta: Meta = {
    component: NavigationMobileComponent,
    title: 'Navigation - Mobile'
};

const primaryNavigationItem = {
    icon: faPenToSquare,
    label: 'New Entry',
    onClick: () => {}
};

const navigationItemsList: NavigationItem[] = [
    {
        icon: faHouse,
        label: 'Home',
        onClick: () => {}
    },
    {
        icon: faGear,
        label: 'Settings',
        onClick: () => {}
    }
];

export const Default: Story = {
    render: (args: INavigationMobileComponent) => (
        <NavigationMobileComponent
            {...args}
            navigationItems={navigationItemsList}
            primaryNavigationItem={primaryNavigationItem}
        />
    )
};

export default meta;
