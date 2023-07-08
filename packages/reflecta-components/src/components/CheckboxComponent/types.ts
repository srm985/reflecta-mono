export type ICheckboxComponent = {
    checked: boolean;
    className?: string;
    disabled?: boolean;
    label:string;
    name: string;
    onChange: (checked: boolean) => void;
    required?: boolean;
};
