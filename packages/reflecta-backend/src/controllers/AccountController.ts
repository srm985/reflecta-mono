import UsersModel, {
    UserDetails
} from '@models/UsersModel';

import CustomError from '@utils/CustomError';

import {
    UserID
} from '@types';

export type UserDetailsResponse = Pick<UserDetails, 'firstName' | 'lastName' | 'emailAddress' | 'password'>;

class AccountController {
    private readonly usersModel: UsersModel;

    constructor() {
        this.usersModel = new UsersModel();
    }

    public getDetails = async (userID: UserID): Promise<UserDetailsResponse> => {
        const userDetails = await this.usersModel.userDetailsByID(userID);

        if (!userDetails) {
            throw new CustomError({
                privateMessage: `Unable to find details for user ID: ${userID}...`,
                statusCode: 500
            });
        }

        const [
            address,
            domain
        ] = userDetails.email_address.split('@');

        const addressCharacterMap = address.split('');

        const addressVisible = addressCharacterMap.splice(0, 3);

        return ({
            emailAddress: `${addressVisible.join('')}${addressCharacterMap.join('').replace(/./g, '•')}@${domain}`,
            firstName: userDetails.first_name,
            lastName: userDetails.last_name,
            password: '••••••••••'
        });
    };
}

export default AccountController;
