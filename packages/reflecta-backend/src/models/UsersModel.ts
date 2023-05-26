import {
    OkPacket,
    RowDataPacket
} from 'mysql2';

import pool from '../db';

export interface UsersSchema {
    created_at: string;
    email_address: string;
    first_name: string;
    is_active: boolean;
    is_admin: boolean;
    last_name: string;
    password: string;
    updated_at: string | null;
    user_id: number;
}

export interface UserDetails {
    createdAt?: string;
    emailAddress: string;
    firstName: string;
    isActive?: boolean;
    isAdmin?: boolean;
    lastName: string;
    password: string;
    updatedAt?: string | null;
    userID?: number;
}

class UsersModel {
    private readonly TABLE_NAME = 'users';

    userDetailsByEmailAddress = async (emailAddress: string, isActiveUserOnly: boolean = false): Promise<UsersSchema | undefined> => {
        const query = 'SELECT * FROM ?? WHERE email_address = ?';
        const values = [
            this.TABLE_NAME,
            emailAddress,
            isActiveUserOnly
        ];

        const [
            results = []
        ] = await pool.query<UsersSchema[] & RowDataPacket[][]>(query, values);

        return results[0];
    };

    isActiveUser = async (emailAddress: string) => {
        const userDetails = await this.userDetailsByEmailAddress(emailAddress, true);

        return !!userDetails;
    };

    activateUser = async (userID: number) => {
        const query = 'UPDATE ?? SET is_active = TRUE WHERE user_id = ?';
        const values = [
            this.TABLE_NAME,
            userID
        ];

        await pool.query(query, values);
    };

    addUser = async (userDetails: UserDetails): Promise<number | undefined> => {
        const {
            emailAddress,
            firstName,
            lastName,
            password
        } = userDetails;

        const query1 = 'INSERT INTO ?? (email_address, first_name, last_name, password, is_active) VALUES (?, ?, ?, ?, FALSE)';
        const values1 = [
            this.TABLE_NAME,
            emailAddress,
            firstName,
            lastName,
            password
        ];

        await pool.query<OkPacket>(query1, values1);

        const query2 = 'SELECT user_id as userID FROM ?? WHERE email_address = ?';
        const values2 = [
            this.TABLE_NAME,
            emailAddress
        ];

        const [
            [
                {
                    userID
                }
            ] = []
        ] = await pool.query<UserDetails[] & RowDataPacket[][]>(query2, values2);

        return userID;
    };

    updatePassword = async (userID: number, password: string) => {
        const query = 'UPDATE ?? SET password = ? WHERE user_id = ?';
        const values = [
            this.TABLE_NAME,
            password,
            userID
        ];

        await pool.query<OkPacket>(query, values);
    };
}

export default UsersModel;
