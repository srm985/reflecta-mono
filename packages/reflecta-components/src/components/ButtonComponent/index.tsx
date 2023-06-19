import classNames from '@utils/classNames';

import {
    IButtonComponent
} from './types';

import './styles.scss';

const ButtonComponent: React.FC<IButtonComponent> = (props) => {
    const {
        children,
        className,
        color = 'primary',
        disabled,
        href,
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
        `${displayName}--${styleType}-color-${color}`,
        `${displayName}--${styleType}`,
        {
            [`${displayName}--${styleType}-disabled`]: !!disabled,
            [`${displayName}--${styleType}-disabled-color-${color}`]: !!disabled
        }
    );

    return (
        href ? (
            <a
                className={componentClassNames}
                href={href}
            >{children}
            </a>
        ) : (
            <button
                className={componentClassNames}
                disabled={disabled}
                onClick={onClick}
                // eslint-disable-next-line react/button-has-type
                type={type}
            >
                {children}
            </button>
        )
    );
};

ButtonComponent.displayName = 'ButtonComponent';

export default ButtonComponent;
