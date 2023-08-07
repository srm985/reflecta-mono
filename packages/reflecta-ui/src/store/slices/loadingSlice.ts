import {
    createSlice
} from '@reduxjs/toolkit';

import type {
    RootState
} from '@store/index';

type State = {
    loadingIndicatorRequestCount: number;
};

const initialState: State = {
    loadingIndicatorRequestCount: 0
};

export const loadingSlice = createSlice({
    initialState,
    name: 'loading',
    reducers: {
        requestLoadingHide: (state) => ({
            ...state,
            loadingIndicatorRequestCount: Math.max(state.loadingIndicatorRequestCount - 1, 0)
        }),
        requestLoadingShow: (state) => ({
            ...state,
            loadingIndicatorRequestCount: state.loadingIndicatorRequestCount + 1
        })
    }
});

export const {
    requestLoadingHide,
    requestLoadingShow
} = loadingSlice.actions;

export const fetchLoadingStatus = (state: RootState): boolean => state.loading.loadingIndicatorRequestCount > 0;

export default loadingSlice.reducer;
