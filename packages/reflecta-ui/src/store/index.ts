import {
    configureStore
} from '@reduxjs/toolkit';

import journalEntriesReducer from './slices/journalEntriesSlice';

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const store = configureStore({
    reducer: {
        journalEntries: journalEntriesReducer
    }
});

export default store;
