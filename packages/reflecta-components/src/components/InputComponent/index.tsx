import {
    ChangeEvent, useMemo
} from 'react';

import classNames from '@utils/classNames';

import {
    IInputComponent
} from './types';

const InputComponent: React.FC<IInputComponent> = (props) => {
    const {
        autoCompleteType = 'off',
        className,
        defaultValue,
        label,
        name,
        onChange,
        type,
        value
    } = props;

    const {
        displayName
    } = InputComponent;

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.value);
    };

    const componentClassNames = classNames(
        displayName,
        className
    );

    const componentID = useMemo(() => `${name}-${Math.random().toString().slice(-5)}`, [
        name
    ]);

    return (
        <div className={componentClassNames}>
            <label
                className={displayName}
                htmlFor={componentID}
            >
                {label}
            </label>
            <input
                autoComplete={autoCompleteType}
                defaultValue={defaultValue}
                id={componentID}
                onChange={handleChange}
                type={type}
                value={value}
            />
        </div>
    );
};

InputComponent.displayName = 'InputComponent';

export default InputComponent;
