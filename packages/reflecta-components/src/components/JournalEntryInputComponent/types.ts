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
    className?: string;
    entryID?: EntryID;
    initialBody?: Body;
    initialOccurredAt?: Date;
    initialTitle?: Title;
    onDiscard: () => void;
    onSubmit: (argument: JournalEntry) => void;
};
