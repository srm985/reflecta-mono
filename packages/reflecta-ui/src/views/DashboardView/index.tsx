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

    const generatedJournalEntriesList = useMemo(() => state.journalEntriesList.map((journalEntryDetails) => (
        <GridItemComponent
            breakpointLarge={{
                span: 4
            }}
            breakpointSmall={{
                span: 6
            }}
        >
            <JournalEntryDisplayComponent
                {...journalEntryDetails}
                key={journalEntryDetails.entryID}
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
