import {
    ChatCompletionRequestMessage,
    ChatCompletionResponseMessage,
    Configuration,
    OpenAIApi
} from 'openai';

import logger from '@utils/logger';

export type AnalysisResponse = {
    isHighInterest: boolean;
    keywords: string[];
    title: string;
};

export type ChatDetails = {
    maxTokens: number;
    messagesList: ChatCompletionRequestMessage[];
    temperature?: number;
};

class OpenAIService {
    private readonly openAI: OpenAIApi;

    private readonly OPENAI_MODEL: string;

    constructor() {
        const {
            env: {
                OPENAI_API_KEY,
                OPENAI_MODEL = ''
            }
        } = process;

        const configuration = new Configuration({
            apiKey: OPENAI_API_KEY
        });

        this.openAI = new OpenAIApi(configuration);

        this.OPENAI_MODEL = OPENAI_MODEL;
    }

    private chat = async (chatDetails: ChatDetails): Promise<ChatCompletionResponseMessage | undefined> => {
        const {
            data: {
                choices: [
                    {
                        message
                    }
                ]
            }
        } = await this.openAI.createChatCompletion({
            frequency_penalty: 0,
            max_tokens: chatDetails.maxTokens,
            messages: chatDetails.messagesList,
            model: this.OPENAI_MODEL,
            presence_penalty: 0,
            temperature: chatDetails.temperature || 1,
            top_p: 1
        });

        return message;
    };

    analyze = async (entryBody: string): Promise<AnalysisResponse | undefined> => {
        const messageHistory: ChatCompletionRequestMessage[] = [
            {
                content: 'As a poetic writer, evaluate the following text and return a whimsical title which summarizes it well.',
                role: 'system'
            },
            {
                content: entryBody.replace(/\s{2,}/g, ' ').trim(),
                role: 'user'
            }
        ];

        try {
            const titleMessage = await this.chat({
                maxTokens: 20,
                messagesList: messageHistory,
                temperature: 1
            });

            if (!titleMessage?.content) {
                return undefined;
            }

            const title = titleMessage.content.replace(/\s+/g, ' ').trim();

            messageHistory.push(titleMessage);

            messageHistory.push({
                content: 'As an observer, compare the text to everyday life.  Return true if the events are extreme or more exciting or interesting than normal. Otherwise return false.',
                role: 'user'
            });

            const isHighInterestMessage = await this.chat({
                maxTokens: 20,
                messagesList: messageHistory,
                temperature: 1
            });

            if (!isHighInterestMessage?.content) {
                return undefined;
            }

            const isHighInterest = isHighInterestMessage.content.trim().toLowerCase() === 'true';

            messageHistory.push(isHighInterestMessage);

            const keywordsList = await this.generateSearchKeywords(entryBody);

            return ({
                isHighInterest,
                keywords: keywordsList,
                title
            });
        } catch (error) {
            logger.error(error);
        }

        return undefined;
    };

    generateSearchKeywords = async (searchString: string): Promise<string[]> => {
        const MAX_TOKENS = 500;
        const TEMPERATURE = 1.2;

        const messageHistory: ChatCompletionRequestMessage[] = [
            {
                content: 'As a search engine, generate a list of keywords which could then be used later as fuzzy search matches. Include synonyms and common words. Expand concepts and geographical locations to broader or more common terms. Return the list as a stringified JSON array.',
                role: 'system'
            },
            {
                content: searchString.replace(/\s{2,}/g, ' ').trim(),
                role: 'user'
            }
        ];

        try {
            const message = await this.chat({
                maxTokens: MAX_TOKENS,
                messagesList: messageHistory,
                temperature: TEMPERATURE
            });

            if (!message?.content) {
                return ([]);
            }

            messageHistory.push(message);

            messageHistory.push({
                content: 'Please slightly expand the list and add common synonyms.',
                role: 'user'
            });

            const finalMessage = await this.chat({
                maxTokens: MAX_TOKENS,
                messagesList: messageHistory,
                temperature: TEMPERATURE
            });

            if (!finalMessage?.content) {
                return ([]);
            }

            return JSON.parse(finalMessage.content.replace(/\n/g, '').trim());
        } catch (error) {
            logger.error(error);
        }

        return ([]);
    };
}

export default OpenAIService;
