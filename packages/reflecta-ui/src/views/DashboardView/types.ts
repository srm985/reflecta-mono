import {
    Dispatch
} from 'react';

export interface JournalEntry {
    body: string;
    entryID: number;
    isHighInterest: boolean;
    occurredAt: string;
    title: string;
    updatedAt: string | null;
}

export interface NewJournalEntry {
    body: string;
    date: string;
    title: string;
}

export interface State {
    isAddingEntry: boolean;
    journalEntriesList: JournalEntry[]
}

export type Action =
  | { type: 'SET_JOURNAL_ENTRIES_LIST'; payload: JournalEntry[] }
  | { type: 'TOGGLE_ADDING_ENTRY'; };

type DispatchAction = Dispatch<Action>;

export interface IDashboardView {
    state: State;
    dispatch: DispatchAction;
}
