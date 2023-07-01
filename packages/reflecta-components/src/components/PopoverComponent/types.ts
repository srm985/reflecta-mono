export type Action = {
    label: string;
    onClick: () => void;
};

export type IPopoverComponent = {
    actions: {
        groupActions: Action[];
        groupLabel: string;
    }[];
    className?: string;
    label: string;
    popoverWidth?: number;
};
