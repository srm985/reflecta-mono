export type KeywordSearchOption = 'disabled' | 'matchesAny' | 'matchesAll';
export type DateSearchOption = 'disabled' | 'entryDate' | 'dateRange';
export type SearchKeyword = string;

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

export type ISearchComponent = {
    className?: string;
    onReset: () => void;
    onSearch: (search: Search) => void;
};
