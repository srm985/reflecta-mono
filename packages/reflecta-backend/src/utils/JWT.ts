import jwt, {
    JwtPayload
} from 'jsonwebtoken';

import logger from './logger';

export interface TokenDataDefault {
    [key: string]: string | number | boolean
}
export interface TokenPayload<TokenData> extends JwtPayload {
    data: TokenData
}

const ONE_WEEK_SECONDS = 604_800;

class JWT {
    private readonly DEFAULT_TOKEN_EXPIRATION_SECONDS: number;

    constructor() {
        const {
            env: {
                DEFAULT_TOKEN_EXPIRATION_SECONDS = ''
            }
        } = process;

        this.DEFAULT_TOKEN_EXPIRATION_SECONDS = parseInt(DEFAULT_TOKEN_EXPIRATION_SECONDS, 10) || ONE_WEEK_SECONDS;
    }

    generateToken = (payload: TokenDataDefault, secretKey: string, expirationTimeSeconds?: number): string | undefined => {
        const tokenExpirationTime = Math.floor(Date.now() / 1000) + (expirationTimeSeconds || this.DEFAULT_TOKEN_EXPIRATION_SECONDS);

        try {
            return jwt.sign({
                data: payload,
                exp: tokenExpirationTime
            }, secretKey);
        } catch (error) {
            logger.error(error);
        }

        return undefined;
    };

    decodeToken = <TokenData>(token: string, secretKey: string): TokenPayload<TokenData> | string | undefined => {
        try {
            return jwt.verify(token, secretKey) as TokenPayload<TokenData>;
        } catch (error) {
            logger.error(error);
        }

        return undefined;
    };

    isTokenValid = (token: string, secretKey: string): boolean => {
        const tokenDetails = this.decodeToken(token, secretKey);

        return !!tokenDetails;
    };
}

export default JWT;
