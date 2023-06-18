import {
    ReactNode
} from 'react';

export interface IStorybookStyler {
    children: ReactNode | ReactNode[];
    className?: string;
}
