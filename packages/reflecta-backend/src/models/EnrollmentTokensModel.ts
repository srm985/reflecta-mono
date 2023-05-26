import {
    RowDataPacket
} from 'mysql2';

import pool from '../db';

export interface EnrollmentTokensSchema {
    created_at: string;
    enrollment_token: string;
    is_active: string;
    updated_at: string | null;
    user_id: number;
}

export interface EnrollmentToken {
    createdAt: string;
    enrollmentToken: string;
    isActive: string;
    updatedAt: string | null;
    userID: number;
}

class EnrollmentTokensModel {
    private readonly TABLE_NAME = 'enrollment_tokens';

    insertEnrollmentToken = async (userID: number, enrollmentToken: string): Promise<boolean> => {
        const query = 'INSERT INTO ?? (user_id, enrollment_token, is_active) VALUES (?, ?, TRUE) ON DUPLICATE KEY UPDATE enrollment_token=VALUES(enrollment_token), is_active=true';
        const values = [
            this.TABLE_NAME,
            userID,
            enrollmentToken
        ];

        const [
            results = []
        ] = await pool.query<EnrollmentTokensSchema[] & RowDataPacket[][]>(query, values);

        if (results.length) {
            return true;
        }

        return false;
    };

    isEnrollmentTokenValid = async (enrollmentToken: string): Promise<boolean> => {
        const query = 'SELECT enrollment_token FROM ?? WHERE enrollment_token = ? AND is_active = TRUE';
        const values = [
            this.TABLE_NAME,
            enrollmentToken
        ];

        const [
            results = []
        ] = await pool.query<EnrollmentTokensSchema[] & RowDataPacket[][]>(query, values);

        if (results.length) {
            return true;
        }

        return false;
    };

    invalidateEnrollmentToken = async (enrollmentToken: string) => {
        const query = 'UPDATE ?? SET is_active = FALSE WHERE enrollment_token = ?';
        const values = [
            this.TABLE_NAME,
            enrollmentToken
        ];

        return pool.query(query, values);
    };
}

export default EnrollmentTokensModel;
