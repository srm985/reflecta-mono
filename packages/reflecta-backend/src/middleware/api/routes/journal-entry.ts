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

import {
    AuthenticationTokenPayloadLocals
} from '@controllers/AuthenticationController';
import JournalingController, {
    JournalEntryResponse
} from '@controllers/JournalingController';

import errorResponseHandler from '@utils/errorResponseHandler';
import validationResponseHandle, {
    ErrorMessageDetails
} from '@utils/validationResponseHandler';

import Authentication from '@middleware/Authentication';
import RateLimiter from '@middleware/RateLimiter';

export interface RequestBodyCreate {
    entryBody: string;
    entryLocation?: string;
    entryOccurredAt: string;
    entryTitle: string;
}

export interface RequestBodyUpdate extends RequestBodyCreate {
    entryID: number;
}

export interface RequestBodyDelete {
    entryID: number;
}

const router = express.Router();

const authentication = new Authentication();
const rateLimiter = new RateLimiter();

const journalingController = new JournalingController();

const inputValidationsCreate: ValidationChain[] = [
    body('entryTitle').trim().isString(),
    body('entryBody').trim().isString(),
    body('entryOccurredAt').trim().isString(),
    body('entryLocation').trim().isString().optional()
];

const inputValidationsUpdate: ValidationChain[] = [
    ...inputValidationsCreate,
    body('entryID').isNumeric()
];

const inputValidationsDelete: ValidationChain[] = [
    body('entryID').isNumeric()
];

router.post('/journal-entry', [
    rateLimiter.limited,
    authentication.required,
    ...inputValidationsCreate
], async (request: Request<{}, {}, RequestBodyCreate>, response: Response<ErrorMessageDetails[], AuthenticationTokenPayloadLocals>) => {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
        const errorMessagesList = validationResponseHandle(errors.array());

        return response.status(422).send(errorMessagesList);
    }

    try {
        const {
            body: {
                entryBody,
                entryLocation,
                entryOccurredAt,
                entryTitle
            }
        } = request;

        const {
            locals: {
                authenticationTokenPayload: {
                    userID
                }
            }
        } = response;

        await journalingController.insertJournalEntry(userID, {
            body: entryBody,
            location: entryLocation,
            occurredAt: entryOccurredAt,
            title: entryTitle
        });

        return response.sendStatus(201);
    } catch (error) {
        return errorResponseHandler(error, response);
    }
});

router.patch('/journal-entry', [
    rateLimiter.limited,
    authentication.required,
    ...inputValidationsUpdate
], async (request: Request<{}, {}, RequestBodyUpdate>, response: Response<ErrorMessageDetails[], AuthenticationTokenPayloadLocals>) => {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
        const errorMessagesList = validationResponseHandle(errors.array());

        return response.status(422).send(errorMessagesList);
    }

    try {
        const {
            body: {
                entryBody,
                entryID,
                entryLocation,
                entryOccurredAt,
                entryTitle
            }
        } = request;

        const {
            locals: {
                authenticationTokenPayload: {
                    userID
                }
            }
        } = response;

        await journalingController.modifyJournalEntry(userID, entryID, {
            body: entryBody,
            location: entryLocation,
            occurredAt: entryOccurredAt,
            title: entryTitle
        });

        return response.sendStatus(204);
    } catch (error) {
        return errorResponseHandler(error, response);
    }
});

router.get('/journal-entry', [
    rateLimiter.limited,
    authentication.required
], async (request: Request, response: Response<JournalEntryResponse[], AuthenticationTokenPayloadLocals>) => {
    try {
        const {
            locals: {
                authenticationTokenPayload: {
                    userID
                }
            }
        } = response;

        const journalEntriesList = await journalingController.getAllEntriesByUserID(userID);

        return response.status(200).send(journalEntriesList);
    } catch (error) {
        return errorResponseHandler(error, response);
    }
});

router.delete('/journal-entry', [
    rateLimiter.limited,
    authentication.required,
    ...inputValidationsDelete
], async (request: Request<{}, {}, RequestBodyDelete>, response: Response<ErrorMessageDetails[], AuthenticationTokenPayloadLocals>) => {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
        const errorMessagesList = validationResponseHandle(errors.array());

        return response.status(422).send(errorMessagesList);
    }

    try {
        const {
            body: {
                entryID
            }
        } = request;

        const {
            locals: {
                authenticationTokenPayload: {
                    userID
                }
            }
        } = response;

        await journalingController.deleteJournalEntry(userID, entryID);

        return response.sendStatus(204);
    } catch (error) {
        return errorResponseHandler(error, response);
    }
});

export default router;
