import {
    faPenToSquare,
    faTrashCan
} from '@fortawesome/free-regular-svg-icons';
import {
    faCalendarDay,
    faLocationDot
} from '@fortawesome/free-solid-svg-icons';
import {
    FontAwesomeIcon
} from '@fortawesome/react-fontawesome';
import {
    FC,
    KeyboardEvent,
    MouseEvent
} from 'react';

import CardComponent from '@components/CardComponent';
import FlexboxComponent from '@components/FlexboxComponent';
import PopoverComponent from '@components/PopoverComponent';

import classNames from '@utils/classNames';

import {
    IJournalEntryDisplayComponent
} from './types';

import './styles.scss';

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
        onOpen,
        title,
        updatedAt
    } = props;

    const {
        displayName
    } = JournalEntryDisplayComponent;

    const bodySummary = body.split(/(?<=[.!?])\s+(?=[A-Z¡¿])/).slice(0, isHighInterest ? 8 : 3).join(' ');
    const previewBody = bodySummary || body.slice(0, isHighInterest ? 420 : 220);
    const previewTitle = title.trim() || 'Untitled reflection';

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
    const formattedUpdatedAt = updatedAt ? dateTimeUpdatedAt.toLocaleDateString(undefined, {
        ...dateOptions,
        hour: '2-digit',
        hour12: false,
        minute: '2-digit'
    }).replace(' at ', ' ') : undefined;

    const componentClassNames = classNames(
        displayName,
        className,
        {
            [`${displayName}--interactive`]: !!onOpen,
            [`${displayName}--high-interest`]: isHighInterest
        }
    );

    const [
        locationName
    ] = (location || '').split(',');

    const handleOpen = (event?: MouseEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement>) => {
        const target = event?.target as HTMLElement | undefined;

        if (target?.closest(`.${displayName}__actions`)) {
            return;
        }

        if (onOpen) {
            onOpen(entryID);
        }
    };

    const handleOpenKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleOpen(event);
        }
    };

    return (
        <CardComponent className={componentClassNames}>
            <div
                aria-label={`Open ${previewTitle}`}
                className={`${displayName}__content-wrapper`}
                onClick={handleOpen}
                onKeyDown={handleOpenKeyDown}
                role={'button'}
                tabIndex={0}
            >
                <FlexboxComponent
                    className={`${displayName}__header`}
                    layoutDefault={{
                        alignItems: 'flex-start',
                        columnGap: 'medium',
                        justifyContent: 'space-between'
                    }}
                >
                    <div>
                        <h3 className={`${displayName}__title`}>{previewTitle}</h3>
                        <p className={`${displayName}__date`}>
                            <FontAwesomeIcon icon={faCalendarDay} />
                            <span>{formattedOccurredAt}</span>
                        </p>
                    </div>
                    <div className={`${displayName}__actions`}>
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
                    </div>
                </FlexboxComponent>
                <div className={`${displayName}__meta`}>
                    {
                        locationName && (
                            <span
                                className={`${displayName}__location`}
                                title={location}
                            >
                                <FontAwesomeIcon icon={faLocationDot} />
                                <span>{locationName}</span>
                            </span>
                        )
                    }
                    {
                        formattedUpdatedAt && (
                            <span className={`${displayName}__edited`}>{`Edited ${formattedUpdatedAt}`}</span>
                        )
                    }
                </div>
                <p className={`${displayName}__body`}>{previewBody || 'No words yet.'}</p>
            </div>
        </CardComponent>
    );
};

JournalEntryDisplayComponent.displayName = 'JournalEntryDisplayComponent';

export default JournalEntryDisplayComponent;
