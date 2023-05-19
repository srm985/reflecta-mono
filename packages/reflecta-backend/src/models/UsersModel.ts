import {
    RowDataPacket
} from 'mysql2';

import pool from '../db';

export interface UsersSchema {
    created_at: string;
    email_address: string;
    first_name: string;
    is_active: string;
    last_name: string;
    password: string;
    updated_at: string;
    user_id: string;
}

export interface UserDetails {
    createdAt?: string;
    emailAddress: string;
    firstName: string;
    isActive?: string;
    lastName: string;
    password: string;
    updatedAt?: string;
    userID?: string;
}

class UsersModel {
    private readonly TABLE_NAME = 'users';

    userDetailsByEmailAddress = async (emailAddress: string, isActiveUserOnly: boolean = false): Promise<UserDetails | undefined> => {
        const query = 'SELECT * FROM ?? WHERE email_address = ?';
        const values = [
            this.TABLE_NAME,
            emailAddress,
            isActiveUserOnly
        ];

        const [
            results = []
        ] = await pool.query<UserDetails[] & RowDataPacket[][]>(query, values);

        return results[0];
    };

    isActiveUser = async (emailAddress: string) => {
        const userDetails = await this.userDetailsByEmailAddress(emailAddress, true);

        return !!userDetails;
    };

    addUser = async (userDetails: UserDetails) => {
        const {
            emailAddress,
            firstName,
            lastName,
            password
        } = userDetails;

        const query = 'INSERT INTO ?? (email_address, first_name, last_name, password, is_active) VALUES (?, ?, ?, ?, FALSE)';
        const values = [
            this.TABLE_NAME,
            emailAddress,
            firstName,
            lastName,
            password
        ];

        await pool.query(query, values);
    };
}

export default UsersModel;
