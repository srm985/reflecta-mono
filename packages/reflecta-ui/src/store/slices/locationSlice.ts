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
    ROUTE_EXTERNAL_GOOGLE_LOCATION
} from '@routes';

import {
    GOOGLE_MAPS_API_KEY
} from '@constants';

import {
    JournalEntryLocation
} from '@types';

import {
    requestLoadingHide,
    requestLoadingShow
} from './loadingSlice';

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

export const renewLocation = (): ThunkAction<void, RootState, unknown, AnyAction> => async (dispatch) => {
    dispatch(requestLoadingShow());

    try {
        const deviceLocationDetails = await deviceLocation();

        console.log({
            deviceLocationDetails
        });

        if (!deviceLocationDetails) {
            return dispatch(setLocation(undefined));
        }

        const {
            coords: {
                latitude,
                longitude
            }
        } = deviceLocationDetails;

        const googleMapsHydratedEndpoint = ROUTE_EXTERNAL_GOOGLE_LOCATION
            .replace('{LATITUDE}', latitude.toString())
            .replace('{LONGITUDE}', longitude.toString())
            .replace('{GOOGLE_MAPS_API_KEY}', GOOGLE_MAPS_API_KEY);

        const {
            results
        } = await client.get<google.maps.GeocoderResponse>(googleMapsHydratedEndpoint, undefined, true);

        const locationDetails = results.find((result) => result.types.includes('administrative_area_level_2'));

        if (!locationDetails) {
            return dispatch(setLocation(undefined));
        }

        const {
            formatted_address: formattedAddress
        } = locationDetails;

        return dispatch(setLocation(formattedAddress));
    } catch (error) {
        return dispatch(setLocation(undefined));
    } finally {
        dispatch(requestLoadingHide());
    }
};

// Retrieve current device location
export const selectLocation = (state: RootState): JournalEntryLocation | undefined => state.location.location;

export default locationSlice.reducer;
