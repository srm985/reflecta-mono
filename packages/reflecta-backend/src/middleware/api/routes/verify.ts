import express, {
    Request,
    Response
} from 'express';
import {
    query,
    validationResult
} from 'express-validator';

import EnrollmentController from '../../../controllers/EnrollmentController';

import errorResponseHandler from '../../../utils/errorResponseHandler';
import validationResponseHandle from '../../../utils/validationResponseHandler';

import RateLimiter from '../../RateLimiter';

const enrollmentController = new EnrollmentController();
const rateLimiter = new RateLimiter(5, 60000);
const router = express.Router();

const inputValidations = [
    query('enrollmentToken').trim().not().isEmpty()
];

router.get('/verify', [
    rateLimiter.limited,
    ...inputValidations
], async (request: Request, response: Response) => {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
        const errorMessagesList = validationResponseHandle(errors.array());

        return response.status(422).send(errorMessagesList);
    }

    const {
        query: {
            enrollmentToken
        }
    } = request || {};

    try {
        const {
            env: {
                BASE_URL_APPLICATION
            }
        } = process;

        await enrollmentController.verifyEnrollmentToken(enrollmentToken as string);

        return response.redirect(`${BASE_URL_APPLICATION}/login`);
    } catch (error) {
        return errorResponseHandler(error, response);
    }
});

export default router;
