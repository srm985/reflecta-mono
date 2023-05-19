import winston, {
    Logger,
    format,
    transports
} from 'winston';

import 'winston-daily-rotate-file';

// const {
//     env: {
//         LOGGING_DIRECTORY = '',
//         LOGGING_FILE_NAME = ''
//     }
// } = process;

const logger: Logger = winston.createLogger({
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.errors({
            stack: true
        }),
        format.splat(),
        format.json()
    )
    // transports: [
    //     new winston.transports.DailyRotateFile({
    //         dirname: LOGGING_DIRECTORY,
    //         filename: `${LOGGING_FILE_NAME}-%DATE%.log`
    //     })
    // ]
});

logger.add(new transports.Console({
    format: format.combine(
        format.colorize(),
        format.simple()
    )
}));

export default logger;
