import {
    FC,
    useEffect
} from 'react';
import {
    useNavigate,
    useParams
} from 'react-router-dom';

import JournalEntryInputComponent from '@components/remotes/JournalEntryInputComponent';

import {
    useAppDispatch,
    useAppSelector
} from '@hooks';

import {
    createJournalEntry,
    fetchJournalEntries,
    selectJournalEntryByID,
    updateJournalEntry
} from '@store/slices/journalEntriesSlice';

import {
    ROUTE_UI_DASHBOARD
} from '@routes';

import {
    JournalEntrySubmissionPayload
} from '@types';

import {
    IJournalEntryView
} from './types';

const JournalEntryView: FC<IJournalEntryView> = () => {
    const {
        displayName
    } = JournalEntryView;

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {
        entryID
    } = useParams();

    useEffect(() => {
        dispatch(fetchJournalEntries());
    }, [
        dispatch
    ]);

    const existingEntryDetails = useAppSelector((state) => selectJournalEntryByID(state, parseInt(entryID || '', 10)));

    const handleSubmit = async (journalEntry: JournalEntrySubmissionPayload) => {
        if (journalEntry.entryID) {
            dispatch(updateJournalEntry(journalEntry));
        } else {
            dispatch(createJournalEntry(journalEntry));
        }

        navigate(ROUTE_UI_DASHBOARD);
    };

    const handleDiscard = () => {
        navigate(ROUTE_UI_DASHBOARD);
    };

    return (
        <main className={displayName}>
            <JournalEntryInputComponent
                entryID={existingEntryDetails?.entryID}
                initialBody={existingEntryDetails?.body}
                initialOccurredAt={existingEntryDetails?.occurredAt}
                initialTitle={existingEntryDetails?.title}
                onDiscard={handleDiscard}
                onSubmit={handleSubmit}
            />
        </main>
    );
};

JournalEntryView.displayName = 'JournalEntryView';

export default JournalEntryView;
