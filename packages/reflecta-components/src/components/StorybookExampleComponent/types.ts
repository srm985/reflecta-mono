import {
    ReactNode
} from 'react';

export interface IStorybookExampleComponent {
    children: ReactNode | ReactNode[];
    className?: string;
    label: string;
}
