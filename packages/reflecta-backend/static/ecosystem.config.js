require('dotenv').config();

module.exports = {
    apps: [
        {
            env: {
                CORS_ORIGIN: process.env.CORS_ORIGIN,
                DATABASE_HOST: process.env.DATABASE_HOST,
                DATABASE_NAME: process.env.DATABASE_NAME,
                DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
                DATABASE_PORT: process.env.DATABASE_PORT,
                DATABASE_USER: process.env.DATABASE_USER,
                LOGGING_DIRECTORY: process.env.LOGGING_DIRECTORY,
                LOGGING_FILE_NAME: process.env.LOGGING_FILE_NAME,
                NODE_ENV: process.env.NODE_ENV,
                SERVER_PORT: process.env.SERVER_PORT
            },
            name: 'reflecta-backend',
            node_args: [
                '--experimental-specifier-resolution=node'
            ],
            script: '/var/www/api/app.js | node --input-type=module'
        }
    ]
};
