import UsersModel from '../models/UsersModel';

import CustomError from '../utils/CustomError';

class AuthenticationController {
    private readonly usersModel: UsersModel;

    constructor() {
        this.usersModel = new UsersModel();
    }

    login = async (emailAddress: string, password: string) => {
        const userDetails = await this.usersModel.userDetailsByEmailAddress(emailAddress);

        // Our user needs to exist to log in
        if (!userDetails) {
            throw new CustomError({
                privateMessage: `User not active with email address: ${emailAddress}`,
                statusCode: 404
            });
        }

        console.log(password.slice(0, 1));
    };
}

export default AuthenticationController;
