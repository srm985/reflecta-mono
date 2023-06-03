import {
    Dispatch
} from 'react';

export interface ILoginView extends InjectedProps {}

export type Action =
  | { type: 'UPDATE_EMAIL_ADDRESS'; payload: string }
  | { type: 'UPDATE_PASSWORD'; payload: string };

type DispatchAction = Dispatch<Action>;

export interface InjectedProps {
    state: State;
    dispatch: DispatchAction;
}

export interface State {
    emailAddress: string;
    password: string;
}
