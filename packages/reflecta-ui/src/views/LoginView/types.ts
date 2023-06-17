import {
    Dispatch
} from 'react';

export interface LoginResponsePayload {
    tokenSignature: string;
}

export interface State {
    emailAddress: string;
    isAuthenticated: boolean;
    password: string;
}

export type Action =
  | { type: 'UPDATE_EMAIL_ADDRESS'; payload: string }
  | { type: 'UPDATE_PASSWORD'; payload: string }
  | { type: 'SET_AUTHENTICATED'; };

type DispatchAction = Dispatch<Action>;

export interface ILoginView {
    state: State;
    dispatch: DispatchAction;
}
