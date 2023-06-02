import bcrypt from 'bcrypt';

class Secret {
    private readonly SALT_ROUNDS_DEFAULT: number;

    constructor() {
        const {
            env: {
                SALT_ROUNDS_DEFAULT = '14'
            }
        } = process;

        this.SALT_ROUNDS_DEFAULT = parseInt(SALT_ROUNDS_DEFAULT, 10);
    }

    hash = async (plainText: string, saltRounds: number = this.SALT_ROUNDS_DEFAULT) => bcrypt.hash(plainText, saltRounds);

    doSecretsMatch = async (plainText: string, secret: string) => bcrypt.compare(plainText, secret);
}

export default Secret;
