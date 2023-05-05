import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import {
    AddressInfo
} from 'net';

import middleware from './middleware';

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

// Start Server
const server = app.listen(SERVER_PORT || 3100, () => {
    // eslint-disable-next-line no-console
    console.log(`Server started on port: ${(server.address() as AddressInfo).port}...`);
});
