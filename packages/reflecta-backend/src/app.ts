import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import {
    AddressInfo
} from 'net';

import middleware from './middleware';

import logger from './logger';

import establishPool from './db';

// Initialize App
const app = express();

const {
    env: {
        SERVER_PORT
    }
} = process;

// App Configurations
app.disable('x-powered-by');
app.use(cors({
    credentials: true,
    methods: [
        'DELETE',
        'GET',
        'POST',
        'PUT'
    ]
}));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
// app.use(express.urlencoded({
//     extended: false
// }));
app.use(middleware);

console.log('foo12');

// Start Server
const server = app.listen(SERVER_PORT || 3100, async () => {
    const {
        env: {
            DATABASE_HOST = '',
            DATABASE_NAME = '',
            DATABASE_PORT = '',
            DATABASE_USER = ''
        }
    } = process;

    // eslint-disable-next-line no-console
    logger.info(`server started on port: ${(server.address() as AddressInfo).port}...`);

    try {
        const connection = await establishPool().getConnection();

        logger.info('database connection established...');

        connection.release();
    } catch (error) {
        logger.error(`unable to connect to database ${DATABASE_NAME} located at ${DATABASE_HOST}:${DATABASE_PORT} with user ${DATABASE_USER}...`);
    }
});
