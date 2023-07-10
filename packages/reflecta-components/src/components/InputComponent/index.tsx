import {
    ChangeEvent, useMemo
} from 'react';

import FlexboxComponent from '@components/FlexboxComponent';

import classNames from '@utils/classNames';

import {
    IInputComponent
} from './types';

import './styles.scss';

const InputComponent: React.FC<IInputComponent> = (props) => {
    const {
        autoCompleteType = 'off',
        className,
        defaultValue,
        disabled,
        label,
        name,
        onChange,
        required,
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
        className,
        {
            [`${displayName}--disabled`]: !!disabled
        }
    );

    const componentID = useMemo(() => `${name}-${Math.random().toString().slice(-5)}`, [
        name
    ]);

    return (
        <FlexboxComponent
            className={componentClassNames}
            layoutDefault={{
                flexDirection: 'column',
                justifyContent: 'space-between'
            }}
        >
            <label
                className={displayName}
                htmlFor={componentID}
            >
                {label}{required && (<span className={'color--danger bold'}>*</span>)}
            </label>
            <input
                aria-label={label}
                autoComplete={autoCompleteType}
                defaultValue={defaultValue}
                disabled={disabled}
                id={componentID}
                onChange={handleChange}
                required={required}
                type={type}
                value={value}
            />
        </FlexboxComponent>
    );
};

InputComponent.displayName = 'InputComponent';

export default InputComponent;
