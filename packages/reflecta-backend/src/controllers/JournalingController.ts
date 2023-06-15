import JournalEntriesModel, {
    JournalEntry
} from '@models/JournalEntriesModel';

import CustomError from '@utils/CustomError';

class JournalingController {
    private readonly journalEntriesModel: JournalEntriesModel;

    constructor() {
        this.journalEntriesModel = new JournalEntriesModel();
    }

    insertJournalEntry = async (userID: number, entryDetails: JournalEntry) => {
        await this.journalEntriesModel.insertJournalEntry(userID, entryDetails);
    };

    modifyJournalEntry = async (userID: number, entryID: number, entryDetails: JournalEntry) => {
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

        // Everything looks good so we can go ahead and update the journal entry
        await this.journalEntriesModel.modifyJournalEntry(entryID, entryDetails);
    };

    getAllEntriesByUserID = async (userID: number): Promise<JournalEntry[]> => (await this.journalEntriesModel.allJournalEntriesByUserID(userID)).map((entryDetails): JournalEntry => ({
        body: entryDetails.body,
        createdAt: entryDetails.created_at,
        entryID: entryDetails.entry_id,
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
