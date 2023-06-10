export interface SplitToken {
    tokenHeaderPayload: string
    tokenSignature: string
}

class TokenHandler {
    combine = (tokenHeaderPayload: string, tokenSignature: string): string => `${tokenHeaderPayload}.${tokenSignature}`;

    split = (authenticationToken: string): SplitToken => {
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

export default TokenHandler;
