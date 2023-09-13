import {
    configureStore
} from '@reduxjs/toolkit';

import accountDetailsReducer from './slices/accountDetailsSlice';
import journalEntriesReducer from './slices/journalEntriesSlice';
import loadingReducer from './slices/loadingSlice';

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const store = configureStore({
    reducer: {
        accountDetails: accountDetailsReducer,
        journalEntries: journalEntriesReducer,
        loading: loadingReducer
    }
});

export default store;
