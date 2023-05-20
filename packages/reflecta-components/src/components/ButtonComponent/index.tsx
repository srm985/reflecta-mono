import {
    IButtonComponent
} from './types';

import './styles.scss';

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
            {`prod2:${label}`}
        </button>
    );
};

ButtonComponent.displayName = 'ButtonComponent';

export default ButtonComponent;
