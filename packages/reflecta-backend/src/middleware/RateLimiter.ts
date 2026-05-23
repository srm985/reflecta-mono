import {
    NextFunction,
    Request,
    RequestHandler,
    Response
} from 'express';
import rateLimit from 'express-rate-limit';

class RateLimiter {
    private apiLimiter: RequestHandler;

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
        }) as unknown as RequestHandler;
    }

    public limited = (request: Request, response: Response, next: NextFunction) => {
        this.apiLimiter(request, response, next);
    };
}

export default RateLimiter;
