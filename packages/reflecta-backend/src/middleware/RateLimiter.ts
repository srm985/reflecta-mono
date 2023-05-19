import {
    NextFunction,
    Request,
    Response
} from 'express';
import rateLimit, {
    RateLimitRequestHandler
} from 'express-rate-limit';

class RateLimiter {
    private apiLimiter: RateLimitRequestHandler;

    constructor(permittedTries?: number, timeoutMS?: number) {
        const {
            env: {
                RATE_LIMITER_PERMITTED_TRIES = '',
                RATE_LIMITER_TIMEOUT_MS = ''
            }
        } = process;
        this.apiLimiter = rateLimit({
            max: permittedTries || parseInt(RATE_LIMITER_PERMITTED_TRIES, 10),
            windowMs: timeoutMS || parseInt(RATE_LIMITER_TIMEOUT_MS, 10)
        });
    }

    public limited = (request: Request, response: Response, next: NextFunction) => {
        this.apiLimiter(request, response, next);
    };
}

export default RateLimiter;
