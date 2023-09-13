import {
    AnyAction,
    PayloadAction,
    ThunkAction,
    createSlice
} from '@reduxjs/toolkit';

import {
    AccountDetails,
    EmailAddress,
    FirstName,
    LastName,
    Password,
    UserID
} from '@views/AccountView/types';

import type {
    RootState
} from '@store/index';

import Client from '@utils/Client';

import {
    ROUTE_API_ACCOUNT_DETAILS
} from '@routes';

import {
    requestLoadingHide,
    requestLoadingShow
} from './loadingSlice';

const client = new Client();

type State = {
    emailAddress: EmailAddress;
    firstName: FirstName;
    lastName: LastName;
    password?: Password;
    userID?: UserID;
};

const initialState: State = {
    emailAddress: '',
    firstName: '',
    lastName: '',
    password: '',
    userID: null
};

export const accountDetailsSlice = createSlice({
    initialState,
    name: 'accountDetails',
    reducers: {
        accountDetailsFetched: (state, action: PayloadAction<AccountDetails>) => ({
            ...state,
            emailAddress: action.payload.emailAddress,
            firstName: action.payload.firstName,
            lastName: action.payload.lastName,
            password: action.payload.password,
            userID: action.payload.userID
        })
    }
});

export const {
    accountDetailsFetched
} = accountDetailsSlice.actions;

export const fetchAccountDetails = (): ThunkAction<void, RootState, unknown, AnyAction> => async (dispatch) => {
    dispatch(requestLoadingShow());

    try {
        const payload = await client.get<AccountDetails>(ROUTE_API_ACCOUNT_DETAILS);

        if ('errorMessage' in payload) {
            console.log(payload.errorMessage);
        } else {
            dispatch(accountDetailsFetched(payload));
        }
    } catch (error) {
        console.log(error);
    }

    return dispatch(requestLoadingHide());
};

export const selectAllAccountDetails = (state: RootState): AccountDetails => state.accountDetails;

export default accountDetailsSlice.reducer;
