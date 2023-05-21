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

import AuthenticationController from '../../../controllers/AuthenticationController';

import errorResponseHandler from '../../../utils/errorResponseHandler';
import validationResponseHandle from '../../../utils/validationResponseHandler';

import RateLimiter from '../../RateLimiter';

const authenticationController = new AuthenticationController();

const rateLimiter = new RateLimiter();
const router = express.Router();

const inputValidations: ValidationChain[] = [
    body('emailAddress').trim().isEmail().normalizeEmail()
        .not()
        .isEmpty(),
    body('password').not().isEmpty()
];

router.post('/login', [
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
                password
            }
        } = request;

        await authenticationController.login(emailAddress, password);

        return response.send({}).status(200);
    } catch (error) {
        return errorResponseHandler(error, response);
    }
});

export default router;