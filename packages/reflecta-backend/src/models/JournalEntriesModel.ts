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
export type Location = string;
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
    location?: Location;
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
    location?: Location;
    occurredAt: OccurredAt;
    title: Title;
    updatedAt?: UpdatedAt;
    userID?: UserID;
}

export type SearchableColumn = 'body' | 'keywords' | 'location' | 'title';
export type SearchJoin = 'AND' | 'OR';

export type JournalEntriesPageCursor = {
    entryID: EntryID;
    occurredAt: OccurredAt;
};

export type JournalEntriesPageDetails = {
    cursor?: JournalEntriesPageCursor;
    limit: number;
};

export type JournalEntriesPageResult = {
    entriesList: JournalEntriesSchema[];
    hasMore: boolean;
    nextCursor?: JournalEntriesPageCursor;
};

export type JournalEntrySearchDetails = {
    dateSearchOption: 'disabled' | 'entryDate' | 'dateRange';
    entryDate: string;
    keywordSearchOption: 'disabled' | 'matchesAny' | 'matchesAll';
    searchEndDate: string;
    searchKeywordsList: string[];
    searchStartDate: string;
    textKeywordsList: string[];
};

export type SearchClause = {
    clause: string;
    values: Array<string | number>;
};

class JournalEntriesModel {
    private readonly SEARCHABLE_COLUMNS: SearchableColumn[] = [
        'title',
        'body',
        'keywords',
        'location'
    ];

    private readonly TABLE_NAME = 'journal_entries';

    private buildKeywordSearch = (keywordList: string[], join: SearchJoin): SearchClause | undefined => {
        const cleanedKeywordList = keywordList.map((keyword) => keyword.trim()).filter(Boolean);

        if (!cleanedKeywordList.length) {
            return undefined;
        }

        const clause = cleanedKeywordList.map(() => `(${this.SEARCHABLE_COLUMNS.map((column) => `${column} LIKE ?`).join(' OR ')})`).join(` ${join} `);
        const values = cleanedKeywordList.flatMap((keyword) => this.SEARCHABLE_COLUMNS.map(() => `%${keyword}%`));

        return {
            clause: `(${clause})`,
            values
        };
    };

    private buildPageResult = (results: JournalEntriesSchema[], limit: number): JournalEntriesPageResult => {
        const entriesList = results.slice(0, limit);
        const hasMore = results.length > limit;
        const lastEntry = entriesList[entriesList.length - 1];

        return {
            entriesList,
            hasMore,
            nextCursor: hasMore && lastEntry?.entry_id ? {
                entryID: lastEntry.entry_id,
                occurredAt: lastEntry.occurred_at
            } : undefined
        };
    };

    private buildPageCursorSearch = (cursor?: JournalEntriesPageCursor): SearchClause | undefined => {
        if (!cursor) {
            return undefined;
        }

        return {
            clause: '(occurred_at < ? OR (occurred_at = ? AND entry_id < ?))',
            values: [
                cursor.occurredAt,
                cursor.occurredAt,
                cursor.entryID
            ]
        };
    };

    insertJournalEntry = async (userID: UserID, entryDetails: JournalEntry) => {
        const {
            body,
            isHighInterest,
            keywords,
            location,
            occurredAt,
            title
        } = entryDetails;

        const query = 'INSERT INTO ?? (user_id, title, body, keywords, is_high_interest, occurred_at, location) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const values = [
            this.TABLE_NAME,
            userID,
            title,
            body,
            keywords,
            isHighInterest,
            occurredAt,
            location
        ];

        await pool.query(query, values);
    };

    modifyJournalEntry = async (entryID: number, entryDetails: JournalEntry) => {
        const {
            body,
            isHighInterest,
            keywords,
            location,
            occurredAt,
            title
        } = entryDetails;

        const query = 'UPDATE ?? SET title = ?, body = ?, keywords = ?, is_high_interest = ?, occurred_at = ?, location = ? WHERE entry_id = ?';
        const values = [
            this.TABLE_NAME,
            title,
            body,
            keywords,
            isHighInterest,
            occurredAt,
            location,
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

    modifyLocation = async (entryID: number, location: Location) => {
        const query = 'UPDATE ?? SET location = ? WHERE entry_id = ?';
        const values = [
            this.TABLE_NAME,
            location,
            entryID
        ];

        await pool.query(query, values);
    };

    allJournalEntriesByUserID = async (userID: UserID, pageDetails: JournalEntriesPageDetails): Promise<JournalEntriesPageResult> => {
        const {
            cursor,
            limit
        } = pageDetails;

        const whereClauses = [
            'user_id = ?',
            'deleted_at IS NULL'
        ];
        const values: Array<string | number> = [
            this.TABLE_NAME,
            userID
        ];
        const cursorSearchClause = this.buildPageCursorSearch(cursor);

        if (cursorSearchClause) {
            whereClauses.push(cursorSearchClause.clause);
            values.push(...cursorSearchClause.values);
        }

        values.push(limit + 1);

        const query = `SELECT * FROM ?? WHERE ${whereClauses.join(' AND ')} ORDER BY occurred_at DESC, entry_id DESC LIMIT ?`;

        const [
            results = []
        ] = await pool.query<JournalEntriesSchema[] & RowDataPacket[][]>(query, values);

        return this.buildPageResult(results, limit);
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

    journalEntryByKeywords = async (userID: UserID, keywordList: string[], join: SearchJoin): Promise<JournalEntriesSchema[]> => {
        const searchClause = this.buildKeywordSearch(keywordList, join);

        if (!searchClause) {
            return [];
        }

        // Template literal is safe here because the clause is built from hard-coded column names.
        const query = `SELECT * FROM ?? WHERE user_id = ? AND deleted_at IS NULL AND ${searchClause.clause} ORDER BY occurred_at DESC, entry_id DESC`;
        const values = [
            this.TABLE_NAME,
            userID,
            ...searchClause.values
        ];

        const [
            results = []
        ] = await pool.query<JournalEntriesSchema[] & RowDataPacket[][]>(query, values);

        return results;
    };

    searchJournalEntries = async (userID: UserID, searchDetails: JournalEntrySearchDetails, pageDetails: JournalEntriesPageDetails): Promise<JournalEntriesPageResult> => {
        const {
            dateSearchOption,
            entryDate,
            keywordSearchOption,
            searchEndDate,
            searchKeywordsList,
            searchStartDate,
            textKeywordsList
        } = searchDetails;
        const {
            cursor,
            limit
        } = pageDetails;

        const whereClauses = [
            'user_id = ?',
            'deleted_at IS NULL'
        ];
        const values: Array<string | number> = [
            this.TABLE_NAME,
            userID
        ];

        if (dateSearchOption === 'entryDate' && entryDate) {
            whereClauses.push('occurred_at = ?');
            values.push(entryDate);
        }

        if (dateSearchOption === 'dateRange' && searchStartDate && searchEndDate) {
            whereClauses.push('(occurred_at >= ? AND occurred_at <= ?)');
            values.push(searchStartDate, searchEndDate);
        }

        const keywordSearchJoin = keywordSearchOption === 'matchesAll' ? 'AND' : 'OR';
        const keywordSearchClause = keywordSearchOption === 'disabled' ? undefined : this.buildKeywordSearch(searchKeywordsList, keywordSearchJoin);
        const textSearchClause = this.buildKeywordSearch(textKeywordsList, 'OR');
        const cursorSearchClause = this.buildPageCursorSearch(cursor);

        if (keywordSearchClause) {
            whereClauses.push(keywordSearchClause.clause);
            values.push(...keywordSearchClause.values);
        }

        if (textSearchClause) {
            whereClauses.push(textSearchClause.clause);
            values.push(...textSearchClause.values);
        }

        if (cursorSearchClause) {
            whereClauses.push(cursorSearchClause.clause);
            values.push(...cursorSearchClause.values);
        }

        values.push(limit + 1);

        const query = `SELECT * FROM ?? WHERE ${whereClauses.join(' AND ')} ORDER BY occurred_at DESC, entry_id DESC LIMIT ?`;

        const [
            results = []
        ] = await pool.query<JournalEntriesSchema[] & RowDataPacket[][]>(query, values);

        return this.buildPageResult(results, limit);
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
