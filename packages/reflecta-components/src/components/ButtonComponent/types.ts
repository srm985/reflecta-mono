import {
    ReactNode
} from 'react';

export type Color = 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger' | 'neutral';

export type StyleType = 'primary' | 'secondary' | 'inline';

export type SharedButtonProps = {
    ariaLabel?: string;
    children: ReactNode | ReactNode[];
    className?: string;
    color?: Color;
    disabled?: boolean;
    isIconOnly?: boolean;
    onClick?: () => void;
};

export type ButtonFunctionality = {
    href: string;
    isExternalLink?: boolean;
    type?: never;
} | {
    href?: never;
    isExternalLink?: never;
    type?: 'submit' | 'reset' | 'button';
};

export type ButtonStyle = {
    isAccented?: never;
    styleType?: Extract<StyleType, 'primary' | 'secondary'>
} | {
    isAccented?: boolean;
    styleType: Extract<StyleType, 'inline'>;
};

// export type InlineButtonProps = ;

export type IButtonComponent = SharedButtonProps & ButtonFunctionality & ButtonStyle;
