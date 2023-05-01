import React from 'react';

import {
    IButtonComponent
} from './interfaces';

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
            {label}
        </button>
    );
};

ButtonComponent.displayName = 'ButtonComponent';

export default ButtonComponent;
