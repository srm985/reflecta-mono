import express, {
    Request,
    Response
} from 'express';
import {
    ValidationChain,
    query,
    validationResult
} from 'express-validator';

import {
    AuthenticationTokenPayloadLocals
} from '@controllers/AuthenticationController';
import JournalingController, {
    JournalEntriesPageResponse,
    Search,
    SearchKeyword
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

const normalizeSearchKeywordsList = (searchKeywordsList: SearchKeyword[] | SearchKeyword | undefined): SearchKeyword[] => {
    if (!searchKeywordsList) {
        return [];
    }

    const keywordsList = Array.isArray(searchKeywordsList) ? searchKeywordsList : [
        searchKeywordsList
    ];

    return keywordsList.map((keyword) => keyword.trim()).filter(Boolean);
};

const inputValidations: ValidationChain[] = [
    query('cursorEntryID').optional().isInt({
        min: 1
    }).toInt(),
    query('cursorOccurredAt').optional().isString().trim(),
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
    query('limit').optional().isInt({
        max: 30,
        min: 1
    }).toInt(),
    query('searchEndDate').isString().trim(),
    query('searchKeywordsList').optional().custom((value) => Array.isArray(value) || typeof value === 'string'),
    query('searchKeywordsList.*').optional().isString().trim(),
    query('searchStartDate').isString().trim(),
    query('searchString').optional().isString().trim(),
    query('useAISearch').isBoolean()
];

router.get('/search', [
    rateLimiter.limited,
    authentication.required,
    ...inputValidations
], async (request: Request<{}, {}, {}, Search>, response: Response<JournalEntriesPageResponse | ErrorMessageDetails[], AuthenticationTokenPayloadLocals>) => {
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

        const journalEntriesPage = await journalingController.search(userID, {
            ...searchDetails,
            searchKeywordsList: normalizeSearchKeywordsList(searchDetails.searchKeywordsList),
            useAISearch: searchDetails.useAISearch === 'true'
        });

        return response.status(200).send(journalEntriesPage);
    } catch (error) {
        return errorResponseHandler(error, response);
    }
});

export default router;
