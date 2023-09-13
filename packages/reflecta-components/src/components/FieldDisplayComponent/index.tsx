import {
    FC,
    useMemo
} from 'react';

import classNames from '@utils/classNames';

import {
    IFieldDisplayComponent
} from './types';

const FieldDisplayComponent: FC<IFieldDisplayComponent> = (props) => {
    const {
        className,
        label,
        value
    } = props;

    const {
        displayName
    } = FieldDisplayComponent;

    const componentID = useMemo(() => `${label}-${Math.random().toString().slice(-5)}`, [
        label
    ]);

    const componentClassNames = classNames(
        displayName,
        className
    );

    return (
        <div className={componentClassNames}>
            <label
                className={'display--inline-block font--xsmall mb--1'}
                htmlFor={componentID}
            >{`${label}:`}
            </label>
            <p id={componentID}>{value}</p>
        </div>
    );
};

FieldDisplayComponent.displayName = 'FieldDisplayComponent';

export default FieldDisplayComponent;
