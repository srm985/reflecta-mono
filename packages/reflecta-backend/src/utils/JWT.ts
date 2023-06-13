import jwt, {
    JwtPayload
} from 'jsonwebtoken';

import logger from '@utils/logger';

export interface TokenDataDefault {
    [key: string]: string | number | boolean
}
export interface TokenPayload<TokenData> extends JwtPayload {
    data: TokenData,
    exp: number;
    jti: string;
}

export interface GenerateToken {
    expirationTimeMinutes?: number | string;
    payload?: TokenDataDefault;
    secretKey: string;
    tokenID: string;
}

const ONE_WEEK_SECONDS = 604_800;

class JWT {
    private readonly JWT_EXPIRATION_MINUTES_DEFAULT: number;

    constructor() {
        const {
            env: {
                JWT_EXPIRATION_MINUTES_DEFAULT = ''
            }
        } = process;

        this.JWT_EXPIRATION_MINUTES_DEFAULT = parseInt(JWT_EXPIRATION_MINUTES_DEFAULT, 10) || ONE_WEEK_SECONDS;
    }

    generateToken = ({
        expirationTimeMinutes = '',
        payload = {},
        secretKey,
        tokenID
    }: GenerateToken): string | undefined => {
        try {
            const expiresIn: number = (typeof expirationTimeMinutes === 'number' ? expirationTimeMinutes : parseInt(expirationTimeMinutes, 10) || this.JWT_EXPIRATION_MINUTES_DEFAULT) * 60;

            return jwt.sign({
                data: payload
            }, secretKey, {
                expiresIn,
                jwtid: tokenID
            });
        } catch (error) {
            logger.error(error);
        }

        return undefined;
    };

    decodeToken = <TokenData>(token: string, secretKey: string): TokenPayload<TokenData> | undefined => {
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
