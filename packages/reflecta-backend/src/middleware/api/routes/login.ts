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

import AuthenticationController from '@controllers/AuthenticationController';

import errorResponseHandler from '@utils/errorResponseHandler';
import validationResponseHandle from '@utils/validationResponseHandler';

import RateLimiter from '@middleware/RateLimiter';

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

        const {
            env: {
                BASE_URL_APPLICATION = '',
                COOKIE_EXPIRATION_SECONDS = '',
                COOKIE_SAME_SITE_CONFIG,
                COOKIE_STORAGE_NAME = '',
                NODE_ENV = ''
            }
        } = process;

        const {
            tokenHeaderPayload,
            tokenSignature
        } = await authenticationController.login(emailAddress, password);

        return response.cookie(COOKIE_STORAGE_NAME, tokenHeaderPayload, {
            domain: BASE_URL_APPLICATION,
            httpOnly: true,
            maxAge: parseInt(COOKIE_EXPIRATION_SECONDS, 10) * 1000,
            sameSite: COOKIE_SAME_SITE_CONFIG === 'lax' ? 'lax' : 'none',
            secure: NODE_ENV !== 'develop'
        }).status(200).send({
            tokenSignature
        });
    } catch (error) {
        return errorResponseHandler(error, response);
    }
});

export default router;
