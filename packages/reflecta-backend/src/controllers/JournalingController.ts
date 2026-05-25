import JournalEntriesModel, {
    EntryID,
    JournalEntriesPageDetails,
    JournalEntriesPageResult,
    JournalEntriesSchema,
    JournalEntry
} from '@models/JournalEntriesModel';

import OpenAIService from '@services/OpenAIService';

import CustomError from '@utils/CustomError';
import dateStamp from '@utils/dateStamp';

import {
    UserID
} from '@types';

export type JournalEntryAPIInput = Pick<JournalEntry, 'body' | 'location' | 'occurredAt' | 'title'>;
export type JournalEntryChangeLog = Partial<JournalEntryAPIInput>;
export type JournalEntryResponse = Pick<JournalEntry, 'body' | 'entryID' | 'isHighInterest' | 'location' | 'occurredAt' | 'title' | 'updatedAt'>;

export type AnalyzedEntry = Pick<JournalEntry, 'isHighInterest' | 'keywords' | 'title'>;

export type KeywordSearchOption = 'disabled' | 'matchesAny' | 'matchesAll';
export type DateSearchOption = 'disabled' | 'entryDate' | 'dateRange';
export type SearchKeyword = string;

export type JournalEntriesPagination = {
    cursorEntryID?: EntryID | string;
    cursorOccurredAt?: string;
    limit?: number | string;
};

export type JournalEntriesPageCursorResponse = {
    entryID: EntryID;
    occurredAt: string;
};

export type JournalEntriesPageResponse = {
    hasMore: boolean;
    journalEntriesList: JournalEntryResponse[];
    nextCursor: JournalEntriesPageCursorResponse | null;
};

export type Search = JournalEntriesPagination & {
    dateSearchOption: DateSearchOption;
    entryDate: string;
    keywordSearchOption: KeywordSearchOption;
    searchEndDate: string;
    searchKeywordsList: SearchKeyword[];
    searchStartDate: string;
    searchString: string;
    useAISearch: boolean | string;
};

const DEFAULT_PAGE_LIMIT = 12;
const MAX_PAGE_LIMIT = 30;

class JournalingController {
    private readonly journalEntriesModel: JournalEntriesModel;

    private readonly openAIService: OpenAIService;

    constructor() {
        this.journalEntriesModel = new JournalEntriesModel();

        this.openAIService = new OpenAIService();
    }

    private sanitize = (body: string = ''): string => body.replace(/\t+/g, ' ').replace(/[ ]{2, }/g, ' ').replace(/\n{3,}/g, '\n\n').trim();

    private prepareAnalyzeEntry = async (sanitizedTitle: string, sanitizedBody: string): Promise<AnalyzedEntry> => {
        if (sanitizedBody) {
            const analyzedEntryDetails = await this.openAIService.analyze(sanitizedBody);

            if (analyzedEntryDetails) {
                return ({
                    isHighInterest: analyzedEntryDetails.isHighInterest,
                    keywords: analyzedEntryDetails.keywords.map((keyword) => keyword.toLowerCase()).join(', '),
                    title: sanitizedTitle || this.sanitize(analyzedEntryDetails.title)
                });
            }
        }

        return ({
            isHighInterest: false,
            keywords: null,
            title: sanitizedTitle
        });
    };

    private mapEntryForResponse = (rawJournalEntry: JournalEntriesSchema): JournalEntryResponse => ({
        body: rawJournalEntry.body,
        entryID: rawJournalEntry.entry_id,
        isHighInterest: rawJournalEntry.is_high_interest,
        location: rawJournalEntry.location,
        occurredAt: dateStamp(rawJournalEntry.occurred_at),
        title: rawJournalEntry.title,
        updatedAt: rawJournalEntry.updated_at
    });

    private mapEntriesPageForResponse = (journalEntriesPage: JournalEntriesPageResult): JournalEntriesPageResponse => ({
        hasMore: journalEntriesPage.hasMore,
        journalEntriesList: journalEntriesPage.entriesList.map(this.mapEntryForResponse),
        nextCursor: journalEntriesPage.nextCursor ? {
            entryID: journalEntriesPage.nextCursor.entryID,
            occurredAt: dateStamp(journalEntriesPage.nextCursor.occurredAt)
        } : null
    });

    private emptyEntriesPage = (): JournalEntriesPageResponse => ({
        hasMore: false,
        journalEntriesList: [],
        nextCursor: null
    });

    private normalizePageDetails = (pagination: JournalEntriesPagination = {}): JournalEntriesPageDetails => {
        const {
            cursorEntryID,
            cursorOccurredAt,
            limit
        } = pagination;

        const parsedLimit = typeof limit === 'number' ? limit : parseInt(limit || '', 10);
        const pageLimit = Number.isInteger(parsedLimit) ? Math.min(Math.max(parsedLimit, 1), MAX_PAGE_LIMIT) : DEFAULT_PAGE_LIMIT;
        const parsedCursorEntryID = typeof cursorEntryID === 'number' ? cursorEntryID : parseInt(cursorEntryID || '', 10);

        if (!cursorOccurredAt || !Number.isInteger(parsedCursorEntryID)) {
            return {
                limit: pageLimit
            };
        }

        return {
            cursor: {
                entryID: parsedCursorEntryID,
                occurredAt: dateStamp(cursorOccurredAt)
            },
            limit: pageLimit
        };
    };

    // Scan for diffs to save time only updating necessary parts of entry
    private changeLog = (entrySubmissionDetails: JournalEntryAPIInput, existingEntryDetails: JournalEntriesSchema): JournalEntryChangeLog => {
        const sanitizedTitle = this.sanitize(entrySubmissionDetails.title);
        const sanitizedBody = this.sanitize(entrySubmissionDetails.body);

        const dateSubset = entrySubmissionDetails.occurredAt.slice(0, 10);

        return ({
            body: sanitizedBody !== existingEntryDetails.body ? sanitizedBody : undefined,
            location: entrySubmissionDetails.location !== existingEntryDetails.location ? entrySubmissionDetails.location : undefined,
            occurredAt: dateSubset !== dateStamp(existingEntryDetails.occurred_at) ? dateSubset : undefined,
            title: sanitizedTitle !== existingEntryDetails.title ? sanitizedTitle : undefined
        });
    };

    insertJournalEntry = async (userID: UserID, entryDetails: JournalEntryAPIInput) => {
        const sanitizedTitle = this.sanitize(entryDetails.title);
        const sanitizedBody = this.sanitize(entryDetails.body);

        const {
            isHighInterest,
            keywords,
            title
        } = await this.prepareAnalyzeEntry(sanitizedTitle, sanitizedBody);

        await this.journalEntriesModel.insertJournalEntry(userID, {
            ...entryDetails,
            body: sanitizedBody,
            isHighInterest,
            keywords,
            location: entryDetails.location,
            occurredAt: entryDetails.occurredAt.slice(0, 10),
            title
        });
    };

    modifyJournalEntry = async (userID: UserID, entryID: number, entryDetails: JournalEntryAPIInput) => {
        const existingEntryDetails = await this.journalEntriesModel.journalEntry(entryID);

        // Quick sanity check to ensure we actually found a valid journal entry
        if (!existingEntryDetails) {
            throw new CustomError({
                privateMessage: `Journal entry ID: ${entryID} not found or has been marked deleted...`,
                statusCode: 404,
                userMessage: 'Your journal entry could not be found or has been deleted...'
            });
        }

        // Ensure our user is editing an entry to which they have access
        if (existingEntryDetails.user_id !== userID) {
            throw new CustomError({
                privateMessage: `User ID: ${userID} attempted to edit journal entry ID: ${entryID} which is assigned to user ID: ${existingEntryDetails.user_id}...`,
                statusCode: 401
            });
        }

        const updatedEntryDetails = this.changeLog(entryDetails, existingEntryDetails);

        // We need to do a full update i.e. body or keyword changes
        if (updatedEntryDetails.body || !existingEntryDetails.keywords) {
            const {
                isHighInterest,
                keywords,
                title
            } = await this.prepareAnalyzeEntry(entryDetails.title, entryDetails.body);

            // Everything looks good so we can go ahead and update the journal entry
            return this.journalEntriesModel.modifyJournalEntry(entryID, {
                ...entryDetails,
                body: updatedEntryDetails.body || existingEntryDetails.body,
                isHighInterest,
                keywords,
                occurredAt: entryDetails.occurredAt.slice(0, 10),
                title: this.sanitize(title)
            });
        }

        const quickUpdatesPromiseList = [];

        // Just quickly update the title
        if (updatedEntryDetails.title) {
            quickUpdatesPromiseList.push(this.journalEntriesModel.modifyTitle(entryID, updatedEntryDetails.title));
        }

        // Just quickly update the entry date
        if (updatedEntryDetails.occurredAt) {
            quickUpdatesPromiseList.push(this.journalEntriesModel.modifyOccurredAt(entryID, updatedEntryDetails.occurredAt));
        }

        // Just quickly update the location
        if (updatedEntryDetails.location) {
            quickUpdatesPromiseList.push(this.journalEntriesModel.modifyLocation(entryID, updatedEntryDetails.location));
        }

        return Promise.all(quickUpdatesPromiseList);
    };

    getAllEntriesByUserID = async (userID: UserID, pagination?: JournalEntriesPagination): Promise<JournalEntriesPageResponse> => this.mapEntriesPageForResponse(await this.journalEntriesModel.allJournalEntriesByUserID(userID, this.normalizePageDetails(pagination)));

    getEntryByID = async (userID: UserID, entryID: number): Promise<JournalEntryResponse> => {
        const existingEntryDetails = await this.journalEntriesModel.journalEntry(entryID);

        if (!existingEntryDetails) {
            throw new CustomError({
                privateMessage: `Journal entry ID: ${entryID} not found or has been marked deleted...`,
                statusCode: 404,
                userMessage: 'Your journal entry could not be found or has been deleted...'
            });
        }

        if (existingEntryDetails.user_id !== userID) {
            throw new CustomError({
                privateMessage: `User ID: ${userID} attempted to open journal entry ID: ${entryID} which is assigned to user ID: ${existingEntryDetails.user_id}...`,
                statusCode: 401
            });
        }

        return this.mapEntryForResponse(existingEntryDetails);
    };

    deleteJournalEntry = async (userID: UserID, entryID: number) => {
        const existingEntryDetails = await this.journalEntriesModel.journalEntry(entryID);

        // Quick sanity check to ensure we actually found a valid journal entry
        if (!existingEntryDetails) {
            throw new CustomError({
                privateMessage: `Journal entry ID: ${entryID} not found or has already been marked deleted...`,
                statusCode: 404,
                userMessage: 'Your journal entry could not be found or has already been deleted...'
            });
        }

        // Ensure our user is editing an entry to which they have access
        if (existingEntryDetails.user_id !== userID) {
            throw new CustomError({
                privateMessage: `User ID: ${userID} attempted to delete journal entry ID: ${entryID} which is assigned to user ID: ${existingEntryDetails.user_id}...`,
                statusCode: 401
            });
        }

        // Everything looks good so we can go ahead and update the journal entry
        await this.journalEntriesModel.deleteJournalEntry(entryID);
    };

    search = async (userID: UserID, searchDetails: Search): Promise<JournalEntriesPageResponse> => {
        const {
            dateSearchOption,
            entryDate,
            keywordSearchOption,
            searchEndDate,
            searchKeywordsList,
            searchStartDate,
            searchString,
            useAISearch
        } = searchDetails;

        const trimmedSearchString = (searchString || '').trim();
        const manualKeywordsList = searchKeywordsList.map((keyword) => keyword.trim()).filter(Boolean);
        const textKeywordsList: string[] = trimmedSearchString ? [
            trimmedSearchString
        ] : [];

        if (trimmedSearchString && (useAISearch === true || useAISearch === 'true')) {
            const generatedKeywordsList = await this.openAIService.generateSearchKeywords(trimmedSearchString);

            textKeywordsList.push(...generatedKeywordsList.map((keyword) => keyword.trim()).filter(Boolean));
        }

        const hasEntryDateFilter = dateSearchOption === 'entryDate' && !!entryDate;
        const hasDateRangeFilter = dateSearchOption === 'dateRange' && !!searchStartDate && !!searchEndDate;
        const hasKeywordFilter = keywordSearchOption !== 'disabled' && manualKeywordsList.length > 0;
        const hasTextFilter = textKeywordsList.length > 0;

        if (!hasEntryDateFilter && !hasDateRangeFilter && !hasKeywordFilter && !hasTextFilter) {
            return this.emptyEntriesPage();
        }

        return this.mapEntriesPageForResponse(await this.journalEntriesModel.searchJournalEntries(userID, {
            dateSearchOption,
            entryDate,
            keywordSearchOption,
            searchEndDate,
            searchKeywordsList: manualKeywordsList,
            searchStartDate,
            textKeywordsList
        }, this.normalizePageDetails(searchDetails)));
    };
}

export default JournalingController;
