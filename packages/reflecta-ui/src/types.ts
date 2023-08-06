export type JournalEntryBody = string;
export type JournalEntryDate = string;
export type JournalEntryID = number;
export type JournalEntryTitle = string;

export type JournalEntry = {
    body: JournalEntryBody;
    entryID: JournalEntryID;
    isHighInterest: boolean;
    occurredAt: JournalEntryDate;
    title: JournalEntryTitle;
    updatedAt: string | null;
};
