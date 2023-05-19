import {
    Response
} from 'express';

import logger from './logger';

import CustomError from './customError';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const errorResponseHandler = (errorDetails: any, response: Response) => {
    logger.error(JSON.stringify(errorDetails));

    if (errorDetails instanceof CustomError) {
        const {
            statusCode,
            userMessage = ''
        } = errorDetails;

        return response.status(statusCode).send({
            errorMessage: userMessage
        });
    }

    return response.sendStatus(500);
};

export default errorResponseHandler;
