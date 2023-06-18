import {
    ReactNode
} from 'react';

export interface IModalComponent {
    className?: string;
    children: ReactNode | ReactNode[];
    onClose: () => void;
}
