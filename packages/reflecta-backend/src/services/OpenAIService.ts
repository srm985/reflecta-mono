import OpenAI from 'openai';
import {
    ChatCompletionMessage,
    ChatCompletionMessageParam
} from 'openai/resources/chat';

import logger from '@utils/logger';

export type AnalysisResponse = {
    isHighInterest: boolean;
    keywords: string[];
    title: string;
};

export type ChatDetails = {
    maxTokens: number;
    messagesList: ChatCompletionMessageParam[];
    temperature?: number;
};

class OpenAIService {
    private readonly openAI: OpenAI;

    private readonly OPENAI_MODEL: string;

    private readonly OPENAI_PROMPT_EVALUATION: string;

    private readonly OPENAI_PROMPT_KEYWORDS_EXPANSION: string;

    private readonly OPENAI_PROMPT_KEYWORDS: string;

    private readonly OPENAI_PROMPT_TITLE: string;

    constructor() {
        const {
            env: {
                OPENAI_API_KEY,
                OPENAI_MODEL = '',
                OPENAI_PROMPT_EVALUATION = '',
                OPENAI_PROMPT_KEYWORDS = '',
                OPENAI_PROMPT_KEYWORDS_EXPANSION = '',
                OPENAI_PROMPT_TITLE = ''
            }
        } = process;

        this.openAI = new OpenAI({
            apiKey: OPENAI_API_KEY
        });

        this.OPENAI_MODEL = OPENAI_MODEL;

        this.OPENAI_PROMPT_EVALUATION = OPENAI_PROMPT_EVALUATION;
        this.OPENAI_PROMPT_KEYWORDS = OPENAI_PROMPT_KEYWORDS;
        this.OPENAI_PROMPT_KEYWORDS_EXPANSION = OPENAI_PROMPT_KEYWORDS_EXPANSION;
        this.OPENAI_PROMPT_TITLE = OPENAI_PROMPT_TITLE;
    }

    private chat = async (chatDetails: ChatDetails): Promise<ChatCompletionMessage | undefined> => {
        const {
            choices: [
                {
                    message
                }
            ]
        } = await this.openAI.chat.completions.create({
            frequency_penalty: 0,
            max_completion_tokens: chatDetails.maxTokens,
            messages: chatDetails.messagesList,
            model: this.OPENAI_MODEL,
            presence_penalty: 0,
            temperature: chatDetails.temperature || 1,
            top_p: 1
        });

        return message;
    };

    analyze = async (entryBody: string): Promise<AnalysisResponse | undefined> => {
        const messageHistory: ChatCompletionMessageParam[] = [
            {
                content: this.OPENAI_PROMPT_TITLE,
                role: 'system'
            },
            {
                content: entryBody.replace(/\s{2,}/g, ' ').trim(),
                role: 'user'
            }
        ];

        try {
            const titleMessage = await this.chat({
                maxTokens: 40,
                messagesList: messageHistory,
                temperature: 1
            });

            if (!titleMessage?.content) {
                return undefined;
            }

            const title = titleMessage.content.replace(/\s+/g, ' ').replace(/^"*(.*?)"*$/g, '$1').trim();

            messageHistory.push(titleMessage);

            messageHistory.push({
                content: this.OPENAI_PROMPT_EVALUATION,
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

        const messageHistory: ChatCompletionMessageParam[] = [
            {
                content: this.OPENAI_PROMPT_KEYWORDS,
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
                content: this.OPENAI_PROMPT_KEYWORDS_EXPANSION,
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
