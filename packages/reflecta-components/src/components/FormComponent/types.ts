import {
    FormEvent,
    ReactNode
} from 'react';

export interface IFormComponent {
    children: ReactNode;
    className?: string;
    onDirty?: () => void;
    onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
}
