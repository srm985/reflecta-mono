export type Value = string | number;

export interface IJournalEntryComponent {
    className?: string;
    label: string;
    name: string;
    onChange: (argument: string) => void;
    value: Value;
}
