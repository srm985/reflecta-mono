import JournalEntriesModel, {
    JournalEntriesSchema,
    JournalEntry
} from '@models/JournalEntriesModel';

import OpenAIService from '@services/OpenAIService';

import CustomError from '@utils/CustomError';

export type JournalEntryAPIInput = Pick<JournalEntry, 'body' | 'occurredAt' | 'title'>;
export type JournalEntryResponse = Pick<JournalEntry, 'body' | 'entryID' | 'isHighInterest' | 'occurredAt' | 'title' | 'updatedAt'>;

export type AnalyzedEntry = Pick<JournalEntry, 'isHighInterest' | 'keywords' | 'title'>;

export type KeywordSearchOption = 'disabled' | 'matchesAny' | 'matchesAll';
export type DateSearchOption = 'disabled' | 'entryDate' | 'dateRange';
export type SearchKeyword = string | number;

export type Search = {
    dateSearchOption: DateSearchOption;
    entryDate: string;
    keywordSearchOption: KeywordSearchOption;
    searchEndDate: string;
    searchKeywordsList: SearchKeyword[];
    searchStartDate: string;
    searchString: string;
    useAISearch: boolean;
};

class JournalingController {
    private readonly journalEntriesModel: JournalEntriesModel;

    private readonly openAIService: OpenAIService;

    constructor() {
        this.journalEntriesModel = new JournalEntriesModel();

        this.openAIService = new OpenAIService();
    }

    private sanitize = (body: string = ''): string => body.replace(/\t+/g, ' ').replace(/[ ]{2, }/g, ' ').replace(/\n{3,}/g, '\n\n').trim();

    private prepareAnalyzeEntry = async (sanitizedTitle: string, sanitizedBody: string): Promise<AnalyzedEntry> => {
        const {
            env: {
                JOURNAL_ENTRY_MINIMUM_BODY_WORDS_FOR_TITLE = ''
            }
        } = process;

        const minimumWordCount = parseInt(JOURNAL_ENTRY_MINIMUM_BODY_WORDS_FOR_TITLE, 10);
        const isBodyMinimumWordCount = sanitizedBody.split(' ').length >= minimumWordCount;

        if (isBodyMinimumWordCount) {
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
        occurredAt: rawJournalEntry.occurred_at,
        title: rawJournalEntry.title,
        updatedAt: rawJournalEntry.updated_at
    });

    insertJournalEntry = async (userID: number, entryDetails: JournalEntryAPIInput) => {
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
            occurredAt: entryDetails.occurredAt.slice(0, 10),
            title
        });
    };

    modifyJournalEntry = async (userID: number, entryID: number, entryDetails: JournalEntryAPIInput) => {
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

        const sanitizedTitle = this.sanitize(entryDetails.title);
        const sanitizedBody = this.sanitize(entryDetails.body);

        // No point in processing if nothing has changed
        if (
            sanitizedTitle
            && sanitizedTitle === existingEntryDetails.title
            && sanitizedBody === existingEntryDetails.body
            && existingEntryDetails.keywords
        ) {
            return undefined;
        }

        const {
            isHighInterest,
            keywords,
            title
        } = await this.prepareAnalyzeEntry(entryDetails.title, entryDetails.body);

        // Everything looks good so we can go ahead and update the journal entry
        return this.journalEntriesModel.modifyJournalEntry(entryID, {
            ...entryDetails,
            body: sanitizedBody,
            isHighInterest,
            keywords,
            occurredAt: entryDetails.occurredAt.slice(0, 10),
            title: this.sanitize(title)
        });
    };

    getAllEntriesByUserID = async (userID: number): Promise<JournalEntryResponse[]> => (await this.journalEntriesModel.allJournalEntriesByUserID(userID)).map(this.mapEntryForResponse);

    deleteJournalEntry = async (userID: number, entryID: number) => {
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

    search = async (userID: number, searchDetails: Search): Promise<JournalEntryResponse[]> => {
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

        // Return all journal entries matching the date - there could be more than one
        if (dateSearchOption === 'entryDate' && entryDate) {
            return (await this.journalEntriesModel.journalEntriesByDate(userID, entryDate)).map(this.mapEntryForResponse);
        }

        // Return all entries in the range (inclusive) with no additional filtering
        if (dateSearchOption === 'dateRange' && searchStartDate && searchEndDate) {
            return (await this.journalEntriesModel.journalEntriesByDateRange(userID, searchStartDate, searchEndDate)).map(this.mapEntryForResponse);
        }

        if (keywordSearchOption === 'matchesAll' && searchKeywordsList.length) {
            console.log('keyword all search...');
        }

        if (keywordSearchOption === 'matchesAny' && searchKeywordsList.length) {
            console.log('keyword any search...');
        }

        if (searchString) {
            const fuzzyKeywordsList: string[] = [];

            if (useAISearch) {
                const generatedKeywordsList = await this.openAIService.generateSearchKeywords(searchString);

                fuzzyKeywordsList.push(...generatedKeywordsList);
            }

            return (await this.journalEntriesModel.journalEntryByKeywords(userID, [
                searchString,
                ...fuzzyKeywordsList
            ], 'OR')).map(this.mapEntryForResponse);
        }

        return ([]);
    };
}

export default JournalingController;
