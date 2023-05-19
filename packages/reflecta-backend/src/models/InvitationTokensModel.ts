import {
    RowDataPacket
} from 'mysql2';

import pool from '../db';

export interface InvitationTokensSchema {
    created_at: string;
    email_address: string;
    invitation_token: string;
    is_active: string;
    updated_at: string;
}

export interface InvitationToken {
    createdAt: string;
    emailAddress: string;
    invitationToken: string;
    isActive: string;
    updatedAt: string;
}

class InvitationTokensModel {
    private readonly TABLE_NAME = 'invitation_tokens';

    insertInvitationToken = async (emailAddress: string, invitationToken: string): Promise<boolean> => {
        const query = 'INSERT INTO ?? (email_address, invitation_token, is_active) VALUES (?, ?, TRUE) ON DUPLICATE KEY UPDATE invitation_token=VALUES(invitation_token), is_active=true';
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

    isInvitationTokenValid = async (invitationToken: string, emailAddress: string): Promise<boolean> => {
        const query = 'SELECT invitation_token as invitationToken FROM ?? WHERE invitation_token = ? AND email_address = ?';
        const values = [
            this.TABLE_NAME,
            invitationToken,
            emailAddress
        ];

        const [
            results = []
        ] = await pool.query<InvitationTokensSchema[] & RowDataPacket[][]>(query, values);

        if (results.length) {
            return true;
        }

        return false;
    };

    invalidateInvitationToken = async (invitationToken: string) => {
        const query = 'UPDATE TABLE ?? SET is_active = FALSE WHERE invitation_token = ?';
        const values = [
            this.TABLE_NAME,
            invitationToken
        ];

        return pool.query(query, values);
    };
}

export default InvitationTokensModel;
