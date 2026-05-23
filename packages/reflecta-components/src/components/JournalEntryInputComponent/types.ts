export type Value = string | number;

export type Title = string;
export type Date = string;
export type Location = string;
export type Body = string;

export type EntryID = number;

export type AutoSaveResult = boolean | void;
export type AutoSaveStatus = 'failed' | 'idle' | 'saved' | 'saving' | 'unsaved';

export type JournalEntry = {
    body: Body;
    entryID?: EntryID;
    location?: Location;
    occurredAt: Date;
    title: Title;
};

export type IJournalEntryInputComponent = {
    autoSaveIntervalMS?: number;
    className?: string;
    entryID?: EntryID;
    googleMapsAPIKey: string;
    initialBody?: Body;
    initialLocation?: Location;
    initialOccurredAt?: Date;
    initialTitle?: Title;
    onAutoSave: (journalEntryDetails: JournalEntry) => AutoSaveResult | Promise<AutoSaveResult>;
    onDiscard: () => void;
    onSubmit: (journalEntryDetails: JournalEntry) => void;
};
