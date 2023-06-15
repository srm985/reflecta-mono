import {
    Dispatch
} from 'react';

export interface JournalEntry {
    body: string;
    entryID: number;
    occurredAt: string;
    title: string;
    updatedAt: string | null;
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
