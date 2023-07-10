import {
    faPenToSquare, faTrashCan
} from '@fortawesome/free-regular-svg-icons';
import {
    FontAwesomeIcon
} from '@fortawesome/react-fontawesome';
import {
    FC
} from 'react';

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
        occurredAt,
        onDelete,
        onEdit,
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
                <p>{occurredAt}</p>
                {
                    updatedAt && (
                        <p>{updatedAt}</p>
                    )
                }
                <p>{body}</p>
            </div>
        </CardComponent>
    );
};

JournalEntryDisplayComponent.displayName = 'JournalEntryDisplayComponent';

export default JournalEntryDisplayComponent;
