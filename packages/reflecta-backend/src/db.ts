import {
    Pool,
    createPool
} from 'mysql2/promise';

const pool = (): Pool => {
    const {
        env: {
            DATABASE_HOST = '',
            DATABASE_NAME = '',
            DATABASE_PASSWORD = '',
            DATABASE_PORT = '',
            DATABASE_USER = ''
        }
    } = process;

    return createPool({
        database: DATABASE_NAME,
        host: DATABASE_HOST,
        password: DATABASE_PASSWORD,
        port: parseInt(DATABASE_PORT, 10),
        user: DATABASE_USER
    });
};

export default pool();
