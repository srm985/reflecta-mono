import {
    ChangeEvent,
    FC,
    useMemo
} from 'react';

import classNames from '@utils/classNames';

import {
    ICheckboxComponent
} from './types';

import './styles.scss';

const CheckboxComponent: FC<ICheckboxComponent> = (props) => {
    const {
        checked,
        className,
        disabled,
        label,
        name,
        onChange,
        required
    } = props;

    const {
        displayName
    } = CheckboxComponent;

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.checked);
    };

    const componentClassNames = classNames(
        displayName,
        className,
        {
            [`${displayName}--disabled`]: !!disabled
        }
    );

    const inputID = useMemo(() => `${name}-${Math.random().toString().slice(-5)}`, [
        name
    ]);

    return (
        <label
            className={componentClassNames}
            htmlFor={inputID}
        >
            <input
                checked={checked}
                disabled={disabled}
                id={inputID}
                name={name}
                onChange={handleChange}
                type={'checkbox'}
            />
            <span>{label}{required && (<span className={'color--danger bold'}>*</span>)}</span>
        </label>
    );
};

CheckboxComponent.displayName = 'CheckboxComponent';

export default CheckboxComponent;
