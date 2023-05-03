import {
    IButtonComponent
} from './types';

import './style.scss';

const ButtonComponent: React.FC<IButtonComponent> = (props) => {
    const {
        label
    } = props;

    const {
        displayName
    } = ButtonComponent;

    return (
        <button
            className={displayName}
            type={'button'}
        >
            {`FOO111:${label}`}
        </button>
    );
};

ButtonComponent.displayName = 'ButtonComponent';

export default ButtonComponent;
