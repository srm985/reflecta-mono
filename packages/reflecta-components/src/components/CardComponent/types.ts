import {
    ReactNode
} from 'react';

export interface ICardComponent {
    children: ReactNode | ReactNode[]
    className?: string;
}
