import express, {
    Request,
    Response
} from 'express';

import AccountController, {
    UserDetailsResponse
} from '@controllers/AccountController';
import {
    AuthenticationTokenPayloadLocals
} from '@controllers/AuthenticationController';

import errorResponseHandler from '@utils/errorResponseHandler';

import Authentication from '@middleware/Authentication';
import RateLimiter from '@middleware/RateLimiter';

const router = express.Router();

const authentication = new Authentication();
const rateLimiter = new RateLimiter();

const accountController = new AccountController();

router.get('/account-details', [
    rateLimiter.limited,
    authentication.required
], async (request: Request, response: Response<UserDetailsResponse, AuthenticationTokenPayloadLocals>) => {
    try {
        const {
            locals: {
                authenticationTokenPayload: {
                    userID
                }
            }
        } = response;

        const userDetails = await accountController.getDetails(userID);

        return response.status(200).send(userDetails);
    } catch (error) {
        return errorResponseHandler(error, response);
    }
});

export default router;
