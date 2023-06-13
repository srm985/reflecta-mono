import {
    RowDataPacket
} from 'mysql2';

import pool from '../db';

export interface EnrollmentTokensSchema {
    created_at: string;
    is_active: string;
    token_id: string;
    updated_at: string | null;
    user_id: number;
}

export interface EnrollmentToken {
    createdAt: string;
    isActive: string;
    tokenID: string;
    updatedAt: string | null;
    userID: number;
}

class EnrollmentTokensModel {
    private readonly TABLE_NAME = 'enrollment_tokens';

    insertEnrollmentToken = async (userID: number, tokenID: string) => {
        const query = 'INSERT INTO ?? (user_id, token_id, is_active) VALUES (?, ?, TRUE) ON DUPLICATE KEY UPDATE token_id = VALUES(token_id), is_active = TRUE';
        const values = [
            this.TABLE_NAME,
            userID,
            tokenID
        ];

        await pool.query(query, values);
    };

    enrollmentTokenByUserID = async (userID: number): Promise<EnrollmentTokensSchema | undefined> => {
        const query = 'SELECT * FROM ?? WHERE user_id = ? AND is_active = TRUE';
        const values = [
            this.TABLE_NAME,
            userID
        ];

        const [
            [
                tokenDetails
            ] = []
        ] = await pool.query<EnrollmentTokensSchema[] & RowDataPacket[][]>(query, values);

        return tokenDetails;
    };

    invalidateEnrollmentToken = async (tokenID: string) => {
        const query = 'UPDATE ?? SET is_active = FALSE WHERE token_id = ?';
        const values = [
            this.TABLE_NAME,
            tokenID
        ];

        return pool.query(query, values);
    };
}

export default EnrollmentTokensModel;
