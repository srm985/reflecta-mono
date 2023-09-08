import express, {
    Request,
    Response
} from 'express';
import {
    query,
    validationResult
} from 'express-validator';
import {
    ValidationChain
} from 'express-validator/src/chain';

import {
    AuthenticationTokenPayloadLocals
} from '@controllers/AuthenticationController';
import JournalingController, {
    JournalEntryResponse, Search
} from '@controllers/JournalingController';

import errorResponseHandler from '@utils/errorResponseHandler';
import validationResponseHandle, {
    ErrorMessageDetails
} from '@utils/validationResponseHandler';

import Authentication from '@middleware/Authentication';
import RateLimiter from '@middleware/RateLimiter';

const router = express.Router();

const authentication = new Authentication();
const rateLimiter = new RateLimiter();

const journalingController = new JournalingController();

const inputValidations: ValidationChain[] = [
    query('dateSearchOption').isString().trim().isIn([
        'disabled',
        'entryDate',
        'dateRange'
    ]),
    query('entryDate').isString().trim(),
    query('keywordSearchOption').isString().trim().isIn([
        'disabled',
        'matchesAny',
        'matchesAll'
    ]),
    query('searchEndDate').isString().trim(),
    query('searchKeywordsList').optional().isArray(),
    query('searchKeywordsList.*').optional().isString().trim(),
    query('searchStartDate').isString().trim(),
    query('searchString').optional().isString().trim(),
    query('useAISearch').isBoolean()
];

router.get('/search', [
    rateLimiter.limited,
    authentication.required,
    ...inputValidations
], async (request: Request<{}, {}, {}, Search>, response: Response<JournalEntryResponse[] | ErrorMessageDetails[], AuthenticationTokenPayloadLocals>) => {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
        const errorMessagesList = validationResponseHandle(errors.array());

        return response.status(422).send(errorMessagesList);
    }

    try {
        const {
            query: searchDetails
        } = request;

        const {
            locals: {
                authenticationTokenPayload: {
                    userID
                }
            }
        } = response;

        const journalEntriesList = await journalingController.search(userID, {
            ...searchDetails,
            useAISearch: searchDetails.useAISearch === 'true'
        });

        return response.status(200).send(journalEntriesList);
    } catch (error) {
        return errorResponseHandler(error, response);
    }
});

export default router;
