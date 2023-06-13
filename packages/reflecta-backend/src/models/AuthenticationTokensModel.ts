import {
    RowDataPacket
} from 'mysql2';

import pool from '../db';

export interface AuthenticationTokensSchema {
    created_at: string;
    is_active: string;
    token_id: string;
    updated_at: string | null;
    user_id: number;
}

export interface AuthenticationToken {
    createdAt: string;
    isActive: string;
    tokenID: string;
    updatedAt: string | null;
    userID: number;
}

class AuthenticationTokensModel {
    private readonly TABLE_NAME = 'authentication_tokens';

    insertAuthenticationToken = async (userID: number, tokenID: string): Promise<boolean> => {
        const query = 'INSERT INTO ?? (user_id, token_id, is_active) VALUES (?, ?, TRUE)';
        const values = [
            this.TABLE_NAME,
            userID,
            tokenID
        ];

        const [
            results = []
        ] = await pool.query<AuthenticationTokensSchema[] & RowDataPacket[][]>(query, values);

        if (results.length) {
            return true;
        }

        return false;
    };

    isAuthenticationTokenValid = async (tokenID: string): Promise<boolean> => {
        const query = 'SELECT authentication_token FROM ?? WHERE token_id = ? AND is_active = TRUE';
        const values = [
            this.TABLE_NAME,
            tokenID
        ];

        const [
            results = []
        ] = await pool.query<AuthenticationTokensSchema[] & RowDataPacket[][]>(query, values);

        if (results.length) {
            return true;
        }

        return false;
    };

    invalidateAuthenticationToken = async (tokenID: string) => {
        const query = 'UPDATE ?? SET is_active = FALSE WHERE token_id = ?';
        const values = [
            this.TABLE_NAME,
            tokenID
        ];

        return pool.query(query, values);
    };
}

export default AuthenticationTokensModel;
