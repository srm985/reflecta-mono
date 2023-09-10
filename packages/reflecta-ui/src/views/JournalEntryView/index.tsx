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

import HTTPError from '@utils/HTTPError';
import Storage from '@utils/Storage';

import {
    ROUTE_UI_DASHBOARD
} from '@routes';

import {
    LOCAL_STORAGE_AUTO_SAVE_KEY
} from '@constants';

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

    const storage = new Storage();

    const getAutoSaveStorageKey = (): string => (entryID ? `${LOCAL_STORAGE_AUTO_SAVE_KEY}-${entryID}` : `${LOCAL_STORAGE_AUTO_SAVE_KEY}`);

    const existingEntryDetails = useAppSelector((state) => {
        const storageKey = getAutoSaveStorageKey();

        const entryDetails = storage.readKeyLocal<JournalEntrySubmissionPayload | undefined>(storageKey);

        if (entryDetails) {
            return entryDetails;
        }

        return selectJournalEntryByID(state, parseInt(entryID || '', 10));
    });

    const clearStorage = () => {
        const storageKey = getAutoSaveStorageKey();

        storage.clearKeyLocal(storageKey);
    };

    const handleAutoSave = (entryDetails: JournalEntrySubmissionPayload) => {
        const storageKey = getAutoSaveStorageKey();

        storage.writeKeyLocal(storageKey, entryDetails);
    };

    const handleSubmit = async (journalEntry: JournalEntrySubmissionPayload) => {
        // We're either creating or updating
        const entryAction = journalEntry.entryID ? updateJournalEntry : createJournalEntry;

        const response = await dispatch(entryAction(journalEntry));

        // See if there was an error submitting our journal entry
        if (response instanceof HTTPError) {
            console.log(response.errorMessage);
        } else {
            clearStorage();

            navigate(ROUTE_UI_DASHBOARD);
        }
    };

    const handleDiscard = () => {
        clearStorage();

        navigate(ROUTE_UI_DASHBOARD);
    };

    return (
        <main className={displayName}>
            <JournalEntryInputComponent
                autoSaveIntervalMS={1000}
                entryID={existingEntryDetails?.entryID}
                initialBody={existingEntryDetails?.body}
                initialOccurredAt={existingEntryDetails?.occurredAt}
                initialTitle={existingEntryDetails?.title}
                onAutoSave={handleAutoSave}
                onDiscard={handleDiscard}
                onSubmit={handleSubmit}
            />
        </main>
    );
};

JournalEntryView.displayName = 'JournalEntryView';

export default JournalEntryView;
