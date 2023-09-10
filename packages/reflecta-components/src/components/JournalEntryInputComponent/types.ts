export type Value = string | number;

export type Body = string;
export type Date = string;
export type Title = string;

export type EntryID = number;

export type JournalEntry = {
    body: Body;
    entryID?: EntryID;
    occurredAt: Date;
    title: Title;
};

export type IJournalEntryInputComponent = {
    autoSaveIntervalMS?: number;
    className?: string;
    entryID?: EntryID;
    initialBody?: Body;
    initialOccurredAt?: Date;
    initialTitle?: Title;
    onAutoSave: (journalEntryDetails: JournalEntry) => void;
    onDiscard: () => void;
    onSubmit: (journalEntryDetails: JournalEntry) => void;
};
