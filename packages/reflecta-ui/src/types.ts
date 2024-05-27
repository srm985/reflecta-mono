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

export type JournalEntrySubmissionPayload = {
    body: JournalEntryBody;
    entryID?: JournalEntryID;
    location?: JournalEntryLocation;
    occurredAt: JournalEntryDate;
    title: JournalEntryTitle;
};
