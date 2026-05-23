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

export type OpenAIServicePrompts = {
    evaluation: string;
    keywords: string;
    keywordsExpansion: string;
    title: string;
};

const MAX_KEYWORDS = 24;

class OpenAIService {
    private readonly openAI?: OpenAI;

    private readonly OPENAI_MODEL: string;

    private readonly prompts: OpenAIServicePrompts;

    constructor() {
        const {
            env: {
                OPENAI_API_KEY = '',
                OPENAI_MODEL = '',
                OPENAI_PROMPT_EVALUATION = '',
                OPENAI_PROMPT_KEYWORDS = '',
                OPENAI_PROMPT_KEYWORDS_EXPANSION = '',
                OPENAI_PROMPT_TITLE = ''
            }
        } = process;

        if (OPENAI_API_KEY.trim()) {
            this.openAI = new OpenAI({
                apiKey: OPENAI_API_KEY
            });
        }

        this.OPENAI_MODEL = OPENAI_MODEL.trim();

        this.prompts = {
            evaluation: OPENAI_PROMPT_EVALUATION.trim(),
            keywords: OPENAI_PROMPT_KEYWORDS.trim(),
            keywordsExpansion: OPENAI_PROMPT_KEYWORDS_EXPANSION.trim(),
            title: OPENAI_PROMPT_TITLE.trim()
        };

        if (!this.openAI || !this.OPENAI_MODEL) {
            logger.warn('OpenAIService is disabled because OpenAI API configuration is incomplete.');
        }
    }

    private normalizeInput = (value: string): string => value.replace(/\s{2,}/g, ' ').trim();

    private hasBaseConfiguration = (): boolean => !!this.openAI && !!this.OPENAI_MODEL;

    private hasAnalysisConfiguration = (): boolean => this.hasBaseConfiguration() && !!this.prompts.title && !!this.prompts.evaluation;

    private hasKeywordConfiguration = (): boolean => this.hasBaseConfiguration() && !!this.prompts.keywords && !!this.prompts.keywordsExpansion;

    private chat = async (chatDetails: ChatDetails): Promise<ChatCompletionMessage | undefined> => {
        if (!this.openAI || !this.OPENAI_MODEL) {
            return undefined;
        }

        try {
            const response = await this.openAI.chat.completions.create({
                frequency_penalty: 0,
                max_completion_tokens: chatDetails.maxTokens,
                messages: chatDetails.messagesList,
                model: this.OPENAI_MODEL,
                presence_penalty: 0,
                temperature: chatDetails.temperature ?? 1,
                top_p: 1
            });

            return response.choices[0]?.message;
        } catch (error) {
            logger.error(error);
        }

        return undefined;
    };

    private normalizeTitle = (title: string): string => this.normalizeInput(title).replace(/^"*(.*?)"*$/g, '$1').trim();

    private parseBoolean = (value: string): boolean => {
        const normalizedValue = this.normalizeInput(value).toLowerCase().replace(/[.!]/g, '');

        return normalizedValue === 'true' || normalizedValue === 'yes';
    };

    private parseJSON = (value: string): unknown | undefined => {
        try {
            return JSON.parse(value);
        } catch (error) {
            return undefined;
        }
    };

    private normalizeKeywords = (keywordsList: unknown[]): string[] => {
        const normalizedKeywordsList = keywordsList
            .filter((keyword): keyword is string => typeof keyword === 'string')
            .map((keyword) => this.normalizeInput(keyword).toLowerCase())
            .filter(Boolean);

        return Array.from(new Set(normalizedKeywordsList)).slice(0, MAX_KEYWORDS);
    };

    private parseKeywordsResponse = (value: string): string[] => {
        const cleanedValue = value.replace(/```json/gi, '').replace(/```/g, '').trim();
        const arrayMatch = cleanedValue.match(/\[[\s\S]*\]/);
        const objectMatch = cleanedValue.match(/\{[\s\S]*\}/);
        const payload = this.parseJSON(arrayMatch?.[0] || objectMatch?.[0] || cleanedValue);

        if (Array.isArray(payload)) {
            return this.normalizeKeywords(payload);
        }

        if (payload && typeof payload === 'object' && 'keywords' in payload) {
            const {
                keywords
            } = payload as { keywords?: unknown };

            if (Array.isArray(keywords)) {
                return this.normalizeKeywords(keywords);
            }
        }

        return [];
    };

    analyze = async (entryBody: string): Promise<AnalysisResponse | undefined> => {
        const normalizedEntryBody = this.normalizeInput(entryBody);

        if (!normalizedEntryBody || !this.hasAnalysisConfiguration()) {
            return undefined;
        }

        const messageHistory: ChatCompletionMessageParam[] = [
            {
                content: this.prompts.title,
                role: 'system'
            },
            {
                content: normalizedEntryBody,
                role: 'user'
            }
        ];

        const titleMessage = await this.chat({
            maxTokens: 40,
            messagesList: messageHistory,
            temperature: 1
        });

        if (!titleMessage?.content) {
            return undefined;
        }

        const title = this.normalizeTitle(titleMessage.content);

        messageHistory.push(titleMessage);
        messageHistory.push({
            content: this.prompts.evaluation,
            role: 'user'
        });

        const isHighInterestMessage = await this.chat({
            maxTokens: 20,
            messagesList: messageHistory,
            temperature: 0
        });

        const isHighInterest = isHighInterestMessage?.content ? this.parseBoolean(isHighInterestMessage.content) : false;

        if (isHighInterestMessage) {
            messageHistory.push(isHighInterestMessage);
        }

        const keywordsList = await this.generateSearchKeywords(normalizedEntryBody);

        return ({
            isHighInterest,
            keywords: keywordsList,
            title
        });
    };

    generateSearchKeywords = async (searchString: string): Promise<string[]> => {
        const MAX_TOKENS = 500;
        const TEMPERATURE = 1.2;
        const normalizedSearchString = this.normalizeInput(searchString);

        if (!normalizedSearchString || !this.hasKeywordConfiguration()) {
            return [];
        }

        const messageHistory: ChatCompletionMessageParam[] = [
            {
                content: this.prompts.keywords,
                role: 'system'
            },
            {
                content: normalizedSearchString,
                role: 'user'
            }
        ];

        const message = await this.chat({
            maxTokens: MAX_TOKENS,
            messagesList: messageHistory,
            temperature: TEMPERATURE
        });

        if (!message?.content) {
            return [];
        }

        messageHistory.push(message);
        messageHistory.push({
            content: this.prompts.keywordsExpansion,
            role: 'user'
        });

        const finalMessage = await this.chat({
            maxTokens: MAX_TOKENS,
            messagesList: messageHistory,
            temperature: TEMPERATURE
        });

        if (!finalMessage?.content) {
            return [];
        }

        return this.parseKeywordsResponse(finalMessage.content);
    };
}

export default OpenAIService;
