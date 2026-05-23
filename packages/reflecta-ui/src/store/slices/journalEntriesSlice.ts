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
    JournalEntriesPageCursor,
    JournalEntriesPageRequest,
    JournalEntriesPageResponse,
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

const JOURNAL_ENTRIES_PAGE_LIMIT = 12;

type JournalEntriesMode = 'partial' | 'search' | 'timeline';

type FetchJournalEntriesOptions = {
    shouldAppend?: boolean;
    shouldReload?: boolean;
};

type JournalEntriesFetchedPayload = JournalEntriesPageResponse & {
    mode: JournalEntriesMode;
    shouldAppend: boolean;
};

type SearchJournalEntriesOptions = {
    shouldAppend?: boolean;
};

type State = {
    activeMode: JournalEntriesMode;
    autoSavedJournalEntriesList: JournalEntrySubmissionPayload[];
    hasMoreJournalEntries: boolean;
    isJournalEntriesPageLoading: boolean;
    journalEntriesList: JournalEntry[];
    nextJournalEntriesCursor: JournalEntriesPageCursor | null;
};

const initialState: State = {
    activeMode: 'timeline',
    autoSavedJournalEntriesList: [],
    hasMoreJournalEntries: false,
    isJournalEntriesPageLoading: false,
    journalEntriesList: [],
    nextJournalEntriesCursor: null
};

const buildPageRequest = (cursor: JournalEntriesPageCursor | null): JournalEntriesPageRequest => ({
    ...(cursor ? {
        cursorEntryID: cursor.entryID,
        cursorOccurredAt: cursor.occurredAt
    } : {}),
    limit: JOURNAL_ENTRIES_PAGE_LIMIT
});

const sortJournalEntriesList = (journalEntriesList: JournalEntry[]): JournalEntry[] => [
    ...journalEntriesList
].sort((firstEntry, secondEntry) => {
    const dateSort = secondEntry.occurredAt.localeCompare(firstEntry.occurredAt);

    if (dateSort !== 0) {
        return dateSort;
    }

    return secondEntry.entryID - firstEntry.entryID;
});

const mergeJournalEntriesList = (currentJournalEntriesList: JournalEntry[], nextJournalEntriesList: JournalEntry[]): JournalEntry[] => {
    const journalEntriesByID = new Map<JournalEntryID, JournalEntry>();

    currentJournalEntriesList.forEach((journalEntryDetails) => {
        journalEntriesByID.set(journalEntryDetails.entryID, journalEntryDetails);
    });

    nextJournalEntriesList.forEach((journalEntryDetails) => {
        journalEntriesByID.set(journalEntryDetails.entryID, journalEntryDetails);
    });

    return sortJournalEntriesList(Array.from(journalEntriesByID.values()));
};

export const dashboardSlice = createSlice({
    initialState,
    name: 'journalEntries',
    reducers: {
        autoSavedJournalEntriesFetched: (state, action: PayloadAction<JournalEntrySubmissionPayload[]>) => ({
            ...state,
            autoSavedJournalEntriesList: action.payload
        }),
        journalEntriesFetched: (state, action: PayloadAction<JournalEntriesFetchedPayload>) => ({
            ...state,
            activeMode: action.payload.mode,
            hasMoreJournalEntries: action.payload.hasMore,
            isJournalEntriesPageLoading: false,
            journalEntriesList: action.payload.shouldAppend ? mergeJournalEntriesList(state.journalEntriesList, action.payload.journalEntriesList) : sortJournalEntriesList(action.payload.journalEntriesList),
            nextJournalEntriesCursor: action.payload.nextCursor
        }),
        journalEntriesPageLoadFinished: (state) => ({
            ...state,
            isJournalEntriesPageLoading: false
        }),
        journalEntriesPageLoadStarted: (state) => ({
            ...state,
            isJournalEntriesPageLoading: true
        }),
        journalEntryFetched: (state, action: PayloadAction<JournalEntry>) => ({
            ...state,
            activeMode: 'partial',
            journalEntriesList: mergeJournalEntriesList(state.journalEntriesList, [
                action.payload
            ])
        })
    }
});

export const {
    autoSavedJournalEntriesFetched,
    journalEntriesFetched,
    journalEntriesPageLoadFinished,
    journalEntriesPageLoadStarted,
    journalEntryFetched
} = dashboardSlice.actions;

export const fetchJournalEntries = (options: FetchJournalEntriesOptions = {}): ThunkAction<void, RootState, unknown, AnyAction> => async (dispatch, state) => {
    const {
        shouldAppend = false,
        shouldReload = false
    } = options;

    const {
        activeMode,
        hasMoreJournalEntries,
        isJournalEntriesPageLoading,
        journalEntriesList,
        nextJournalEntriesCursor
    } = state().journalEntries;

    if (isJournalEntriesPageLoading) {
        return undefined;
    }

    if (shouldAppend && !hasMoreJournalEntries) {
        return undefined;
    }

    if (!shouldReload && !shouldAppend && activeMode === 'timeline' && journalEntriesList.length) {
        return undefined;
    }

    dispatch(journalEntriesPageLoadStarted());

    if (!shouldAppend) {
        dispatch(requestLoadingShow());
    }

    try {
        const payload = await client.get<JournalEntriesPageResponse>(ROUTE_API_JOURNAL_ENTRY, buildPageRequest(shouldAppend ? nextJournalEntriesCursor : null));

        if ('errorMessage' in payload) {
            console.log(payload.errorMessage);
        } else {
            dispatch(journalEntriesFetched({
                ...payload,
                mode: 'timeline',
                shouldAppend
            }));
        }
    } catch (error) {
        console.log(error);
    }

    if (!shouldAppend) {
        dispatch(requestLoadingHide());
    }

    return dispatch(journalEntriesPageLoadFinished());
};

export const fetchJournalEntryByID = (entryID: JournalEntryID): ThunkAction<void, RootState, unknown, AnyAction> => async (dispatch, state) => {
    const existingEntryDetails = state().journalEntries.journalEntriesList.find((journalEntryDetails) => journalEntryDetails.entryID === entryID);

    if (existingEntryDetails) {
        return undefined;
    }

    dispatch(requestLoadingShow());

    try {
        const payload = await client.get<JournalEntry>(`${ROUTE_API_JOURNAL_ENTRY}/${entryID}`);

        if ('errorMessage' in payload) {
            console.log(payload.errorMessage);
        } else {
            dispatch(journalEntryFetched(payload));
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
            entryLocation: submissionPayload.location,
            entryOccurredAt: submissionPayload.occurredAt,
            entryTitle: submissionPayload.title
        });

        dispatch(requestLoadingHide());

        dispatch(fetchJournalEntries({
            shouldReload: true
        }));

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
            entryLocation: submissionPayload.location,
            entryOccurredAt: submissionPayload.occurredAt,
            entryTitle: submissionPayload.title
        });

        dispatch(requestLoadingHide());

        dispatch(fetchJournalEntries({
            shouldReload: true
        }));

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

        dispatch(fetchJournalEntries({
            shouldReload: true
        }));
    } catch (error) {
        console.log(error);
    }

    dispatch(requestLoadingHide());
};

export const autoSaveJournalEntry = (entryDetails: JournalEntrySubmissionPayload): ThunkAction<Promise<boolean>, RootState, unknown, AnyAction> => async (dispatch, state) => {
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
        dispatch(autoSavedJournalEntriesFetched(entriesList));

        return true;
    } catch (error) {
        console.log(error);

        return false;
    }
};

export const deleteAutoSaveJournalEntry = (entryID: JournalEntryID | undefined): ThunkAction<void, RootState, unknown, AnyAction> => async (dispatch, state) => {
    try {
        dispatch(fetchAutoSavedJournalEntries());

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

export const selectJournalEntriesHasMore = (state: RootState): boolean => state.journalEntries.hasMoreJournalEntries;

export const selectJournalEntriesPageLoading = (state: RootState): boolean => state.journalEntries.isJournalEntriesPageLoading;

// Fetching ID-specific entries
export const selectJournalEntryByID = (state: RootState, entryID: JournalEntryID | undefined): JournalEntry | undefined => {
    if (entryID === undefined) {
        return undefined;
    }

    return state.journalEntries.journalEntriesList.find((entryDetails) => entryDetails.entryID === entryID);
};

export const selectAutoSavedJournalEntryByID = (state: RootState, entryID: JournalEntryID): JournalEntrySubmissionPayload | undefined => state.journalEntries.autoSavedJournalEntriesList.find((entryDetails) => entryDetails.entryID === entryID);

export const searchJournalEntries = (searchDetails: Search, options: SearchJournalEntriesOptions = {}): ThunkAction<void, RootState, unknown, AnyAction> => async (dispatch, state) => {
    const {
        shouldAppend = false
    } = options;

    const {
        hasMoreJournalEntries,
        isJournalEntriesPageLoading,
        nextJournalEntriesCursor
    } = state().journalEntries;

    if (isJournalEntriesPageLoading) {
        return undefined;
    }

    if (shouldAppend && !hasMoreJournalEntries) {
        return undefined;
    }

    dispatch(journalEntriesPageLoadStarted());

    if (!shouldAppend) {
        dispatch(requestLoadingShow());
    }

    try {
        const payload = await client.get<JournalEntriesPageResponse>(ROUTE_API_SEARCH, {
            ...searchDetails,
            ...buildPageRequest(shouldAppend ? nextJournalEntriesCursor : null)
        });

        if ('errorMessage' in payload) {
            console.log(payload.errorMessage);
        } else {
            dispatch(journalEntriesFetched({
                ...payload,
                mode: 'search',
                shouldAppend
            }));
        }
    } catch (error) {
        console.log(error);
    }

    if (!shouldAppend) {
        dispatch(requestLoadingHide());
    }

    return dispatch(journalEntriesPageLoadFinished());
};

export default dashboardSlice.reducer;
