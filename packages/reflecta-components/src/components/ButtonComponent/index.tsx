import classNames from '../../utils/classNames';

import {
    IButtonComponent
} from './types';

import './styles.scss';

const ButtonComponent: React.FC<IButtonComponent> = (props) => {
    const {
        className,
        label,
        onClick,
        type = 'button'
    } = props;

    const {
        displayName
    } = ButtonComponent;

    const componentClassNames = classNames(
        displayName,
        className
    );

    return (
        <button
            className={componentClassNames}
            onClick={onClick}
            // eslint-disable-next-line react/button-has-type
            type={type}
        >
            {label}
        </button>
    );
};

ButtonComponent.displayName = 'ButtonComponent';

export default ButtonComponent;
