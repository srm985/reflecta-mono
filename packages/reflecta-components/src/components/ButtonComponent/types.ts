export interface IButtonComponent {
    className?: string;
    disabled?: boolean;
    href?: string;
    label?: string;
    styleType?: 'primary' | 'secondary' | 'inline';
    onClick?:() => void;
    type?: 'submit' | 'reset' | 'button';
}
