export interface IJournalEntryDisplayComponent {
    body: string;
    className?: string;
    occurredAt: string;
    title: string;
    updatedAt: string | null;
}
