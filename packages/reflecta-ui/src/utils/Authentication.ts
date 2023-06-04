import Storage from '@utils/Storage';

class Authentication {
    private readonly storage: Storage;

    private readonly LOCAL_STORAGE_AUTHENTICATION_TOKEN_KEY: string;

    constructor() {
        const {
            env: {
                LOCAL_STORAGE_AUTHENTICATION_TOKEN_KEY = ''
            }
        } = process;

        this.storage = new Storage();

        this.LOCAL_STORAGE_AUTHENTICATION_TOKEN_KEY = LOCAL_STORAGE_AUTHENTICATION_TOKEN_KEY;
    }

    authenticate = (token: string) => {
        this.storage.writeKeyLocal(this.LOCAL_STORAGE_AUTHENTICATION_TOKEN_KEY, token);
    };

    deAuthenticate = () => {
        this.storage.clearKeyLocal(this.LOCAL_STORAGE_AUTHENTICATION_TOKEN_KEY);
    };

    isAuthenticated = (): boolean => {
        const token = this.storage.readKeyLocal<string>(this.LOCAL_STORAGE_AUTHENTICATION_TOKEN_KEY);

        return !!token;
    };
}

export default Authentication;
