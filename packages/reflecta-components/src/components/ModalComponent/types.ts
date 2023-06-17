import {
    ReactNode
} from 'react';

export interface IModalComponent {
    className?: string;
    children: ReactNode;
    onClose: () => void;
}
