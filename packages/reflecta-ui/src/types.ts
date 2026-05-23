export type JournalEntryBody = string;
export type JournalEntryDate = string;
export type JournalEntryID = number;
export type JournalEntryLocation = string;
export type JournalEntryTitle = string;

export type JournalEntry = {
    body: JournalEntryBody;
    entryID: JournalEntryID;
    isHighInterest: boolean;
    location?: string;
    occurredAt: JournalEntryDate;
    title: JournalEntryTitle;
    updatedAt: string | null;
};

export type JournalEntriesPageCursor = {
    entryID: JournalEntryID;
    occurredAt: JournalEntryDate;
};

export type JournalEntriesPageRequest = {
    cursorEntryID?: JournalEntryID;
    cursorOccurredAt?: JournalEntryDate;
    limit?: number;
};

export type JournalEntriesPageResponse = {
    hasMore: boolean;
    journalEntriesList: JournalEntry[];
    nextCursor: JournalEntriesPageCursor | null;
};

export type JournalEntrySubmissionPayload = {
    body: JournalEntryBody;
    entryID?: JournalEntryID;
    location?: JournalEntryLocation;
    occurredAt: JournalEntryDate;
    title: JournalEntryTitle;
};
