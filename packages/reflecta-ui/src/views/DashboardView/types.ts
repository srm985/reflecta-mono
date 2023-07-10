import {
    Dispatch
} from 'react';

export type Body = string;
export type Date = string;
export type Title = string;

export type EntryID = number;

export type JournalEntry = {
    body: Body;
    entryID: EntryID;
    isHighInterest: boolean;
    occurredAt: Date;
    title: Title;
    updatedAt: string | null;
};

export type PendingJournalEntry = {
    body: Body;
    entryID?: EntryID;
    occurredAt: Date;
    title: Title;
};

export type KeywordSearchOption = 'disabled' | 'matchesAny' | 'matchesAll';
export type DateSearchOption = 'disabled' | 'entryDate' | 'dateRange';
export type SearchKeyword = string | number;

export type Search = {
    dateSearchOption: DateSearchOption;
    entryDate: string;
    keywordSearchOption: KeywordSearchOption;
    searchEndDate: string;
    searchKeywordsList: SearchKeyword[];
    searchStartDate: string;
    searchString: string;
    useAISearch: boolean;
};

export type State = {
    editingEntryBody: Body;
    editingEntryID: EntryID | undefined;
    editingEntryOccurredAt: Date;
    editingEntryTitle: Title;
    isEntryEditorVisible: boolean;
    journalEntriesList: JournalEntry[]
};

export type Action =
  | { type: 'SET_JOURNAL_ENTRIES_LIST'; payload: JournalEntry[]; }
  | { type: 'CLEAR_JOURNAL_ENTRY'; }
  | { type: 'SET_CREATING_JOURNAL_ENTRY'; }
  | { type: 'SET_EDITING_JOURNAL_ENTRY'; payload: Required<PendingJournalEntry> };

type DispatchAction = Dispatch<Action>;

export type IDashboardView = {
    state: State;
    dispatch: DispatchAction;
};
