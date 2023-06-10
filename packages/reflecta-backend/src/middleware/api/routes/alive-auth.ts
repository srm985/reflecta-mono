import express, {
    Request,
    Response
} from 'express';

import errorResponseHandler from '@utils/errorResponseHandler';

import Authentication from '@middleware/Authentication';
import RateLimiter from '@middleware/RateLimiter';

const router = express.Router();

const authentication = new Authentication();
const rateLimiter = new RateLimiter();

router.get('/alive-auth', [
    rateLimiter.limited,
    authentication.required
], async (request: Request, response: Response) => {
    try {
        return response.sendStatus(201);
    } catch (error) {
        return errorResponseHandler(error, response);
    }
});

export default router;
