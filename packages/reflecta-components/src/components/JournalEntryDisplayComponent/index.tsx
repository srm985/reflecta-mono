import {
    faPenToSquare,
    faTrashCan
} from '@fortawesome/free-regular-svg-icons';
import {
    faLocationDot
} from '@fortawesome/free-solid-svg-icons';
import {
    FontAwesomeIcon
} from '@fortawesome/react-fontawesome';
import {
    FC
} from 'react';

import ButtonComponent from '@components/ButtonComponent';
import CardComponent from '@components/CardComponent';
import FlexboxComponent from '@components/FlexboxComponent';
import PopoverComponent from '@components/PopoverComponent';

import classNames from '@utils/classNames';

import {
    IJournalEntryDisplayComponent
} from './types';

const JournalEntryDisplayComponent: FC<IJournalEntryDisplayComponent> = (props) => {
    const {
        body,
        className,
        entryID,
        isHighInterest,
        location,
        occurredAt,
        onDelete,
        onEdit,
        title,
        updatedAt
    } = props;

    const {
        displayName
    } = JournalEntryDisplayComponent;

    const bodySummary = body.split(/(?<=[.!?])\s+(?=[A-Z¡¿])/).slice(0, isHighInterest ? 8 : 3).join(' ');

    const dateOptions: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    };

    const [
        year,
        month,
        day
    ] = occurredAt.slice(0, 10).split('-').map((value) => parseInt(value, 10));

    const dateTimeOccurredAt = new Date(year, month - 1, day);
    const dateTimeUpdatedAt = new Date(updatedAt || '');

    const formattedOccurredAt = dateTimeOccurredAt.toLocaleDateString(undefined, dateOptions);
    const formattedUpdatedAt = dateTimeUpdatedAt.toLocaleDateString(undefined, {
        ...dateOptions,
        hour: '2-digit',
        hour12: false,
        minute: '2-digit'
    }).replace(' at ', ' ');

    const componentClassNames = classNames(
        displayName,
        className
    );

    const [
        locationName
    ] = (location || '').split(',');

    return (
        <CardComponent className={componentClassNames}>
            <div className={`${displayName}__content-wrapper`}>
                <FlexboxComponent layoutDefault={{
                    justifyContent: 'space-between'
                }}
                >
                    <h3>{title}</h3>
                    <PopoverComponent
                        actions={[
                            {
                                groupActions: [
                                    {
                                        actionLabel: 'edit',
                                        label: <><FontAwesomeIcon icon={faPenToSquare} /> {'Edit'}</>,
                                        onClick: () => onEdit(entryID)
                                    },
                                    {
                                        actionLabel: 'delete',
                                        label: <span className={'color--danger'}><FontAwesomeIcon icon={faTrashCan} /> {'Delete'}</span>,
                                        onClick: () => onDelete(entryID)
                                    }
                                ],
                                groupLabel: 'actions'
                            }
                        ]}
                        label={'Actions'}
                    />
                </FlexboxComponent>
                {
                    locationName && (
                        <p className={'font--xsmall mt--1 mb--2'}>
                            <ButtonComponent
                                ariaLabel={'entry location'}
                                href={`https://www.google.com/maps/place/${location}`}
                                isExternalLink
                                isIconOnly
                                styleType={'inline'}
                            >
                                <FontAwesomeIcon
                                    className={'color--accent'}
                                    icon={faLocationDot}
                                />

                            </ButtonComponent>
                            <span title={location}>{` ${locationName}`}</span>
                        </p>
                    )
                }
                <p className={'font--small bold color--accent mt--1'}>{formattedOccurredAt}</p>
                {
                    updatedAt && (
                        <p className={'font--xsmall italic'}><span>{'Edited: '}</span><span className={'bold'}>{formattedUpdatedAt}</span></p>
                    )
                }
                <p className={'mt--3'}>{bodySummary}</p>
            </div>
        </CardComponent>
    );
};

JournalEntryDisplayComponent.displayName = 'JournalEntryDisplayComponent';

export default JournalEntryDisplayComponent;
