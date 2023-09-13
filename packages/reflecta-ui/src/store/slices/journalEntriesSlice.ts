import {
    AnyAction,
    PayloadAction,
    ThunkAction,
    createSlice
} from '@reduxjs/toolkit';

import {
    Search
} from '@views/DashboardView/types';

import type {
    RootState
} from '@store/index';

import Client from '@utils/Client';
import HTTPError from '@utils/HTTPError';
import Storage from '@utils/Storage';

import {
    ROUTE_API_JOURNAL_ENTRY,
    ROUTE_API_SEARCH
} from '@routes';

import {
    LOCAL_STORAGE_AUTO_SAVE_KEY
} from '@constants';

import {
    JournalEntry,
    JournalEntryID,
    JournalEntrySubmissionPayload
} from '@types';

import {
    requestLoadingHide,
    requestLoadingShow
} from './loadingSlice';

const client = new Client();

const storage = new Storage();

type State = {
    autoSavedJournalEntriesList: JournalEntrySubmissionPayload[],
    journalEntriesList: JournalEntry[]
};

const initialState: State = {
    autoSavedJournalEntriesList: [],
    journalEntriesList: []
};

export const dashboardSlice = createSlice({
    initialState,
    name: 'journalEntries',
    reducers: {
        autoSavedJournalEntriesFetched: (state, action: PayloadAction<JournalEntrySubmissionPayload[]>) => ({
            ...state,
            autoSavedJournalEntriesList: action.payload
        }),
        journalEntriesFetched: (state, action: PayloadAction<JournalEntry[]>) => ({
            ...state,
            journalEntriesList: action.payload
        })
    }
});

export const {
    autoSavedJournalEntriesFetched,
    journalEntriesFetched
} = dashboardSlice.actions;

export const fetchJournalEntries = (shouldReload?: boolean): ThunkAction<void, RootState, unknown, AnyAction> => async (dispatch, state) => {
    if (!shouldReload && state().journalEntries.journalEntriesList.length) {
        return undefined;
    }

    dispatch(requestLoadingShow());

    try {
        const payload = await client.get<JournalEntry[]>(ROUTE_API_JOURNAL_ENTRY);

        if ('errorMessage' in payload) {
            console.log(payload.errorMessage);
        } else {
            dispatch(journalEntriesFetched(payload));
        }
    } catch (error) {
        console.log(error);
    }

    return dispatch(requestLoadingHide());
};

export const fetchAutoSavedJournalEntries = (): ThunkAction<void, RootState, unknown, AnyAction> => async (dispatch) => {
    try {
        const autoSavedEntries = storage.readKeyLocal<JournalEntrySubmissionPayload[]>(LOCAL_STORAGE_AUTO_SAVE_KEY);

        if (!autoSavedEntries) {
            return dispatch(autoSavedJournalEntriesFetched([]));
        }

        return dispatch(autoSavedJournalEntriesFetched(autoSavedEntries));
    } catch (error) {
        console.log(error);

        return dispatch(autoSavedJournalEntriesFetched([]));
    }
};

export const createJournalEntry = (submissionPayload: JournalEntrySubmissionPayload): ThunkAction<Promise<JournalEntry | HTTPError>, RootState, unknown, AnyAction> => async (dispatch) => {
    dispatch(requestLoadingShow());

    try {
        const response = await client.post<JournalEntry>(ROUTE_API_JOURNAL_ENTRY, {
            entryBody: submissionPayload.body,
            entryOccurredAt: submissionPayload.occurredAt,
            entryTitle: submissionPayload.title
        });

        dispatch(requestLoadingHide());

        dispatch(fetchJournalEntries(true));

        return response;
    } catch (error) {
        dispatch(requestLoadingHide());

        return error as HTTPError;
    }
};

export const updateJournalEntry = (submissionPayload: JournalEntrySubmissionPayload): ThunkAction<Promise<JournalEntry | HTTPError>, RootState, unknown, AnyAction> => async (dispatch) => {
    dispatch(requestLoadingShow());

    try {
        const response = await client.patch<JournalEntry>(ROUTE_API_JOURNAL_ENTRY, {
            entryBody: submissionPayload.body,
            entryID: submissionPayload.entryID,
            entryOccurredAt: submissionPayload.occurredAt,
            entryTitle: submissionPayload.title
        });

        dispatch(requestLoadingHide());

        dispatch(fetchJournalEntries(true));

        return response;
    } catch (error) {
        dispatch(requestLoadingHide());

        return error as HTTPError;
    }
};

export const deleteJournalEntry = (entryID: JournalEntryID): ThunkAction<void, RootState, unknown, AnyAction> => async (dispatch) => {
    dispatch(requestLoadingShow());

    try {
        await client.delete(ROUTE_API_JOURNAL_ENTRY, {
            entryID
        });

        dispatch(fetchJournalEntries(true));
    } catch (error) {
        console.log(error);
    }

    dispatch(requestLoadingHide());
};

export const autoSaveJournalEntry = (entryDetails: JournalEntrySubmissionPayload): ThunkAction<void, RootState, unknown, AnyAction> => async (dispatch, state) => {
    try {
        const {
            autoSavedJournalEntriesList
        } = state().journalEntries;

        const entriesList: JournalEntrySubmissionPayload[] = JSON.parse(JSON.stringify(autoSavedJournalEntriesList));

        // Use 0 as our ID for new entries
        const entryID = entryDetails.entryID || 0;

        // See if we have an existing value to update
        const entryIndex = autoSavedJournalEntriesList.findIndex((existingEntryDetails) => existingEntryDetails.entryID === entryID);
        if (entryIndex === -1) {
            entriesList.push({
                ...entryDetails,
                entryID
            });
        } else {
            entriesList[entryIndex] = {
                ...entryDetails,
                entryID
            };
        }

        storage.writeKeyLocal(LOCAL_STORAGE_AUTO_SAVE_KEY, entriesList);
    } catch (error) {
        console.log(error);
    }

    dispatch(fetchAutoSavedJournalEntries());
};

export const deleteAutoSaveJournalEntry = (entryID: JournalEntryID | undefined): ThunkAction<void, RootState, unknown, AnyAction> => async (dispatch, state) => {
    try {
        const {
            autoSavedJournalEntriesList
        } = state().journalEntries;

        const entriesList: JournalEntrySubmissionPayload[] = JSON.parse(JSON.stringify(autoSavedJournalEntriesList));

        // See if we have an existing value to update - new entries use 0 as their ID
        const entryIndex = entriesList.findIndex((existingEntryDetails) => existingEntryDetails.entryID === (entryID || 0));

        // We should never get here theoretically so just stop
        if (entryIndex === -1) {
            return dispatch(fetchAutoSavedJournalEntries());
        }

        // Delete our entry from the list
        entriesList.splice(entryIndex, 1);

        storage.writeKeyLocal(LOCAL_STORAGE_AUTO_SAVE_KEY, entriesList);
    } catch (error) {
        console.log(error);
    }

    return dispatch(fetchAutoSavedJournalEntries());
};

// Fetching all entries
export const selectAllJournalEntries = (state: RootState): JournalEntry[] => state.journalEntries.journalEntriesList;

export const selectAllAutoSavedJournalEntries = (state: RootState): JournalEntrySubmissionPayload[] => state.journalEntries.autoSavedJournalEntriesList;

// Fetching ID-specific entries
export const selectJournalEntryByID = (state: RootState, entryID: JournalEntryID | undefined): JournalEntry | undefined => {
    if (entryID === undefined) {
        return undefined;
    }

    return state.journalEntries.journalEntriesList.find((entryDetails) => entryDetails.entryID === entryID);
};

export const selectAutoSavedJournalEntryByID = (state: RootState, entryID: JournalEntryID): JournalEntrySubmissionPayload | undefined => state.journalEntries.autoSavedJournalEntriesList.find((entryDetails) => entryDetails.entryID === entryID);

export const searchJournalEntries = (searchDetails: Search): ThunkAction<void, RootState, unknown, AnyAction> => async (dispatch) => {
    dispatch(requestLoadingShow());

    try {
        const payload = await client.get<JournalEntry[]>(ROUTE_API_SEARCH, searchDetails);

        if ('errorMessage' in payload) {
            console.log(payload.errorMessage);
        } else {
            dispatch(journalEntriesFetched(payload));
        }
    } catch (error) {
        console.log(error);
    }

    dispatch(requestLoadingHide());
};

export default dashboardSlice.reducer;
