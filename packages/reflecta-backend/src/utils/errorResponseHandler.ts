import {
    Response
} from 'express';

import logger from '@utils/logger';

import CustomError from './CustomError';

export type ReturnedError = {
    errorMessage: string;
    statusCode: number;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const errorResponseHandler = (errorDetails: any, response: Response<ReturnedError>) => {
    logger.error(JSON.stringify(errorDetails));

    if (errorDetails instanceof CustomError) {
        const {
            statusCode,
            userMessage = ''
        } = errorDetails;

        return response.status(statusCode).send({
            errorMessage: userMessage,
            statusCode
        });
    }

    return response.status(500).send({
        errorMessage: 'Unknown error',
        statusCode: 500
    });
};

export default errorResponseHandler;
