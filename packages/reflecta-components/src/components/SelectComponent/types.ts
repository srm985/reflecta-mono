import {
    ReactNode
} from 'react';

export type Option = {
    label: string | number | ReactNode | ReactNode[];
    value: string;
};

export type ISelectComponent = {
    className?: string;
    disabled?: boolean;
    label:string;
    name: string;
    onChange: (value: string) => void;
    options: Option[];
    placeholder?: string;
    required?: boolean;
    value: string;
};
