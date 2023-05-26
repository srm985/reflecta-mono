import {
    RowDataPacket
} from 'mysql2';

import pool from '../db';

export interface AuthenticationTokensSchema {
    authentication_token: string;
    created_at: string;
    is_active: string;
    token_id?: string;
    updated_at: string | null;
    user_id: number;
}

export interface AuthenticationToken {
    authenticationToken: string;
    createdAt: string;
    isActive: string;
    tokenID?: string;
    updatedAt: string | null;
    userID: number;
}

class AuthenticationTokensModel {
    private readonly TABLE_NAME = 'authentication_tokens';

    insertAuthenticationToken = async (userID: number, authenticationToken: string): Promise<boolean> => {
        const query = 'INSERT INTO ?? (user_id, authentication_token, is_active) VALUES (?, ?, TRUE)';
        const values = [
            this.TABLE_NAME,
            userID,
            authenticationToken
        ];

        const [
            results = []
        ] = await pool.query<AuthenticationTokensSchema[] & RowDataPacket[][]>(query, values);

        if (results.length) {
            return true;
        }

        return false;
    };

    isAuthenticationTokenValid = async (authenticationToken: string): Promise<boolean> => {
        const query = 'SELECT authentication_token FROM ?? WHERE authentication_token = ? AND is_active = TRUE';
        const values = [
            this.TABLE_NAME,
            authenticationToken
        ];

        const [
            results = []
        ] = await pool.query<AuthenticationTokensSchema[] & RowDataPacket[][]>(query, values);

        if (results.length) {
            return true;
        }

        return false;
    };

    invalidateAuthenticationToken = async (authenticationToken: string) => {
        const query = 'UPDATE ?? SET is_active = FALSE WHERE authentication_token = ?';
        const values = [
            this.TABLE_NAME,
            authenticationToken
        ];

        return pool.query(query, values);
    };
}

export default AuthenticationTokensModel;
