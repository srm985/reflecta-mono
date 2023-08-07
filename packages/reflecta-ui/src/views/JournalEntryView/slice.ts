// import {
//     AnyAction,
//     PayloadAction,
//     ThunkAction,
//     createSlice
// } from '@reduxjs/toolkit';

// import type {
//     RootState
// } from '@store/index';

// import {
//     fetchJournalEntries
// } from '@store/slices/journalEntriesSlice';
// import {
//     setIsLoading
// } from '@store/slices/loadingSlice';

// import Client from '@utils/Client';

// import {
//     ROUTE_API_JOURNAL_ENTRY
// } from '@routes';

// import {
//     JournalEntry,
//     JournalEntrySubmissionPayload
// } from '@types';

// const client = new Client();

// type State = {
//     journalEntriesList: JournalEntry[]
// };

// const initialState: State = {
//     journalEntriesList: []
// };

// export const dashboardSlice = createSlice({
//     initialState,
//     name: 'journalEntries',
//     reducers: {
//         submissionSuccess: (state, action: PayloadAction<JournalEntry[]>) => ({
//             ...state,
//             journalEntriesList: action.payload
//         })
//     }
// });

// export const {
//     submissionSuccess
// } = dashboardSlice.actions;

// export default dashboardSlice.reducer;
