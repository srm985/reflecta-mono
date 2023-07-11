export type EntryID = number;

export type IJournalEntryDisplayComponent = {
    body: string;
    className?: string;
    entryID: EntryID
    isHighInterest: boolean;
    occurredAt: string;
    onDelete: (entryID: number) => void;
    onEdit: (entryID: EntryID) => void;
    title: string;
    updatedAt: string | null;
};
