import OpenAI from 'openai';
import {
    ChatCompletionMessage,
    ChatCompletionMessageParam
} from 'openai/resources/chat';
import {
    ResponseFormatJSONSchema
} from 'openai/resources/shared';

import logger from '@utils/logger';

export type AnalysisResponse = {
    isHighInterest: boolean;
    keywords: string[];
    title: string;
};

export type ChatDetails = {
    maxTokens: number;
    messagesList: ChatCompletionMessageParam[];
    responseFormat?: ResponseFormatJSONSchema;
    temperature?: number;
};

export type OpenAIServicePrompts = {
    analysis: string;
    keywords: string;
    keywordsExpansion: string;
};

const MAX_ENTRY_KEYWORDS = 25;
const MAX_SEARCH_KEYWORDS = 35;

const ANALYSIS_RESPONSE_FORMAT: ResponseFormatJSONSchema = {
    json_schema: {
        name: 'journal_entry_analysis',
        schema: {
            additionalProperties: false,
            properties: {
                isHighInterest: {
                    type: 'boolean'
                },
                keywords: {
                    items: {
                        type: 'string'
                    },
                    type: 'array'
                },
                title: {
                    type: 'string'
                }
            },
            required: [
                'isHighInterest',
                'keywords',
                'title'
            ],
            type: 'object'
        },
        strict: true
    },
    type: 'json_schema'
};

const KEYWORDS_RESPONSE_FORMAT: ResponseFormatJSONSchema = {
    json_schema: {
        name: 'journal_search_keywords',
        schema: {
            additionalProperties: false,
            properties: {
                keywords: {
                    items: {
                        type: 'string'
                    },
                    type: 'array'
                }
            },
            required: [
                'keywords'
            ],
            type: 'object'
        },
        strict: true
    },
    type: 'json_schema'
};

const DEFAULT_PROMPTS: OpenAIServicePrompts = {
    analysis: [
        'Analyze this private journal entry and return exactly one JSON object matching the requested schema.',
        'Title rules: write a concise 3-10 word title; make it specific to the main event, mood, relationship, place, or theme; keep it natural, calm, and journal-like; do not use a period or quotation marks; do not invent details; keep sensitive details discreet unless they are central to the entry.',
        'High-interest rules: set isHighInterest to true only for entries that are unusual compared with ordinary daily life, rare, highly consequential, especially memorable, travel/adventure-related, major relationship/family/work developments, illness/injury/emergency, celebration, conflict, achievement, loss, or a major emotional turning point. Set it to false for ordinary routines, mild moods, chores, errands, meals, normal workdays, casual socializing, or general reflection without a significant event.',
        'Keyword rules: provide 8-25 lowercase keywords when the entry has enough substance, otherwise provide the focused keywords that are actually supported; include concrete people, places, activities, events, emotions, topics, and themes present in the entry; add common synonyms and broader concepts when they help search; expand geographic locations to broader terms when appropriate, such as city, state, region, and country; avoid duplicates, near-duplicates, and filler terms like journal, entry, day, life, or thoughts unless unusually relevant; do not invent unsupported facts.'
    ].join('\n'),
    keywords: [
        'Generate focused search keywords for this private journal text or search query.',
        'Return exactly one JSON object with a keywords array.',
        'Use lowercase strings only.',
        'Include concrete people, places, activities, events, emotions, topics, and themes that are directly supported by the input.',
        'Add common synonyms, broader categories, related everyday terms, and geographic expansions when useful for fuzzy journal search.',
        'Avoid duplicates, near-duplicates, unsupported facts, and filler terms like journal, entry, day, life, or thoughts unless unusually relevant.',
        `Do not exceed ${MAX_SEARCH_KEYWORDS} keywords.`
    ].join('\n'),
    keywordsExpansion: [
        'Slightly expand the keyword list for fuzzy journal search.',
        'Return exactly one JSON object with a keywords array.',
        'Preserve all useful existing keywords.',
        'Add common synonyms, broader categories, related everyday terms, and geographic expansions where appropriate.',
        'Keep the list focused; remove duplicates and near-duplicates; use lowercase strings only; do not add unsupported facts.',
        `Do not exceed ${MAX_SEARCH_KEYWORDS} keywords.`
    ].join('\n')
};

class OpenAIService {
    private readonly openAI?: OpenAI;

    private readonly OPENAI_MODEL: string;

    private readonly prompts: OpenAIServicePrompts;

    constructor() {
        const {
            env: {
                OPENAI_API_KEY = '',
                OPENAI_MODEL = ''
            }
        } = process;

        if (OPENAI_API_KEY.trim()) {
            this.openAI = new OpenAI({
                apiKey: OPENAI_API_KEY
            });
        }

        this.OPENAI_MODEL = OPENAI_MODEL.trim();

        this.prompts = DEFAULT_PROMPTS;

        if (!this.openAI || !this.OPENAI_MODEL) {
            logger.warn('OpenAIService is disabled because OpenAI API configuration is incomplete.');
        }
    }

    private normalizeInput = (value: string): string => value.replace(/\s{2,}/g, ' ').trim();

    private hasBaseConfiguration = (): boolean => !!this.openAI && !!this.OPENAI_MODEL;

    private hasAnalysisConfiguration = (): boolean => this.hasBaseConfiguration();

    private hasKeywordConfiguration = (): boolean => this.hasBaseConfiguration();

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
                response_format: chatDetails.responseFormat,
                temperature: chatDetails.temperature ?? 1,
                top_p: 1
            });

            return response.choices[0]?.message;
        } catch (error) {
            logger.error(error);
        }

        return undefined;
    };

    private normalizeTitle = (title: string): string => this.normalizeInput(title).replace(/^["']*(.*?)["']*$/g, '$1').replace(/[.!?]+$/g, '').trim();

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

    private extractJSON = (value: string): string => {
        const cleanedValue = value.replace(/```json/gi, '').replace(/```/g, '').trim();
        const arrayMatch = cleanedValue.match(/\[[\s\S]*\]/);
        const objectMatch = cleanedValue.match(/\{[\s\S]*\}/);

        return objectMatch?.[0] || arrayMatch?.[0] || cleanedValue;
    };

    private normalizeKeywords = (keywordsList: unknown[], maxKeywords: number = MAX_SEARCH_KEYWORDS): string[] => {
        const normalizedKeywordsList = keywordsList
            .filter((keyword): keyword is string => typeof keyword === 'string')
            .map((keyword) => this.normalizeInput(keyword).toLowerCase())
            .filter(Boolean);

        return Array.from(new Set(normalizedKeywordsList)).slice(0, maxKeywords);
    };

    private parseAnalysisResponse = (value: string): AnalysisResponse | undefined => {
        const payload = this.parseJSON(this.extractJSON(value));

        if (!payload || typeof payload !== 'object') {
            return undefined;
        }

        const {
            isHighInterest,
            keywords,
            title
        } = payload as {
            isHighInterest?: unknown;
            keywords?: unknown;
            title?: unknown;
        };

        if (typeof title !== 'string') {
            return undefined;
        }

        const normalizedTitle = this.normalizeTitle(title);

        if (!normalizedTitle) {
            return undefined;
        }

        return {
            isHighInterest: typeof isHighInterest === 'boolean' ? isHighInterest : this.parseBoolean(`${isHighInterest || ''}`),
            keywords: Array.isArray(keywords) ? this.normalizeKeywords(keywords, MAX_ENTRY_KEYWORDS) : [],
            title: normalizedTitle
        };
    };

    private parseKeywordsResponse = (value: string): string[] => {
        const payload = this.parseJSON(this.extractJSON(value));

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
                content: this.prompts.analysis,
                role: 'system'
            },
            {
                content: normalizedEntryBody,
                role: 'user'
            }
        ];

        const analysisMessage = await this.chat({
            maxTokens: 900,
            messagesList: messageHistory,
            responseFormat: ANALYSIS_RESPONSE_FORMAT,
            temperature: 0.2
        });

        if (!analysisMessage?.content) {
            logger.warn('OpenAIService analysis returned no content.');

            return undefined;
        }

        const analysisResponse = this.parseAnalysisResponse(analysisMessage.content);

        if (!analysisResponse) {
            logger.warn('OpenAIService could not parse journal analysis response.');
        }

        return analysisResponse;
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
            responseFormat: KEYWORDS_RESPONSE_FORMAT,
            temperature: TEMPERATURE
        });

        if (!message?.content) {
            logger.warn('OpenAIService keyword generation returned no content.');

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
            responseFormat: KEYWORDS_RESPONSE_FORMAT,
            temperature: TEMPERATURE
        });

        if (!finalMessage?.content) {
            logger.warn('OpenAIService keyword expansion returned no content.');

            return [];
        }

        const keywordsList = this.parseKeywordsResponse(finalMessage.content);

        if (!keywordsList.length) {
            logger.warn('OpenAIService could not parse keyword expansion response.');
        }

        return keywordsList;
    };
}

export default OpenAIService;
