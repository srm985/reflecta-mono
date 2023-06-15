import {
    FC,
    memo,
    useEffect
} from 'react';

import Client from '@utils/Client';

import JournalEntryDisplayComponent from '@components/remotes/JournalEntryDisplayComponent';

import {
    ROUTE_API_JOURNAL_ENTRY
} from '@routes';

import withReducer from './withReducer';

import {
    IDashboardView,
    JournalEntry
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
        </main>
    );
};

DashboardView.displayName = 'DashboardView';

export default withReducer(memo(DashboardView));
