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
    editingEntryBody: '',
    editingEntryID: undefined,
    editingEntryOccurredAt: '',
    editingEntryTitle: '',
    isEntryEditorVisible: false,
    journalEntriesList: []
};

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'SET_JOURNAL_ENTRIES_LIST':
            return ({
                ...state,
                journalEntriesList: action.payload
            });
        case 'CLEAR_JOURNAL_ENTRY':
            return ({
                ...state,
                editingEntryBody: '',
                editingEntryID: undefined,
                editingEntryOccurredAt: '',
                editingEntryTitle: '',
                isEntryEditorVisible: false
            });
        case 'SET_CREATING_JOURNAL_ENTRY':
            return ({
                ...state,
                isEntryEditorVisible: true
            });
        case 'SET_EDITING_JOURNAL_ENTRY':
            return ({
                ...state,
                editingEntryBody: action.payload.body,
                editingEntryID: action.payload.entryID,
                editingEntryOccurredAt: action.payload.occurredAt,
                editingEntryTitle: action.payload.title,
                isEntryEditorVisible: true
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
