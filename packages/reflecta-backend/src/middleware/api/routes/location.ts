import express, {
    Request,
    Response
} from 'express';
import {
    ValidationChain,
    query,
    validationResult
} from 'express-validator';

import LocationController, {
    LocationRequest,
    LocationResponse
} from '@controllers/LocationController';

import errorResponseHandler from '@utils/errorResponseHandler';
import validationResponseHandle, {
    ErrorMessageDetails
} from '@utils/validationResponseHandler';

import Authentication from '@middleware/Authentication';
import RateLimiter from '@middleware/RateLimiter';

const router = express.Router();

const authentication = new Authentication();
const rateLimiter = new RateLimiter();

const inputValidations: ValidationChain[] = [
    query('latitude').isString().trim(),
    query('longitude').isString().trim()
];

router.get('/location', [
    rateLimiter.limited,
    authentication.required,
    ...inputValidations
], async (request: Request<{}, {}, {}, LocationRequest>, response: Response<LocationResponse | ErrorMessageDetails[]>) => {
    try {
        const errors = validationResult(request);

        if (!errors.isEmpty()) {
            const errorMessagesList = validationResponseHandle(errors.array());

            return response.status(422).send(errorMessagesList);
        }

        const {
            env: {
                GOOGLE_MAPS_API_KEY
            }
        } = process;

        const {
            headers: {
                'accept-language': locale = 'en-US'
            },
            query: {
                latitude,
                longitude
            }
        } = request;

        // Using the user's locale ensures the correct language for search results
        const [
            parsedLocale
        ] = locale.split(',');

        const locationController = new LocationController(GOOGLE_MAPS_API_KEY!, parsedLocale);

        const location = await locationController.resolveCityFromCoordinates(latitude, longitude);

        return response.status(200).send({
            location
        });
    } catch (error) {
        return errorResponseHandler(error, response);
    }
});

export default router;
