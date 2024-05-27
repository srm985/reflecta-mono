import {
    FC,
    useEffect,
    useState
} from 'react';
import {
    useNavigate,
    useParams
} from 'react-router-dom';

import JournalEntryInputComponent from '@components/remotes/JournalEntryInputComponent';
import PromptComponent from '@components/remotes/PromptComponent';

import {
    useAppDispatch,
    useAppSelector
} from '@hooks';

import {
    autoSaveJournalEntry,
    createJournalEntry,
    deleteAutoSaveJournalEntry,
    fetchJournalEntries,
    selectAutoSavedJournalEntryByID,
    selectJournalEntryByID,
    updateJournalEntry
} from '@store/slices/journalEntriesSlice';

import HTTPError from '@utils/HTTPError';

import {
    ROUTE_UI_DASHBOARD
} from '@routes';

import {
    GOOGLE_MAPS_API_KEY
} from '@constants';

import {
    JournalEntry,
    JournalEntrySubmissionPayload
} from '@types';

import {
    IJournalEntryView
} from './types';

const JournalEntryView: FC<IJournalEntryView> = () => {
    const {
        displayName
    } = JournalEntryView;

    const [
        isPromptOpen,
        setPromptOpen
    ] = useState<boolean>(false);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {
        entryID: entryIDString
    } = useParams();

    // This could be empty for new entries
    const entryID: number | undefined = !entryIDString ? undefined : parseInt(entryIDString, 10);

    useEffect(() => {
        dispatch(fetchJournalEntries());
    }, [
        dispatch
    ]);

    const existingEntryDetails = useAppSelector((state) => selectJournalEntryByID(state, entryID));

    // If there is an existing entry or new entry i.e. ID = 0
    const autoSavedEntryDetails = useAppSelector((state) => selectAutoSavedJournalEntryByID(state, entryID || 0));

    const selectedEntryDetails: JournalEntry | JournalEntrySubmissionPayload | undefined = autoSavedEntryDetails || existingEntryDetails;

    const handleAutoSave = (entryDetails: JournalEntrySubmissionPayload) => {
        dispatch(autoSaveJournalEntry(entryDetails));
    };

    const handleSubmit = async (journalEntry: JournalEntrySubmissionPayload) => {
        // We're either creating or updating
        const entryAction = journalEntry.entryID ? updateJournalEntry : createJournalEntry;

        const response = await dispatch(entryAction(journalEntry));

        // See if there was an error submitting our journal entry
        if (response instanceof HTTPError) {
            console.log(response.errorMessage);
        } else {
            dispatch(deleteAutoSaveJournalEntry(entryID));

            navigate(ROUTE_UI_DASHBOARD);
        }
    };

    const handleDiscard = () => {
        dispatch(deleteAutoSaveJournalEntry(entryID));

        navigate(ROUTE_UI_DASHBOARD);
    };

    return (
        <main className={displayName}>
            <JournalEntryInputComponent
                autoSaveIntervalMS={1000}
                entryID={selectedEntryDetails?.entryID}
                googleMapsAPIKey={GOOGLE_MAPS_API_KEY}
                initialBody={selectedEntryDetails?.body}
                initialLocation={selectedEntryDetails?.location}
                initialOccurredAt={selectedEntryDetails?.occurredAt}
                initialTitle={selectedEntryDetails?.title}
                onAutoSave={handleAutoSave}
                onDiscard={() => setPromptOpen(true)}
                onSubmit={handleSubmit}
            />
            {
                isPromptOpen && (
                    <PromptComponent
                        label={entryID ? 'Discard changes?' : 'Discard entry?'}
                        message={entryID ? 'Are you sure you want to discard these changes? If you would like to save it for later, simply close this message and hit the Home button.' : 'Are you sure you want to discard this entry? If you would like to save it for later, simply close this message and hit the Home button.'}
                        promptPrimary={{
                            color: 'danger',
                            label: entryID ? 'Discard changes' : 'Discard entry',
                            onClick: handleDiscard
                        }}
                        promptSecondary={{
                            label: entryID ? 'Continue editing' : 'Continue journaling',
                            onClick: () => setPromptOpen(false)
                        }}
                    />
                )
            }
        </main>
    );
};

JournalEntryView.displayName = 'JournalEntryView';

export default JournalEntryView;
