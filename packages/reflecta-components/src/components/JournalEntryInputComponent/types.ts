export type Value = string | number;

export interface JournalEntry {
    body: string;
    date: string;
    title: string;
}

export interface IJournalEntryInputComponent {
    className?: string;
    onSubmit: (argument: JournalEntry) => void;
}
