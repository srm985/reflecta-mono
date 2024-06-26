require('dotenv').config();

module.exports = {
    apps: [
        {
            env: {
                BASE_URL_API: process.env.BASE_URL_API,
                BASE_URL_APPLICATION: process.env.BASE_URL_APPLICATION,
                COOKIE_DOMAIN: process.env.COOKIE_DOMAIN,
                COOKIE_EXPIRATION_MINUTES: process.env.COOKIE_EXPIRATION_MINUTES,
                COOKIE_SAME_SITE_CONFIG: process.env.COOKIE_SAME_SITE_CONFIG,
                COOKIE_STORAGE_NAME: process.env.COOKIE_STORAGE_NAME,
                DATABASE_HOST: process.env.DATABASE_HOST,
                DATABASE_NAME: process.env.DATABASE_NAME,
                DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
                DATABASE_PORT: process.env.DATABASE_PORT,
                DATABASE_USER: process.env.DATABASE_USER,
                GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
                JOURNAL_ENTRY_MINIMUM_BODY_WORDS_FOR_TITLE: process.env.JOURNAL_ENTRY_MINIMUM_BODY_WORDS_FOR_TITLE,
                JWT_EXPIRATION_MINUTES_AUTHENTICATION_TOKEN: process.env.JWT_EXPIRATION_MINUTES_AUTHENTICATION_TOKEN,
                JWT_EXPIRATION_MINUTES_DEFAULT: process.env.JWT_EXPIRATION_MINUTES_DEFAULT,
                JWT_EXPIRATION_MINUTES_ENROLLMENT_TOKEN: process.env.JWT_EXPIRATION_MINUTES_ENROLLMENT_TOKEN,
                JWT_EXPIRATION_MINUTES_INVITATION_TOKEN: process.env.JWT_EXPIRATION_MINUTES_INVITATION_TOKEN,
                JWT_SECRET_KEY_AUTHENTICATION_TOKEN: process.env.JWT_SECRET_KEY_AUTHENTICATION_TOKEN,
                JWT_SECRET_KEY_ENROLLMENT_TOKEN: process.env.JWT_SECRET_KEY_ENROLLMENT_TOKEN,
                JWT_SECRET_KEY_INVITATION_TOKEN: process.env.JWT_SECRET_KEY_INVITATION_TOKEN,
                LOGGING_DIRECTORY: process.env.LOGGING_DIRECTORY,
                LOGGING_FILE_NAME: process.env.LOGGING_FILE_NAME,
                NODE_ENV: process.env.NODE_ENV,
                OPENAI_API_KEY: process.env.OPENAI_API_KEY,
                OPENAI_MODEL: process.env.OPENAI_MODEL,
                OPENAI_PROMPT_EVALUATION: process.env.OPENAI_PROMPT_EVALUATION,
                OPENAI_PROMPT_KEYWORDS: process.env.OPENAI_PROMPT_KEYWORDS,
                OPENAI_PROMPT_KEYWORDS_EXPANSION: process.env.OPENAI_PROMPT_KEYWORDS_EXPANSION,
                OPENAI_PROMPT_TITLE: process.env.OPENAI_PROMPT_TITLE,
                RATE_LIMITER_PERMITTED_TRIES: process.env.RATE_LIMITER_PERMITTED_TRIES,
                RATE_LIMITER_TIMEOUT_MS: process.env.RATE_LIMITER_TIMEOUT_MS,
                ROUTE_GOOGLE_MAPS: process.env.ROUTE_GOOGLE_MAPS,
                SALT_ROUNDS_CREDENTIALS: process.env.SALT_ROUNDS_CREDENTIALS,
                SALT_ROUNDS_DEFAULT: process.env.SALT_ROUNDS_DEFAULT,
                SALT_ROUNDS_TOKEN: process.env.SALT_ROUNDS_TOKEN,
                SEND_GRID_DEFAULT_FROM_ACCOUNT: process.env.SEND_GRID_DEFAULT_FROM_ACCOUNT,
                SEND_GRID_TEMPLATE_ID_EMAIL_CONFIRMATION: process.env.SEND_GRID_TEMPLATE_ID_EMAIL_CONFIRMATION,
                SEND_GRID_TEMPLATE_ID_INVITATION_LINK: process.env.SEND_GRID_TEMPLATE_ID_INVITATION_LINK,
                SEND_GRID_TOKEN: process.env.SEND_GRID_TOKEN,
                SERVER_PORT: process.env.SERVER_PORT
            },
            name: 'reflecta-backend',
            node_args: [
                '--experimental-specifier-resolution=node'
            ],
            script: '/var/www/api/src/app.js'
        }
    ]
};
