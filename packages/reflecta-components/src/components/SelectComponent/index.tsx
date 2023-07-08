import {
    ChangeEvent,
    FC, useMemo
} from 'react';

import FlexboxComponent from '@components/FlexboxComponent';

import classNames from '@utils/classNames';

import {
    ISelectComponent
} from './types';

import './styles.scss';

const SelectComponent: FC<ISelectComponent> = (props) => {
    const {
        className,
        disabled,
        label,
        name,
        onChange,
        options,
        placeholder,
        required,
        value
    } = props;

    const {
        displayName
    } = SelectComponent;

    const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
        onChange(event.target.value);
    };

    const selectOptions = options.map((optionDetails) => (
        <option
            selected={optionDetails.value === value}
            value={optionDetails.value}
        >{optionDetails.label}
        </option>
    ));

    selectOptions.unshift(
        <option
            aria-label={'default'}
            disabled
            hidden
            selected
            value={''}
        >{placeholder || ''}
        </option>
    );

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
        <FlexboxComponent
            className={componentClassNames}
            flexDirection={'column'}
            justifyContent={'space-between'}
        >
            <label
                className={displayName}
                htmlFor={inputID}
            >
                {label}{required && (<span className={'color--danger bold'}>*</span>)}
            </label>
            <select
                aria-label={label}
                disabled={disabled}
                id={inputID}
                onChange={handleChange}
                required={required}
                value={value}
            >
                {selectOptions}
            </select>
        </FlexboxComponent>
    );
};

SelectComponent.displayName = 'SelectComponent';

export default SelectComponent;
