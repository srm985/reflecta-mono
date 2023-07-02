import {
    ReactNode
} from 'react';

export type ClickAction = () => void;

export type Action = {
    actionLabel?: string;
    label: string;
    onClick: ClickAction;
};

export type ActionLabeled = {
    actionLabel: string;
    label: ReactNode;
    onClick: ClickAction;
};

export type IPopoverComponent = {
    actions: {
        groupActions: (Action | ActionLabeled)[];
        groupLabel: string;
    }[];
    className?: string;
    label: string;
    popoverWidth?: number;
};
