import type {
    JournalEntry
} from '@types';

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
    journalEntriesList: JournalEntry[]
};

export type IDashboardView = {};
