import AuthenticationTokensModel from '../models/AuthenticationTokensModel';
import UsersModel from '../models/UsersModel';

import CustomError from '../utils/CustomError';
import JWT from '../utils/JWT';
import Secret from '../utils/Secret';

export interface AuthenticationTokenPayload {
    emailAddress: string;
    firstName: string;
    isAdmin: boolean;
    lastName: string;
    userID: number
}

export interface AuthenticationToken {
    tokenHeaderPayload: string;
    tokenSignature: string;
}

class AuthenticationController {
    private readonly authenticationTokensModel: AuthenticationTokensModel;

    private readonly usersModel: UsersModel;

    private readonly jwt: JWT;

    private readonly secret: Secret;

    constructor() {
        this.authenticationTokensModel = new AuthenticationTokensModel();
        this.usersModel = new UsersModel();

        this.jwt = new JWT();
        this.secret = new Secret();
    }

    private generateToken = async (authenticationTokenPayload: AuthenticationTokenPayload): Promise<string> => {
        const {
            env: {
                JWT_SECRET_KEY_LOGIN_TOKEN = ''
            }
        } = process;

        const {
            emailAddress,
            firstName,
            isAdmin,
            lastName,
            userID
        } = authenticationTokenPayload;

        const authenticationToken = this.jwt.generateToken({
            emailAddress,
            firstName,
            isAdmin,
            lastName,
            userID
        }, JWT_SECRET_KEY_LOGIN_TOKEN);

        if (!authenticationToken) {
            throw new CustomError({
                privateMessage: `Unable to generate authentication token for user ID: ${userID}...`,
                statusCode: 500
            });
        }

        await this.authenticationTokensModel.insertAuthenticationToken(userID, authenticationToken);

        return authenticationToken;
    };

    login = async (emailAddress: string, inputtedPassword: string): Promise<AuthenticationToken> => {
        const userDetails = await this.usersModel.userDetailsByEmailAddress(emailAddress);

        // Our user needs to exist to log in but we just return 401 as to not give away any details
        if (!userDetails) {
            throw new CustomError({
                privateMessage: `User not active with email address: ${emailAddress}...`,
                statusCode: 401
            });
        }

        const {
            first_name: firstName,
            is_admin: isAdmin,
            last_name: lastName,
            password: hashedPassword,
            user_id: userID
        } = userDetails;

        const doPasswordsMatch = await this.secret.doSecretsMatch(inputtedPassword, hashedPassword);

        if (!doPasswordsMatch) {
            throw new CustomError({
                privateMessage: `Incorrect password for user ID: ${userID}...`,
                statusCode: 401
            });
        }

        // We might have updated salt rounds so we rehash the password to keep it up to date
        const rehashedPassword = await this.secret.hash(inputtedPassword);

        await this.usersModel.updatePassword(userID, rehashedPassword);

        const authenticationToken = await this.generateToken({
            emailAddress,
            firstName,
            isAdmin,
            lastName,
            userID
        });

        const [
            header,
            payload,
            tokenSignature
        ] = authenticationToken.split('.');

        return ({
            tokenHeaderPayload: `${header}.${payload}`,
            tokenSignature
        });
    };
}

export default AuthenticationController;
