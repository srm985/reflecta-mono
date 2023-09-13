import AuthenticationTokensModel from '@models/AuthenticationTokensModel';
import UsersModel from '@models/UsersModel';

import CustomError from '@utils/CustomError';
import generateRandom from '@utils/generateRandom';
import JWT from '@utils/JWT';
import Secret from '@utils/Secret';
import TokenHandler from '@utils/TokenHandler';

import {
    UserID
} from '@types';

export interface AuthenticationTokenPayload {
    emailAddress: string;
    firstName: string;
    isAdmin: boolean;
    lastName: string;
    userID: UserID
}
export interface AuthenticationTokenPayloadLocals {
    authenticationTokenPayload: AuthenticationTokenPayload
}

export interface AuthenticationToken {
    tokenHeaderPayload: string;
    tokenSignature: string;
}

export interface GenerateTokenResponse {
    authenticationToken: string;
    tokenID: string;
}

class AuthenticationController {
    private readonly authenticationTokensModel: AuthenticationTokensModel;

    private readonly usersModel: UsersModel;

    private readonly jwt: JWT;

    private readonly secret: Secret;

    private readonly tokenHandler: TokenHandler;

    constructor() {
        this.authenticationTokensModel = new AuthenticationTokensModel();
        this.usersModel = new UsersModel();

        this.jwt = new JWT();
        this.secret = new Secret();
        this.tokenHandler = new TokenHandler();
    }

    private generateToken = (authenticationTokenPayload: AuthenticationTokenPayload): GenerateTokenResponse => {
        const {
            env: {
                JWT_EXPIRATION_MINUTES_AUTHENTICATION_TOKEN = '',
                JWT_SECRET_KEY_AUTHENTICATION_TOKEN = ''
            }
        } = process;

        const {
            emailAddress,
            firstName,
            isAdmin,
            lastName,
            userID
        } = authenticationTokenPayload;

        const tokenID = generateRandom();

        const authenticationToken = this.jwt.generateToken({
            expirationTimeMinutes: JWT_EXPIRATION_MINUTES_AUTHENTICATION_TOKEN,
            payload: {
                emailAddress,
                firstName,
                isAdmin,
                lastName,
                userID
            },
            secretKey: JWT_SECRET_KEY_AUTHENTICATION_TOKEN,
            tokenID
        });

        if (!authenticationToken) {
            throw new CustomError({
                privateMessage: `Unable to generate authentication token for user ID: ${userID}...`,
                statusCode: 500
            });
        }

        return ({
            authenticationToken,
            tokenID
        });
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

        const {
            authenticationToken, tokenID
        } = this.generateToken({
            emailAddress,
            firstName,
            isAdmin,
            lastName,
            userID
        });

        // Save our token ID to the authentication table
        await this.authenticationTokensModel.insertAuthenticationToken(userID, tokenID);

        return this.tokenHandler.split(authenticationToken);
    };
}

export default AuthenticationController;
