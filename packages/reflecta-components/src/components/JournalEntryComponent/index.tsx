import {
    ChangeEvent
} from 'react';

import classNames from '@utils/classNames';

import {
    IJournalEntryComponent
} from './types';

const JournalEntryComponent: React.FC<IJournalEntryComponent> = (props) => {
    const {
        className,
        label,
        name,
        onChange,
        value
    } = props;

    const {
        displayName
    } = JournalEntryComponent;

    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        onChange(event.target.value);
    };

    const componentClassNames = classNames(
        displayName,
        className
    );

    const componentID = `${name}-${Math.random().toString().slice(-5)}`;

    return (
        <div className={componentClassNames}>
            <label
                className={displayName}
                htmlFor={componentID}
            >
                {label}
            </label>
            <textarea
                className={componentClassNames}
                onChange={handleChange}
                value={value}
            />
        </div>
    );
};

JournalEntryComponent.displayName = 'JournalEntryComponent';

export default JournalEntryComponent;
