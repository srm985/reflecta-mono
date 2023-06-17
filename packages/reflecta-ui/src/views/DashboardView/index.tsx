import {
    FC,
    memo,
    useEffect
} from 'react';

import Client from '@utils/Client';

import ButtonComponent from '@components/remotes/ButtonComponent';
import JournalEntryDisplayComponent from '@components/remotes/JournalEntryDisplayComponent';
import JournalEntryInputComponent from '@components/remotes/JournalEntryInputComponent';
import ModalComponent from '@components/remotes/ModalComponent';

import {
    ROUTE_API_JOURNAL_ENTRY
} from '@routes';

import withReducer from './withReducer';

import {
    IDashboardView,
    JournalEntry,
    NewJournalEntry
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

    const handleEntrySubmission = async (journalEntry: NewJournalEntry) => {
        console.log(journalEntry);

        await client.post(ROUTE_API_JOURNAL_ENTRY, {
            entryBody: journalEntry.body,
            entryOccurredAt: journalEntry.date,
            entryTitle: journalEntry.title
        });

        dispatch({
            type: 'TOGGLE_ADDING_ENTRY'
        });

        await fetchJournalEntries();
    };

    const handleEntryConclusion = () => {
        dispatch({
            type: 'TOGGLE_ADDING_ENTRY'
        });
    };

    useEffect(() => {
        fetchJournalEntries();
    }, []);

    return (
        <main className={displayName}>
            {
                state.journalEntriesList.map((journalEntryDetails) => (
                    <JournalEntryDisplayComponent
                        {...journalEntryDetails}
                        key={journalEntryDetails.entryID}
                    />
                ))
            }
            <ButtonComponent
                label={'Add Entry'}
                onClick={() => dispatch({
                    type: 'TOGGLE_ADDING_ENTRY'
                })}
            />
            {
                state.isAddingEntry && (
                    <ModalComponent onClose={handleEntryConclusion}>
                        <JournalEntryInputComponent onSubmit={handleEntrySubmission} />
                    </ModalComponent>
                )
            }
        </main>
    );
};

DashboardView.displayName = 'DashboardView';

export default withReducer(memo(DashboardView));
