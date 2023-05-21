import bcrypt from 'bcrypt';

class Secret {
    private readonly SALT_ROUNDS: number;

    constructor() {
        const {
            env: {
                SALT_ROUNDS = '14'
            }
        } = process;

        this.SALT_ROUNDS = parseInt(SALT_ROUNDS, 10);
    }

    hash = async (plainText: string) => bcrypt.hash(plainText, this.SALT_ROUNDS);

    doSecretsMatch = async (plainText: string, secret: string) => bcrypt.compare(plainText, secret);
}

export default Secret;
