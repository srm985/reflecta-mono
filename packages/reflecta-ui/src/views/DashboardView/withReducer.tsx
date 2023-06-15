import {
    FC,
    useReducer
} from 'react';

import {
    Action,
    IDashboardView,
    State
} from './types';

const initialState: State = {
    journalEntriesList: []
};

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'SET_JOURNAL_ENTRIES_LIST':
            return ({
                ...state,
                journalEntriesList: action.payload
            });
        default:
            return state;
    }
};

const withReducer = (Component: FC<IDashboardView>) => () => {
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
