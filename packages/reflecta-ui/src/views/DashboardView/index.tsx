import {
    FC,
    memo,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';
import {
    useNavigate
} from 'react-router-dom';

import {
    useAppDispatch,
    useAppSelector
} from '../../hooks';

import ButtonComponent from '@components/remotes/ButtonComponent';
import JournalEntryDisplayComponent from '@components/remotes/JournalEntryDisplayComponent';
import PromptComponent from '@components/remotes/PromptComponent';
import SearchComponent from '@components/remotes/SearchComponent';

import {
    deleteAutoSaveJournalEntry,
    deleteJournalEntry,
    fetchAutoSavedJournalEntries,
    fetchJournalEntries,
    searchJournalEntries,
    selectAllAutoSavedJournalEntries,
    selectAllJournalEntries,
    selectJournalEntriesHasMore,
    selectJournalEntriesPageLoading
} from '@store/slices/journalEntriesSlice';
import {
    fetchLoadingStatus
} from '@store/slices/loadingSlice';

import {
    ROUTE_UI_JOURNAL_ENTRY
} from '@routes';

import {
    JournalEntry,
    JournalEntryID,
    JournalEntrySubmissionPayload
} from '@types';

import {
    IDashboardView,
    JournalEntryGroup,
    Search
} from './types';

import './styles.scss';

const formatMonthLabel = (occurredAt: string): string => {
    const [
        year,
        month,
        day
    ] = occurredAt.slice(0, 10).split('-').map((value) => parseInt(value, 10));

    return new Date(year, month - 1, day).toLocaleDateString(undefined, {
        month: 'long',
        year: 'numeric'
    });
};

const groupJournalEntries = (journalEntriesList: JournalEntry[]): JournalEntryGroup[] => {
    const groupedJournalEntriesList: JournalEntryGroup[] = [];

    journalEntriesList.forEach((journalEntryDetails) => {
        const label = formatMonthLabel(journalEntryDetails.occurredAt);
        const existingGroup = groupedJournalEntriesList.find((journalEntryGroup) => journalEntryGroup.label === label);

        if (existingGroup) {
            existingGroup.entries.push(journalEntryDetails);

            return;
        }

        groupedJournalEntriesList.push({
            entries: [
                journalEntryDetails
            ],
            label
        });
    });

    return groupedJournalEntriesList;
};

const getDraftRoute = (journalEntryDetails: JournalEntrySubmissionPayload): string => {
    if (journalEntryDetails.entryID) {
        return `${ROUTE_UI_JOURNAL_ENTRY}/edit/${journalEntryDetails.entryID}`;
    }

    return `${ROUTE_UI_JOURNAL_ENTRY}/create`;
};

const DashboardView: FC<IDashboardView> = () => {
    const {
        displayName
    } = DashboardView;

    const [
        activeSearchDetails,
        setActiveSearchDetails
    ] = useState<Search | undefined>();

    const [
        entryPendingDelete,
        setEntryPendingDelete
    ] = useState<JournalEntryID | undefined>();

    const [
        draftPendingDelete,
        setDraftPendingDelete
    ] = useState<JournalEntryID | undefined>();

    const [
        isSearchActive,
        setSearchActive
    ] = useState<boolean>(false);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const paginationMarkerRef = useRef<HTMLDivElement | null>(null);

    const autoSavedJournalEntriesList = useAppSelector(selectAllAutoSavedJournalEntries);
    const hasMoreJournalEntries = useAppSelector(selectJournalEntriesHasMore);
    const isJournalEntriesPageLoading = useAppSelector(selectJournalEntriesPageLoading);
    const isLoading = useAppSelector(fetchLoadingStatus);
    const journalEntriesList = useAppSelector(selectAllJournalEntries);

    useEffect(() => {
        dispatch(fetchJournalEntries());
        dispatch(fetchAutoSavedJournalEntries());
    }, [
        dispatch
    ]);

    const handleEntryOpen = (entryID: JournalEntryID) => {
        navigate(`${ROUTE_UI_JOURNAL_ENTRY}/${entryID}`);
    };

    const handleEntryEdit = (entryID: JournalEntryID) => {
        navigate(`${ROUTE_UI_JOURNAL_ENTRY}/edit/${entryID}`);
    };

    const handleEntryDelete = async () => {
        if (!entryPendingDelete) {
            return;
        }

        dispatch(deleteJournalEntry(entryPendingDelete));
        setEntryPendingDelete(undefined);
    };

    const handleDraftOpen = (journalEntryDetails: JournalEntrySubmissionPayload) => {
        navigate(getDraftRoute(journalEntryDetails));
    };

    const handleDraftDelete = async () => {
        dispatch(deleteAutoSaveJournalEntry(draftPendingDelete));
        setDraftPendingDelete(undefined);
    };

    const handleSearch = async (searchDetails: Search) => {
        setActiveSearchDetails(searchDetails);
        setSearchActive(true);
        dispatch(searchJournalEntries(searchDetails));
    };

    const handleReset = async () => {
        setActiveSearchDetails(undefined);
        setSearchActive(false);
        dispatch(fetchJournalEntries({
            shouldReload: true
        }));
    };

    const handleLoadMore = useCallback(() => {
        if (isJournalEntriesPageLoading || !hasMoreJournalEntries) {
            return;
        }

        if (isSearchActive) {
            if (activeSearchDetails) {
                dispatch(searchJournalEntries(activeSearchDetails, {
                    shouldAppend: true
                }));
            }

            return;
        }

        dispatch(fetchJournalEntries({
            shouldAppend: true
        }));
    }, [
        activeSearchDetails,
        dispatch,
        hasMoreJournalEntries,
        isJournalEntriesPageLoading,
        isSearchActive
    ]);

    useEffect(() => {
        const markerElement = paginationMarkerRef.current;

        if (!markerElement || !hasMoreJournalEntries) {
            return undefined;
        }

        const observer = new IntersectionObserver(([
            entry
        ]) => {
            if (entry.isIntersecting) {
                handleLoadMore();
            }
        }, {
            rootMargin: '420px 0px'
        });

        observer.observe(markerElement);

        return () => observer.disconnect();
    }, [
        handleLoadMore,
        hasMoreJournalEntries,
        journalEntriesList.length
    ]);

    const groupedJournalEntriesList = useMemo(() => {
        const sortedJournalEntriesList = [
            ...journalEntriesList
        ].sort((firstEntry, secondEntry) => {
            const dateSort = secondEntry.occurredAt.localeCompare(firstEntry.occurredAt);

            if (dateSort !== 0) {
                return dateSort;
            }

            return secondEntry.entryID - firstEntry.entryID;
        });

        return groupJournalEntries(sortedJournalEntriesList);
    }, [
        journalEntriesList
    ]);

    const generatedAutoSavedJournalEntriesList = autoSavedJournalEntriesList.map((journalEntryDetails) => (
        <JournalEntryDisplayComponent
            body={journalEntryDetails.body}
            entryID={journalEntryDetails.entryID || 0}
            isHighInterest={false}
            key={`draft-${journalEntryDetails.entryID || 0}`}
            location={journalEntryDetails.location}
            occurredAt={journalEntryDetails.occurredAt}
            onDelete={(entryID) => setDraftPendingDelete(entryID)}
            onEdit={() => handleDraftOpen(journalEntryDetails)}
            onOpen={() => handleDraftOpen(journalEntryDetails)}
            title={journalEntryDetails.title || 'Continue draft'}
            updatedAt={null}
        />
    ));

    const generatedJournalEntriesList = groupedJournalEntriesList.map((journalEntryGroup) => (
        <section
            className={`${displayName}__month-group`}
            key={journalEntryGroup.label}
        >
            <h2>{journalEntryGroup.label}</h2>
            <div className={`${displayName}__entries-list`}>
                {journalEntryGroup.entries.map((journalEntryDetails) => (
                    <JournalEntryDisplayComponent
                        {...journalEntryDetails}
                        key={journalEntryDetails.entryID}
                        onDelete={() => setEntryPendingDelete(journalEntryDetails.entryID)}
                        onEdit={() => handleEntryEdit(journalEntryDetails.entryID)}
                        onOpen={() => handleEntryOpen(journalEntryDetails.entryID)}
                    />
                ))}
            </div>
        </section>
    ));

    const hasAutoSavedEntries = autoSavedJournalEntriesList.length > 0;
    const hasJournalEntries = journalEntriesList.length > 0;
    const shouldShowEmptyDashboard = !isLoading && !isSearchActive && !hasJournalEntries && !hasAutoSavedEntries;
    const shouldShowEmptySearch = !isLoading && isSearchActive && !hasJournalEntries;
    const shouldShowPagination = hasJournalEntries && (hasMoreJournalEntries || isJournalEntriesPageLoading || !isLoading);
    const shouldShowSkeleton = (isLoading || isJournalEntriesPageLoading) && !hasJournalEntries && !hasAutoSavedEntries;

    return (
        <main className={displayName}>
            <section className={`${displayName}__search`}>
                <SearchComponent
                    onReset={handleReset}
                    onSearch={handleSearch}
                />
            </section>
            {
                hasAutoSavedEntries && (
                    <section className={`${displayName}__drafts`}>
                        <div className={`${displayName}__section-heading`}>
                            <h2>{'Continue draft'}</h2>
                            <p>{'Your latest autosaved writing is waiting.'}</p>
                        </div>
                        <div className={`${displayName}__entries-list`}>
                            {generatedAutoSavedJournalEntriesList}
                        </div>
                    </section>
                )
            }
            {
                shouldShowSkeleton && (
                    <section className={`${displayName}__skeleton-list`}>
                        <div />
                        <div />
                        <div />
                    </section>
                )
            }
            {generatedJournalEntriesList}
            {
                shouldShowPagination && (
                    <div
                        aria-live={'polite'}
                        className={`${displayName}__pagination`}
                        ref={paginationMarkerRef}
                    >
                        {
                            isJournalEntriesPageLoading && hasJournalEntries && (
                                <p className={`${displayName}__loading-more`}>
                                    <span />
                                    {'Loading more entries'}
                                </p>
                            )
                        }
                        {
                            !isJournalEntriesPageLoading && hasMoreJournalEntries && (
                                <ButtonComponent
                                    className={`${displayName}__load-more-button`}
                                    color={'neutral'}
                                    onClick={handleLoadMore}
                                    styleType={'secondary'}
                                    type={'button'}
                                >{'Load more'}
                                </ButtonComponent>
                            )
                        }
                        {
                            !isJournalEntriesPageLoading && !hasMoreJournalEntries && (
                                <p className={`${displayName}__end-of-list`}>
                                    {isSearchActive ? 'End of results' : 'All caught up'}
                                </p>
                            )
                        }
                    </div>
                )
            }
            {
                shouldShowEmptySearch && (
                    <section className={`${displayName}__empty-state`}>
                        <h2>{'No memories found'}</h2>
                        <p>{'Try clearing filters or searching for a different word, place, or date.'}</p>
                        <ButtonComponent
                            color={'primary'}
                            onClick={handleReset}
                            styleType={'primary'}
                            type={'button'}
                        >{'Show all entries'}
                        </ButtonComponent>
                    </section>
                )
            }
            {
                shouldShowEmptyDashboard && (
                    <section className={`${displayName}__empty-state`}>
                        <h2>{'Start with one memory'}</h2>
                        <p>{'A few lines are enough. Reflecta will keep the draft while you find your words.'}</p>
                        <ButtonComponent
                            color={'accent'}
                            onClick={() => navigate(`${ROUTE_UI_JOURNAL_ENTRY}/create`)}
                            styleType={'primary'}
                            type={'button'}
                        >{'Write an entry'}
                        </ButtonComponent>
                    </section>
                )
            }
            {
                entryPendingDelete && (
                    <PromptComponent
                        label={'Delete this entry?'}
                        message={'This permanently removes the entry from your journal.'}
                        promptPrimary={{
                            color: 'danger',
                            label: 'Delete entry',
                            onClick: handleEntryDelete
                        }}
                        promptSecondary={{
                            label: 'Keep entry',
                            onClick: () => setEntryPendingDelete(undefined)
                        }}
                    />
                )
            }
            {
                draftPendingDelete !== undefined && (
                    <PromptComponent
                        label={'Discard this draft?'}
                        message={'This removes the autosaved draft. Saved entries will not be affected.'}
                        promptPrimary={{
                            color: 'danger',
                            label: 'Discard draft',
                            onClick: handleDraftDelete
                        }}
                        promptSecondary={{
                            label: 'Keep draft',
                            onClick: () => setDraftPendingDelete(undefined)
                        }}
                    />
                )
            }
        </main>
    );
};

DashboardView.displayName = 'DashboardView';

export default memo(DashboardView);
