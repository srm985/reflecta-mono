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
import deviceLocation from '@utils/deviceLocation';

import {
    ROUTE_API_LOCATION
} from '@routes';

import {
    JournalEntryLocation
} from '@types';

import {
    requestLoadingHide,
    requestLoadingShow
} from './loadingSlice';

export type LocationResponse = {
    location?: string;
};

const client = new Client();

type State = {
    location?: string;
};

const initialState: State = {
    location: undefined
};

export const locationSlice = createSlice({
    initialState,
    name: 'location',
    reducers: {
        setLocation: (state, action: PayloadAction<JournalEntryLocation | undefined>) => ({
            ...state,
            location: action.payload
        })
    }
});

export const {
    setLocation
} = locationSlice.actions;

export const fetchLocation = (): ThunkAction<void, RootState, unknown, AnyAction> => async (dispatch, state) => {
    dispatch(requestLoadingShow());

    try {
        if (state().location.location) {
            return undefined;
        }

        const deviceLocationDetails = await deviceLocation();

        if (!deviceLocationDetails) {
            return dispatch(setLocation(undefined));
        }

        const {
            coords: {
                latitude,
                longitude
            }
        } = deviceLocationDetails;

        const {
            location
        } = await client.get<LocationResponse>(ROUTE_API_LOCATION, {
            latitude,
            longitude
        });

        return dispatch(setLocation(location));
    } catch (error) {
        return dispatch(setLocation(undefined));
    } finally {
        dispatch(requestLoadingHide());
    }
};

// Retrieve current device location
export const selectLocation = (state: RootState): JournalEntryLocation | undefined => state.location.location;

export default locationSlice.reducer;
