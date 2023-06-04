import {
    ChangeEvent
} from 'react';

import classNames from '@utils/classNames';

import {
    IInputComponent
} from './types';

const InputComponent: React.FC<IInputComponent> = (props) => {
    const {
        autoCompleteType = 'off',
        className,
        label,
        name,
        onChange,
        type
    } = props;

    const {
        displayName
    } = InputComponent;

    const componentClassNames = classNames(
        displayName,
        className
    );

    const componentID = `${name}-${Math.random().toString().slice(-5)}`;

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.value);
    };

    return (
        <div className={componentClassNames}>
            <label
                className={displayName}
                htmlFor={componentID}
            >{label}
            </label>
            <input
                autoComplete={autoCompleteType}
                id={componentID}
                onChange={handleChange}
                type={type}
            />
        </div>
    );
};

InputComponent.displayName = 'InputComponent';

export default InputComponent;
