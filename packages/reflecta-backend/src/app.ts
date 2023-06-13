import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, {
    Application
} from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import {
    AddressInfo
} from 'net';

import logger from '@utils/logger';

import middleware from '@middleware/index';

import pool from './db';

// Initialize App
const app: Application = express();

const {
    env: {
        BASE_URL_APPLICATION,
        SERVER_PORT
    }
} = process;

// App Configurations
app.disable('x-powered-by');
app.use(cookieParser());
app.use(cors({
    credentials: true,
    methods: [
        'DELETE',
        'GET',
        'POST',
        'PUT'
    ],
    origin: BASE_URL_APPLICATION
}));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
// app.use(express.urlencoded({
//     extended: false
// }));
app.use(middleware);

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

    try {
        // eslint-disable-next-line no-console
        logger.info(`server started on port: ${(server.address() as AddressInfo).port}...`);

        const connection = await pool.getConnection();

        logger.info('database connection established...');

        connection.release();
    } catch (error) {
        logger.error(`unable to connect to database ${DATABASE_NAME} located at ${DATABASE_HOST}:${DATABASE_PORT} with user ${DATABASE_USER}...`);
    }
});
