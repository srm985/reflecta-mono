import {
    ReactNode
} from 'react';

export type Action = {
    label: string;
    onClick: () => void;
};

export type IPopoverComponent = {
    actions: {
        groupActions: Action[];
        groupLabel: string;
    }[];
    children: ReactNode | ReactNode[];
    className?: string;
    label: string;
    popoverWidth?: number;
};
