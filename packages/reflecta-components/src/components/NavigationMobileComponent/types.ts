import {
    IconDefinition
} from '@fortawesome/fontawesome-svg-core';

type NavigationItemBase = {
    icon: IconDefinition;
    isActive?: boolean;
    onClick: () => void;
};

type NavigationItemWithAriaLabel = NavigationItemBase & {
    ariaLabel: string;
    label?: string;
};

type NavigationItemWithLabel = NavigationItemBase & {
    ariaLabel?: string;
    label: string;
};

export type NavigationItem = NavigationItemWithAriaLabel | NavigationItemWithLabel;

export type INavigationMobileComponent = {
    className?: string;
    navigationItems: NavigationItem[];
    primaryNavigationItem: NavigationItem;
};
