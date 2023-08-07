import {
    PayloadAction,
    createSlice
} from '@reduxjs/toolkit';

import type {
    RootState
} from '@store/index';

type State = {
    isLoading: boolean;
};

const initialState: State = {
    isLoading: false
};

export const loadingSlice = createSlice({
    initialState,
    name: 'loading',
    reducers: {
        setIsLoading: (state, action: PayloadAction<boolean>) => {
            console.log('loading dispatch received...', action.payload);

            return ({
                ...state,
                isLoading: action.payload
            });
        }
    }
});

export const {
    setIsLoading
} = loadingSlice.actions;

export const fetchIsLoading = (state: RootState): boolean => state.loading.isLoading;

export default loadingSlice.reducer;
