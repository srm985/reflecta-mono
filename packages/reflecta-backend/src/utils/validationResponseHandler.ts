import {
    FieldValidationError,
    ValidationError
} from 'express-validator';

import logger from './logger';

export interface ErrorMessageDetails {
    errorMessage: string;
    fieldName: string;
}

const validationResponseHandle = (errorsList: ValidationError[]): ErrorMessageDetails[] => {
    const errorMessagesList = errorsList.map((errorDetails) => {
        const {
            msg: errorMessage,
            path: fieldName
        } = errorDetails as FieldValidationError;

        return ({
            errorMessage,
            fieldName
        });
    });

    logger.warn(JSON.stringify(errorMessagesList));

    return errorMessagesList;
};

export default validationResponseHandle;
