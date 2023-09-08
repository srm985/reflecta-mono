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

import {
    ROUTE_API_JOURNAL_ENTRY, ROUTE_API_SEARCH
} from '@routes';

import {
    JournalEntry, JournalEntryID, JournalEntrySubmissionPayload
} from '@types';

import {
    requestLoadingHide,
    requestLoadingShow
} from './loadingSlice';

const client = new Client();

type State = {
    journalEntriesList: JournalEntry[]
};

const initialState: State = {
    journalEntriesList: []
};

export const dashboardSlice = createSlice({
    initialState,
    name: 'journalEntries',
    reducers: {
        journalEntriesFetched: (state, action: PayloadAction<JournalEntry[]>) => ({
            ...state,
            journalEntriesList: action.payload
        })
    }
});

export const {
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

export const createJournalEntry = (submissionPayload: JournalEntrySubmissionPayload): ThunkAction<void, RootState, unknown, AnyAction> => async (dispatch) => {
    dispatch(requestLoadingShow());

    try {
        await client.post(ROUTE_API_JOURNAL_ENTRY, {
            entryBody: submissionPayload.body,
            entryOccurredAt: submissionPayload.occurredAt,
            entryTitle: submissionPayload.title
        });

        dispatch(fetchJournalEntries(true));
    } catch (error) {
        console.log(error);
    }

    dispatch(requestLoadingHide());
};

export const updateJournalEntry = (submissionPayload: JournalEntrySubmissionPayload): ThunkAction<void, RootState, unknown, AnyAction> => async (dispatch) => {
    dispatch(requestLoadingShow());

    try {
        await client.patch(ROUTE_API_JOURNAL_ENTRY, {
            entryBody: submissionPayload.body,
            entryID: submissionPayload.entryID,
            entryOccurredAt: submissionPayload.occurredAt,
            entryTitle: submissionPayload.title
        });

        dispatch(fetchJournalEntries(true));
    } catch (error) {
        console.log(error);
    }

    dispatch(requestLoadingHide());
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

export const selectAllJournalEntries = (state: RootState): JournalEntry[] => state.journalEntries.journalEntriesList;

export const selectJournalEntryByID = (state: RootState, entryID: JournalEntryID): JournalEntry | undefined => state.journalEntries.journalEntriesList.find((entryDetails) => entryDetails.entryID === entryID);

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
