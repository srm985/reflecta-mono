
import {
    RowDataPacket
} from 'mysql2';

import pool from '../db';

export interface JournalEntriesSchema {
    body: string;
    created_at: string;
    deleted_at: string | null;
    entry_id?: number;
    is_high_interest: boolean;
    keywords: string | null;
    occurred_at: string;
    title: string;
    updated_at: string | null;
    user_id: number;
}

export interface JournalEntry {
    body: string;
    createdAt?: string;
    deletedAt?: string | null;
    entryID?: number;
    isHighInterest?: boolean;
    keywords: string | null;
    occurredAt: string;
    title: string;
    updatedAt?: string | null;
    userID?: number;
}

class JournalEntriesModel {
    private readonly TABLE_NAME = 'journal_entries';

    insertJournalEntry = async (userID: number, entryDetails: JournalEntry) => {
        const {
            body,
            isHighInterest,
            keywords,
            occurredAt,
            title
        } = entryDetails;

        const query = 'INSERT INTO ?? (user_id, title, body, keywords, is_high_interest, occurred_at) VALUES (?, ?, ?, ?, ?, ?)';
        const values = [
            this.TABLE_NAME,
            userID,
            title,
            body,
            keywords,
            isHighInterest,
            occurredAt
        ];

        await pool.query(query, values);
    };

    modifyJournalEntry = async (entryID: number, entryDetails: JournalEntry) => {
        const {
            body,
            isHighInterest,
            keywords,
            occurredAt,
            title
        } = entryDetails;

        const query = 'UPDATE ?? SET title = ?, body = ?, keywords = ?, is_high_interest = ?, occurred_at = ? WHERE entry_id = ?';
        const values = [
            this.TABLE_NAME,
            title,
            body,
            keywords,
            isHighInterest,
            occurredAt,
            entryID
        ];

        await pool.query(query, values);
    };

    allJournalEntriesByUserID = async (userID: number): Promise<JournalEntriesSchema[]> => {
        const query = 'SELECT * FROM ?? WHERE user_id = ? AND deleted_at IS NULL ORDER BY occurred_at DESC';
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

    keywordsSearch = async (userID: number, keywordList: string[], join: 'AND' | 'OR'): Promise<JournalEntriesSchema[]> => {
        const bodySearch = keywordList.map(() => 'keywords LIKE ?').join(`${join === 'AND' ? ' AND ' : ' OR '}`);
        const keywordSearch = keywordList.map(() => 'body LIKE ?').join(`${join === 'AND' ? ' AND ' : ' OR '}`);

        const preparedSearch = `${bodySearch} ${join === 'AND' ? ' AND ' : ' OR '} ${keywordSearch}`;

        const searchValues = keywordList.map((keyword) => `%${keyword}%`);

        const query = `SELECT * FROM ?? WHERE user_id = ? AND deleted_at IS NULL AND (${preparedSearch})`;
        const values = [
            this.TABLE_NAME,
            userID,
            ...searchValues,
            ...searchValues
        ];

        const [
            results = []
        ] = await pool.query<JournalEntriesSchema[] & RowDataPacket[][]>(query, values);

        return results;
    };
}

export default JournalEntriesModel;
