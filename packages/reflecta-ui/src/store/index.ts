import {
    configureStore
} from '@reduxjs/toolkit';

import accountDetailsReducer from './slices/accountDetailsSlice';
import journalEntriesReducer from './slices/journalEntriesSlice';
import loadingReducer from './slices/loadingSlice';
import locationReducer from './slices/locationSlice';

const store = configureStore({
    reducer: {
        accountDetails: accountDetailsReducer,
        journalEntries: journalEntriesReducer,
        loading: loadingReducer,
        location: locationReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
