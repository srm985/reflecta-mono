export type EntryID = number;

export type IJournalEntryDisplayComponent = {
    body: string;
    className?: string;
    entryID: EntryID
    occurredAt: string;
    onDelete: (entryID: number) => void;
    onEdit: (entryID: EntryID) => void;
    title: string;
    updatedAt: string | null;
};
