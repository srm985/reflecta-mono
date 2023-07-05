import JournalEntriesModel, {
    JournalEntry
} from '@models/JournalEntriesModel';

import OpenAIService from '@services/OpenAIService';

import CustomError from '@utils/CustomError';

export type JournalEntryAPIInput = Pick<JournalEntry, 'body' | 'occurredAt' | 'title'>;
export type JournalEntryResponse = Pick<JournalEntry, 'body' | 'entryID' | 'isHighInterest' | 'occurredAt' | 'title' | 'updatedAt'>;

export type AnalyzedEntry = Pick<JournalEntry, 'isHighInterest' | 'keywords' | 'title'>;

class JournalingController {
    private readonly journalEntriesModel: JournalEntriesModel;

    private readonly openAIService: OpenAIService;

    constructor() {
        this.journalEntriesModel = new JournalEntriesModel();

        this.openAIService = new OpenAIService();
    }

    private prepareAnalyzeEntry = async (title: string, body: string): Promise<AnalyzedEntry> => {
        const {
            env: {
                JOURNAL_ENTRY_MINIMUM_BODY_WORDS_FOR_TITLE = ''
            }
        } = process;

        const minimumWordCount = parseInt(JOURNAL_ENTRY_MINIMUM_BODY_WORDS_FOR_TITLE, 10);
        const isBodyMinimumWordCount = body.split(' ').length >= minimumWordCount;

        if (isBodyMinimumWordCount) {
            const analyzedEntryDetails = await this.openAIService.analyze(body);

            if (analyzedEntryDetails) {
                return ({
                    isHighInterest: analyzedEntryDetails.isHighInterest,
                    keywords: analyzedEntryDetails.keywords.toLowerCase(),
                    title: title || analyzedEntryDetails.title
                });
            }
        }

        return ({
            isHighInterest: false,
            keywords: null,
            title
        });
    };

    insertJournalEntry = async (userID: number, entryDetails: JournalEntryAPIInput) => {
        const {
            isHighInterest,
            keywords,
            title
        } = await this.prepareAnalyzeEntry(entryDetails.title, entryDetails.body);

        await this.journalEntriesModel.insertJournalEntry(userID, {
            ...entryDetails,
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

        const {
            isHighInterest,
            keywords,
            title
        } = await this.prepareAnalyzeEntry(entryDetails.title, entryDetails.body);

        // Everything looks good so we can go ahead and update the journal entry
        await this.journalEntriesModel.modifyJournalEntry(entryID, {
            ...entryDetails,
            isHighInterest,
            keywords,
            occurredAt: entryDetails.occurredAt.slice(0, 10),
            title
        });
    };

    getAllEntriesByUserID = async (userID: number): Promise<JournalEntryResponse[]> => (await this.journalEntriesModel.allJournalEntriesByUserID(userID)).map((entryDetails): JournalEntryResponse => ({
        body: entryDetails.body,
        entryID: entryDetails.entry_id,
        isHighInterest: entryDetails.is_high_interest,
        occurredAt: entryDetails.occurred_at,
        title: entryDetails.title,
        updatedAt: entryDetails.updated_at
    }));

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
}

export default JournalingController;
