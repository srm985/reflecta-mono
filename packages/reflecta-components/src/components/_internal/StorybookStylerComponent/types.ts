import {
    ReactNode
} from 'react';

export interface IStorybookStylerComponent {
    children: ReactNode | ReactNode[];
    className?: string;
}
