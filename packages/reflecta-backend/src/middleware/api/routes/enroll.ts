import express, {
    Request,
    Response
} from 'express';
import {
    body,
    validationResult
} from 'express-validator';
import {
    ValidationChain
} from 'express-validator/src/chain';

import EnrollmentController from '@controllers/EnrollmentController';

import errorResponseHandler from '@utils/errorResponseHandler';
import validationResponseHandle from '@utils/validationResponseHandler';

import RateLimiter from '@middleware/RateLimiter';

const enrollmentController = new EnrollmentController();

const rateLimiter = new RateLimiter();
const router = express.Router();

const inputValidations: ValidationChain[] = [
    body('emailAddress').trim().isEmail().normalizeEmail()
        .not()
        .isEmpty(),
    body('firstName').trim().escape().not()
        .isEmpty(),
    body('invitationToken').trim().not()
        .isEmpty(),
    body('lastName').trim().escape().not()
        .isEmpty(),
    body('password').not().isEmpty()
];

router.post('/enroll', [
    rateLimiter.limited,
    ...inputValidations
], async (request: Request, response: Response) => {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
        const errorMessagesList = validationResponseHandle(errors.array());

        return response.status(422).send(errorMessagesList);
    }

    try {
        const {
            body: {
                emailAddress,
                firstName,
                invitationToken,
                lastName,
                password
            }
        } = request;

        await enrollmentController.enroll({
            emailAddress,
            firstName,
            invitationToken,
            lastName,
            password
        });

        return response.sendStatus(201);
    } catch (error) {
        return errorResponseHandler(error, response);
    }
});

export default router;
