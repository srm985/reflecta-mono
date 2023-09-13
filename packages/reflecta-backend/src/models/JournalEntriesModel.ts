
import {
    RowDataPacket
} from 'mysql2';

import pool from '../db';

import {
    UserID
} from '@types';

export type Body = string;
export type CreatedAt = string;
export type DeletedAt = string | null;
export type EntryID = number;
export type IsHighInterest = boolean;
export type Keywords = string | null;
export type OccurredAt = string;
export type Title = string;
export type UpdatedAt = string | null;

export interface JournalEntriesSchema {
    body: Body;
    created_at: CreatedAt;
    deleted_at: DeletedAt;
    entry_id?: EntryID;
    is_high_interest: IsHighInterest;
    keywords: Keywords;
    occurred_at: OccurredAt;
    title: Title;
    updated_at: UpdatedAt;
    user_id: UserID;
}

export interface JournalEntry {
    body: Body;
    createdAt?: CreatedAt;
    deletedAt?: DeletedAt;
    entryID?: EntryID;
    isHighInterest?: IsHighInterest;
    keywords: Keywords;
    occurredAt: OccurredAt;
    title: Title;
    updatedAt?: UpdatedAt;
    userID?: UserID;
}

class JournalEntriesModel {
    private readonly TABLE_NAME = 'journal_entries';

    insertJournalEntry = async (userID: UserID, entryDetails: JournalEntry) => {
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

    modifyTitle = async (entryID: number, title: Title) => {
        const query = 'UPDATE ?? SET title = ? WHERE entry_id = ?';
        const values = [
            this.TABLE_NAME,
            title,
            entryID
        ];

        await pool.query(query, values);
    };

    modifyOccurredAt = async (entryID: number, occurredAt: OccurredAt) => {
        const query = 'UPDATE ?? SET occurred_at = ? WHERE entry_id = ?';
        const values = [
            this.TABLE_NAME,
            occurredAt,
            entryID
        ];

        await pool.query(query, values);
    };

    allJournalEntriesByUserID = async (userID: UserID): Promise<JournalEntriesSchema[]> => {
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

    journalEntryByKeywords = async (userID: UserID, keywordList: string[], join: 'AND' | 'OR'): Promise<JournalEntriesSchema[]> => {
        const bodySearch = keywordList.map(() => 'keywords LIKE ?').join(`${join === 'AND' ? ' AND ' : ' OR '}`);
        const keywordSearch = keywordList.map(() => 'body LIKE ?').join(`${join === 'AND' ? ' AND ' : ' OR '}`);

        const preparedSearch = `${bodySearch} ${join === 'AND' ? ' AND ' : ' OR '} ${keywordSearch}`;

        const searchValues = keywordList.map((keyword) => `%${keyword}%`);

        // Template literal is safe here because it's coming from hard coded values above
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

    journalEntriesByDate = async (userID: UserID, entryDate: string): Promise<JournalEntriesSchema[]> => {
        const query = 'SELECT * FROM ?? WHERE user_id = ? AND deleted_at IS NULL AND occurred_at = ?';
        const values = [
            this.TABLE_NAME,
            userID,
            entryDate
        ];

        const [
            results = []
        ] = await pool.query<JournalEntriesSchema[] & RowDataPacket[][]>(query, values);

        return results;
    };

    journalEntriesByDateRange = async (userID: UserID, startDate: string, endDate: string): Promise<JournalEntriesSchema[]> => {
        const query = 'SELECT * FROM ?? WHERE user_id = ? AND deleted_at IS NULL AND occurred_at >= ? and occurred_at <= ?';
        const values = [
            this.TABLE_NAME,
            userID,
            startDate,
            endDate
        ];

        const [
            results = []
        ] = await pool.query<JournalEntriesSchema[] & RowDataPacket[][]>(query, values);

        return results;
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
