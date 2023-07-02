import {
    FC,
    memo,
    useEffect,
    useMemo
} from 'react';

import ButtonComponent from '@components/remotes/ButtonComponent';
import GridContainerComponent from '@components/remotes/GridContainerComponent';
import GridItemComponent from '@components/remotes/GridItemComponent';
import JournalEntryDisplayComponent from '@components/remotes/JournalEntryDisplayComponent';
import JournalEntryInputComponent from '@components/remotes/JournalEntryInputComponent';
import ModalComponent from '@components/remotes/ModalComponent';

import Client from '@utils/Client';

import {
    ROUTE_API_JOURNAL_ENTRY
} from '@routes';

import withReducer from './withReducer';

import {
    EntryID,
    IDashboardView,
    JournalEntry,
    PendingJournalEntry
} from './types';

const client = new Client();

const DashboardView: FC<IDashboardView> = (props) => {
    const {
        dispatch,
        state
    } = props;

    const {
        displayName
    } = DashboardView;

    console.log({
        state
    });

    const fetchJournalEntries = async () => {
        const payload = await client.get<JournalEntry[]>(ROUTE_API_JOURNAL_ENTRY);

        if ('errorMessage' in payload) {
            console.log(payload.errorMessage);
        } else {
            dispatch({
                payload,
                type: 'SET_JOURNAL_ENTRIES_LIST'
            });
        }
    };

    const handleEntrySubmission = async (journalEntry: PendingJournalEntry) => {
        const {
            body,
            entryID,
            occurredAt,
            title
        } = journalEntry;

        if (entryID) {
            await client.put(ROUTE_API_JOURNAL_ENTRY, {
                entryBody: body,
                entryID,
                entryOccurredAt: occurredAt,
                entryTitle: title
            });
        } else {
            await client.post(ROUTE_API_JOURNAL_ENTRY, {
                entryBody: body,
                entryOccurredAt: occurredAt,
                entryTitle: title
            });
        }

        dispatch({
            type: 'CLEAR_JOURNAL_ENTRY'
        });

        await fetchJournalEntries();
    };

    const handleEntryConclusion = () => {
        dispatch({
            type: 'CLEAR_JOURNAL_ENTRY'
        });
    };

    const handleEntryEdit = (entryDetails: Required<PendingJournalEntry>) => {
        dispatch({
            payload: entryDetails,
            type: 'SET_EDITING_JOURNAL_ENTRY'
        });
    };

    const handleEntryDelete = async (entryID: EntryID) => {
        await client.delete(ROUTE_API_JOURNAL_ENTRY, {
            entryID
        });

        await fetchJournalEntries();
    };

    useEffect(() => {
        fetchJournalEntries();
    }, []);

    const generatedJournalEntriesList = useMemo(() => state.journalEntriesList.map((journalEntryDetails) => (
        <GridItemComponent
            breakpointLarge={{
                span: 4
            }}
            breakpointSmall={{
                span: 6
            }}
            key={journalEntryDetails.entryID}
            rowSpan={journalEntryDetails.isHighInterest ? 2 : 1}
        >
            <JournalEntryDisplayComponent
                {...journalEntryDetails}
                key={journalEntryDetails.entryID}
                onDelete={() => handleEntryDelete(journalEntryDetails.entryID)}
                onEdit={() => handleEntryEdit(journalEntryDetails)}
            />
        </GridItemComponent>
    )), [
        state.journalEntriesList
    ]);

    return (
        <main className={displayName}>
            <GridContainerComponent>
                {generatedJournalEntriesList}
            </GridContainerComponent>
            <ButtonComponent
                color={'accent'}
                onClick={() => dispatch({
                    type: 'SET_CREATING_JOURNAL_ENTRY'
                })}
            >{'Add Entry'}
            </ButtonComponent>
            {
                state.isEntryEditorVisible && (
                    <ModalComponent onClose={handleEntryConclusion}>
                        <JournalEntryInputComponent
                            entryID={state.editingEntryID}
                            initialBody={state.editingEntryBody}
                            initialOccurredAt={state.editingEntryOccurredAt}
                            initialTitle={state.editingEntryTitle}
                            onDiscard={handleEntryConclusion}
                            onSubmit={handleEntrySubmission}
                        />
                    </ModalComponent>
                )
            }
        </main>
    );
};

DashboardView.displayName = 'DashboardView';

export default withReducer(memo(DashboardView));
