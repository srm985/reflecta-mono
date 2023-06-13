import {
    RowDataPacket
} from 'mysql2';

import pool from '../db';

export interface InvitationTokensSchema {
    created_at: string;
    email_address: string;
    is_active: string;
    token_id: string;
    updated_at: string;
}

export interface InvitationToken {
    createdAt: string;
    emailAddress: string;
    isActive: string;
    tokenID: string;
    updatedAt: string;
}

class InvitationTokensModel {
    private readonly TABLE_NAME = 'invitation_tokens';

    insertInvitationToken = async (emailAddress: string, invitationToken: string): Promise<boolean> => {
        const query = 'INSERT INTO ?? (email_address, token_id, is_active) VALUES (?, ?, TRUE) ON DUPLICATE KEY UPDATE token_id = VALUES(token_id), is_active = TRUE';
        const values = [
            this.TABLE_NAME,
            emailAddress,
            invitationToken
        ];

        const [
            results = []
        ] = await pool.query<InvitationTokensSchema[] & RowDataPacket[][]>(query, values);

        if (results.length) {
            return true;
        }

        return false;
    };

    invitationTokenByEmail = async (emailAddress: string): Promise<InvitationTokensSchema | undefined> => {
        const query = 'SELECT * FROM ?? WHERE email_address = ? AND is_active = TRUE';
        const values = [
            this.TABLE_NAME,
            emailAddress
        ];

        const [
            [
                tokenDetails
            ] = []
        ] = await pool.query<InvitationTokensSchema[] & RowDataPacket[][]>(query, values);

        return tokenDetails;
    };

    invitationTokenByID = async (tokenID: string): Promise<InvitationTokensSchema | undefined> => {
        const query = 'SELECT * FROM ?? WHERE token_id = ? AND is_active = TRUE';
        const values = [
            this.TABLE_NAME,
            tokenID
        ];

        const [
            [
                tokenDetails
            ] = []
        ] = await pool.query<InvitationTokensSchema[] & RowDataPacket[][]>(query, values);

        return tokenDetails;
    };

    invalidateInvitationToken = async (tokenID: string) => {
        const query = 'UPDATE ?? SET is_active = FALSE WHERE token_id = ?';
        const values = [
            this.TABLE_NAME,
            tokenID
        ];

        return pool.query(query, values);
    };
}

export default InvitationTokensModel;
