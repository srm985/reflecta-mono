import {
    FC,
    useReducer
} from 'react';

import {
    Action,
    ILoginView,
    State
} from './types';

const initialState: State = {
    emailAddress: '',
    password: ''
};

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'UPDATE_EMAIL_ADDRESS':
            return ({
                ...state,
                emailAddress: action.payload
            });
        case 'UPDATE_PASSWORD':
            return ({
                ...state,
                password: action.payload
            });
        default:
            return state;
    }
};

const withReducer = (Component: FC<ILoginView>) => () => {
    const [
        state,
        dispatch
    ] = useReducer(reducer, initialState);

    return (
        <Component
            dispatch={dispatch}
            state={state}
        />
    );
};

export default withReducer;
