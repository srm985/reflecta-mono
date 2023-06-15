import {
    Dispatch
} from 'react';

export interface JournalEntry {
    body: string | null;
    createdAt?: string;
    deletedAt?: string | null;
    entryID?: number;
    title: string | null;
    updatedAt?: string | null;
    userID?: number;
}

export interface State {
    journalEntriesList: JournalEntry[]
}

export type Action =
  | { type: 'SET_JOURNAL_ENTRIES_LIST'; payload: JournalEntry[] };

type DispatchAction = Dispatch<Action>;

export interface IDashboardView {
    state: State;
    dispatch: DispatchAction;
}
