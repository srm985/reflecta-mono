import {
    IconDefinition
} from '@fortawesome/fontawesome-svg-core';

export type NavigationItem = {
    icon: IconDefinition;
    isActive?: boolean;
    label: string;
    onClick: () => void;
};

export type INavigationMobileComponent = {
    className?: string;
    navigationItems: NavigationItem[];
    primaryNavigationItem: NavigationItem;
};
