import classNames from '@utils/classNames';

import {
    IButtonComponent
} from './types';

import './styles.scss';

const ButtonComponent: React.FC<IButtonComponent> = (props) => {
    const {
        className,
        disabled,
        href,
        label,
        onClick,
        styleType = 'primary',
        type = 'button'
    } = props;

    const {
        displayName
    } = ButtonComponent;

    const componentClassNames = classNames(
        displayName,
        className,
        {
            [`${displayName}--inline-disabled`]: styleType === 'inline' && !!disabled,
            [`${displayName}--inline`]: styleType === 'inline',
            [`${displayName}--primary-disabled`]: styleType === 'primary' && !!disabled,
            [`${displayName}--primary`]: styleType === 'primary',
            [`${displayName}--secondary-disabled`]: styleType === 'secondary' && !!disabled,
            [`${displayName}--secondary`]: styleType === 'secondary'
        }
    );

    return (
        href ? (
            <a
                className={componentClassNames}
                href={href}
            >{label}
            </a>
        ) : (
            <button
                className={componentClassNames}
                disabled={disabled}
                onClick={onClick}
                // eslint-disable-next-line react/button-has-type
                type={type}
            >
                {label}
            </button>
        )
    );
};

ButtonComponent.displayName = 'ButtonComponent';

export default ButtonComponent;
