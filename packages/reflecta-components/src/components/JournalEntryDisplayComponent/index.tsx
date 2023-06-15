import {
    FC
} from 'react';

import classNames from '@utils/classNames';

import {
    IJournalEntryDisplayComponent
} from './types';

const JournalEntryDisplayComponent: FC<IJournalEntryDisplayComponent> = (props) => {
    const {
        body,
        className,
        occurredAt,
        title,
        updatedAt
    } = props;

    const {
        displayName
    } = JournalEntryDisplayComponent;

    const componentClassNames = classNames(
        displayName,
        className
    );

    return (
        <div className={componentClassNames}>
            <h3>{title}</h3>
            <p>{occurredAt}</p>
            {
                updatedAt && (
                    <p>{updatedAt}</p>
                )
            }
            <p>{body}</p>
        </div>
    );
};

JournalEntryDisplayComponent.displayName = 'JournalEntryDisplayComponent';

export default JournalEntryDisplayComponent;
