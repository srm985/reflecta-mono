import {
    IconDefinition
} from '@fortawesome/free-regular-svg-icons';

export type NavigationItem = {
    icon: IconDefinition;
    label: string;
    onClick: () => void;
};

export type INavigationMobileComponent = {
    className?: string;
    navigationItems: NavigationItem[];
    primaryNavigationItem: NavigationItem;
};
