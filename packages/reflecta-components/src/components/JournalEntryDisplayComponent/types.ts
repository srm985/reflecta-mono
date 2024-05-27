import {
    Location
} from '@components/JournalEntryInputComponent/types';

export type EntryID = number;

export type IJournalEntryDisplayComponent = {
    body: string;
    className?: string;
    entryID: EntryID
    isHighInterest: boolean;
    location?: Location;
    occurredAt: string;
    onDelete: (entryID: number) => void;
    onEdit: (entryID: EntryID) => void;
    title: string;
    updatedAt: string | null;
};
