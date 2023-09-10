import {
    NextFunction,
    Request,
    Response
} from 'express';

import {
    AuthenticationTokenPayload
} from '@controllers/AuthenticationController';

import AuthenticationTokensModel from '@models/AuthenticationTokensModel';

import CustomError from '@utils/CustomError';
import errorResponseHandler from '@utils/errorResponseHandler';
import JWT from '@utils/JWT';
import TokenHandler from '@utils/TokenHandler';

class Authentication {
    private readonly authenticationTokensModel: AuthenticationTokensModel;

    private readonly jwt: JWT;

    private readonly tokenHandler: TokenHandler;

    private readonly COOKIE_STORAGE_NAME: string;

    constructor() {
        const {
            env: {
                COOKIE_STORAGE_NAME = ''
            }
        } = process;

        this.authenticationTokensModel = new AuthenticationTokensModel();

        this.jwt = new JWT();
        this.tokenHandler = new TokenHandler();

        this.COOKIE_STORAGE_NAME = COOKIE_STORAGE_NAME;
    }

    private constructToken = (request: Request): string | undefined => {
        const {
            headers: {
                authorization = ''
            } = {}
        } = request || {};

        const TOKEN_REGEX = /^(Bearer\s)|(Token:\s)/;

        const tokenSignature = authorization.replace(TOKEN_REGEX, '');

        const {
            cookies: {
                [this.COOKIE_STORAGE_NAME]: tokenHeaderPayload
            } = {}
        } = request;

        if (tokenHeaderPayload && tokenSignature) {
            return this.tokenHandler.combine(tokenHeaderPayload, tokenSignature);
        }

        return undefined;
    };

    required = async (request: Request, response: Response, next: NextFunction): Promise<Response | void> => {
        const {
            env: {
                JWT_SECRET_KEY_AUTHENTICATION_TOKEN = ''
            }
        } = process;

        try {
            const authenticationToken = this.constructToken(request);

            if (!authenticationToken) {
                throw new CustomError({
                    privateMessage: 'No authentication token generated from request...',
                    statusCode: 401
                });
            }

            const providedTokenDetails = this.jwt.decodeToken<AuthenticationTokenPayload>(authenticationToken, JWT_SECRET_KEY_AUTHENTICATION_TOKEN);

            // User didn't provided a token or the cryptographic signature is incorrect
            if (!providedTokenDetails) {
                throw new CustomError({
                    privateMessage: `Authentication token: ${authenticationToken} not valid...`,
                    statusCode: 401
                });
            }

            const isTokenValid = await this.authenticationTokensModel.isAuthenticationTokenValid(providedTokenDetails.jti);

            if (!isTokenValid) {
                throw new CustomError({
                    privateMessage: `Authentication token: ${authenticationToken} not found or no longer valid...`,
                    statusCode: 401
                });
            }

            // Stash the token payload for use in subsequent middlewares.
            response.locals.authenticationTokenPayload = providedTokenDetails.data;

            return next();
        } catch (error) {
            return errorResponseHandler(error, response);
        }
    };
}

export default Authentication;
