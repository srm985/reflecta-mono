
import {
    RowDataPacket
} from 'mysql2';

import pool from '../db';

export interface JournalEntriesSchema {
    body: string | null;
    created_at: string;
    deleted_at: string | null;
    entry_id?: number;
    title: string | null;
    updated_at: string | null;
    user_id: number;
}

export interface JournalEntry {
    body: string | null;
    createdAt?: string;
    deletedAt?: string | null;
    entryID?: number;
    title: string | null;
    updatedAt?: string | null;
    userID?: number;
}

class JournalEntriesModel {
    private readonly TABLE_NAME = 'journal_entries';

    insertJournalEntry = async (userID: number, entryDetails: JournalEntry) => {
        const {
            body,
            title
        } = entryDetails;

        const query = 'INSERT INTO ?? (user_id, title, body) VALUES (?, ?, ?)';
        const values = [
            this.TABLE_NAME,
            userID,
            title,
            body
        ];

        await pool.query(query, values);
    };

    modifyJournalEntry = async (entryID: number, entryDetails: JournalEntry) => {
        const {
            body,
            title
        } = entryDetails;

        const query = 'UPDATE ?? SET title = ?, body = ? WHERE entry_id = ?';
        const values = [
            this.TABLE_NAME,
            title,
            body,
            entryID
        ];

        await pool.query(query, values);
    };

    allJournalEntriesByUserID = async (userID: number): Promise<JournalEntriesSchema[]> => {
        const query = 'SELECT * FROM ?? WHERE user_id = ? AND deleted_at IS NULL';
        const values = [
            this.TABLE_NAME,
            userID
        ];

        const [
            results = []
        ] = await pool.query<JournalEntriesSchema[] & RowDataPacket[][]>(query, values);

        return results;
    };

    journalEntry = async (entryID: number): Promise<JournalEntriesSchema | undefined> => {
        const query = 'SELECT * FROM ?? WHERE entry_id = ? AND deleted_at IS NULL';
        const values = [
            this.TABLE_NAME,
            entryID
        ];

        const [
            results = []
        ] = await pool.query<JournalEntriesSchema[] & RowDataPacket[][]>(query, values);

        return results[0];
    };

    deleteJournalEntry = async (entryID: number) => {
        const query = 'UPDATE ?? SET deleted_at = CURRENT_TIMESTAMP WHERE entry_id = ?';
        const values = [
            this.TABLE_NAME,
            entryID
        ];

        return pool.query(query, values);
    };
}

export default JournalEntriesModel;