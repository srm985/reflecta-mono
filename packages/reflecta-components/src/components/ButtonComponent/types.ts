export interface IButtonComponent {
    className?: string;
    label?: string;
    onClick?:() => void;
    type?: 'submit' | 'reset' | 'button' | undefined;
}
