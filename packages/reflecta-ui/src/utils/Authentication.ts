import Storage from '@utils/Storage';

import {
    LOCAL_STORAGE_AUTHENTICATION_TOKEN_KEY
} from '@constants';

class Authentication {
    private readonly storage: Storage;

    constructor() {
        this.storage = new Storage();
    }

    authenticate = (token: string) => {
        this.storage.writeKeyLocal(LOCAL_STORAGE_AUTHENTICATION_TOKEN_KEY, token);
    };

    deAuthenticate = () => {
        this.storage.clearKeyLocal(LOCAL_STORAGE_AUTHENTICATION_TOKEN_KEY);
    };

    retrieve = (): string | undefined => {
        const token = this.storage.readKeyLocal<string>(LOCAL_STORAGE_AUTHENTICATION_TOKEN_KEY);

        return token;
    };

    isAuthenticated = (): boolean => {
        const token = this.retrieve();

        return !!token;
    };
}

export default Authentication;
