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
    isAddingEntry: false,
    journalEntriesList: []
};

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'SET_JOURNAL_ENTRIES_LIST':
            return ({
                ...state,
                journalEntriesList: action.payload
            });
        case 'TOGGLE_ADDING_ENTRY':
            return ({
                ...state,
                isAddingEntry: !state.isAddingEntry
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
