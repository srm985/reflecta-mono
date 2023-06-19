import {
    ReactNode
} from 'react';

export interface IButtonComponent {
    children: ReactNode | ReactNode[];
    className?: string;
    color?: 'primary' | 'secondary' | 'accent';
    disabled?: boolean;
    href?: string;
    styleType?: 'primary' | 'secondary' | 'inline';
    onClick?:() => void;
    type?: 'submit' | 'reset' | 'button';
}
