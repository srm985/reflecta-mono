import {
    FC
} from 'react';

import CardComponent from '@components/CardComponent';

import classNames from '@utils/classNames';

import {
    IJournalEntryDisplayComponent
} from './types';

import './styles.scss';

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
        <CardComponent className={componentClassNames}>
            <h3>{title}</h3>
            <p>{occurredAt}</p>
            {
                updatedAt && (
                    <p>{updatedAt}</p>
                )
            }
            <p>{body}</p>
        </CardComponent>
    );
};

JournalEntryDisplayComponent.displayName = 'JournalEntryDisplayComponent';

export default JournalEntryDisplayComponent;
