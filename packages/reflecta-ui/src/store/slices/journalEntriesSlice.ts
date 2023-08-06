import {
    AnyAction,
    PayloadAction,
    ThunkAction,
    createSlice
} from '@reduxjs/toolkit';

import type {
    RootState
} from '@store/index';

import Client from '@utils/Client';

import {
    ROUTE_API_JOURNAL_ENTRY
} from '@routes';

import {
    JournalEntry
} from '@types';

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

export const fetchJournalEntries = (): ThunkAction<void, RootState, unknown, AnyAction> => async (dispatch) => {
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
};

export const selectAllJournalEntries = (state: RootState): JournalEntry[] => state.journalEntries.journalEntriesList;

export default dashboardSlice.reducer;
