import {
    FormEvent,
    ReactNode
} from 'react';

export interface IFormComponent {
    children: ReactNode;
    className?: string;
    onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
}
