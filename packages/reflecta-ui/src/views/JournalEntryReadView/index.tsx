import {
    faPenToSquare,
    faTrashCan
} from '@fortawesome/free-regular-svg-icons';
import {
    faArrowLeft,
    faCalendarDay,
    faLocationDot
} from '@fortawesome/free-solid-svg-icons';
import {
    FontAwesomeIcon
} from '@fortawesome/react-fontawesome';
import {
    FC,
    useEffect,
    useState
} from 'react';
import {
    useNavigate,
    useParams
} from 'react-router-dom';

import ButtonComponent from '@components/remotes/ButtonComponent';
import PromptComponent from '@components/remotes/PromptComponent';

import {
    useAppDispatch,
    useAppSelector
} from '@hooks';

import {
    deleteJournalEntry,
    fetchJournalEntryByID,
    selectJournalEntryByID
} from '@store/slices/journalEntriesSlice';
import {
    fetchLoadingStatus
} from '@store/slices/loadingSlice';

import {
    ROUTE_UI_DASHBOARD,
    ROUTE_UI_JOURNAL_ENTRY
} from '@routes';

import {
    IJournalEntryReadView
} from './types';

import './styles.scss';

const formatEntryDate = (occurredAt: string): string => {
    const [
        year,
        month,
        day
    ] = occurredAt.slice(0, 10).split('-').map((value) => parseInt(value, 10));

    return new Date(year, month - 1, day).toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'long',
        weekday: 'long',
        year: 'numeric'
    });
};

const JournalEntryReadView: FC<IJournalEntryReadView> = () => {
    const {
        displayName
    } = JournalEntryReadView;

    const [
        isDeletePromptOpen,
        setDeletePromptOpen
    ] = useState<boolean>(false);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {
        entryID: entryIDString
    } = useParams();

    const entryID = entryIDString ? parseInt(entryIDString, 10) : undefined;

    useEffect(() => {
        if (entryID) {
            dispatch(fetchJournalEntryByID(entryID));
        }
    }, [
        dispatch,
        entryID
    ]);

    const isLoading = useAppSelector(fetchLoadingStatus);
    const selectedEntryDetails = useAppSelector((state) => selectJournalEntryByID(state, entryID));

    const handleDelete = async () => {
        if (!entryID) {
            return;
        }

        dispatch(deleteJournalEntry(entryID));
        navigate(ROUTE_UI_DASHBOARD);
    };

    if (!selectedEntryDetails) {
        return (
            <main className={displayName}>
                <section className={`${displayName}__empty-state`}>
                    <h1>{isLoading ? 'Opening entry...' : 'Entry not found'}</h1>
                    <p>{isLoading ? 'Your reflection is loading.' : 'This entry may have been deleted or is not available on this device.'}</p>
                    <ButtonComponent
                        color={'primary'}
                        onClick={() => navigate(ROUTE_UI_DASHBOARD)}
                        styleType={'primary'}
                        type={'button'}
                    >{'Back to journal'}
                    </ButtonComponent>
                </section>
            </main>
        );
    }

    const {
        body,
        location,
        occurredAt,
        title,
        updatedAt
    } = selectedEntryDetails;

    const [
        locationName
    ] = (location || '').split(',');

    const paragraphList = body.split('\n').filter((paragraph) => paragraph.trim());
    const readTitle = title.trim() || 'Untitled reflection';

    return (
        <main className={displayName}>
            <div className={`${displayName}__toolbar`}>
                <ButtonComponent
                    className={`${displayName}__back-button`}
                    color={'neutral'}
                    onClick={() => navigate(ROUTE_UI_DASHBOARD)}
                    styleType={'inline'}
                    type={'button'}
                >
                    <FontAwesomeIcon icon={faArrowLeft} />
                    <span>{'Journal'}</span>
                </ButtonComponent>
                <div className={`${displayName}__actions`}>
                    <ButtonComponent
                        ariaLabel={'Edit entry'}
                        color={'primary'}
                        isIconOnly
                        onClick={() => navigate(`${ROUTE_UI_JOURNAL_ENTRY}/edit/${entryID}`)}
                        styleType={'secondary'}
                        type={'button'}
                    >
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </ButtonComponent>
                    <ButtonComponent
                        ariaLabel={'Delete entry'}
                        color={'danger'}
                        isIconOnly
                        onClick={() => setDeletePromptOpen(true)}
                        styleType={'secondary'}
                        type={'button'}
                    >
                        <FontAwesomeIcon icon={faTrashCan} />
                    </ButtonComponent>
                </div>
            </div>
            <article className={`${displayName}__entry`}>
                <header>
                    <p className={`${displayName}__date`}>
                        <FontAwesomeIcon icon={faCalendarDay} />
                        <span>{formatEntryDate(occurredAt)}</span>
                    </p>
                    <h1>{readTitle}</h1>
                    <div className={`${displayName}__meta`}>
                        {
                            locationName && (
                                <ButtonComponent
                                    ariaLabel={'Open entry location'}
                                    className={`${displayName}__location-link`}
                                    color={'accent'}
                                    href={`https://www.google.com/maps/place/${location}`}
                                    isExternalLink
                                    styleType={'inline'}
                                >
                                    <FontAwesomeIcon icon={faLocationDot} />
                                    <span>{locationName}</span>
                                </ButtonComponent>
                            )
                        }
                        {
                            updatedAt && (
                                <span className={`${displayName}__edited`}>{'Edited'}</span>
                            )
                        }
                    </div>
                </header>
                <div className={`${displayName}__body`}>
                    {
                        paragraphList.length ? paragraphList.map((paragraph) => (
                            <p key={paragraph.slice(0, 80)}>{paragraph}</p>
                        )) : (
                            <p>{'No words yet.'}</p>
                        )
                    }
                </div>
            </article>
            {
                isDeletePromptOpen && (
                    <PromptComponent
                        label={'Delete this entry?'}
                        message={'This permanently removes the entry from your journal.'}
                        promptPrimary={{
                            color: 'danger',
                            label: 'Delete entry',
                            onClick: handleDelete
                        }}
                        promptSecondary={{
                            label: 'Keep entry',
                            onClick: () => setDeletePromptOpen(false)
                        }}
                    />
                )
            }
        </main>
    );
};

JournalEntryReadView.displayName = 'JournalEntryReadView';

export default JournalEntryReadView;
