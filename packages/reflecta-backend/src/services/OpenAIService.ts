import {
    Configuration,
    OpenAIApi
} from 'openai';

import logger from '@utils/logger';

export type AnalysisResponse = {
    isHighInterest: boolean;
    keywords: string;
    title: string;
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

    analyze = async (entryBody: string): Promise<AnalysisResponse | undefined> => {
        try {
            const {
                data: {
                    choices: [
                        {
                            text
                        }
                    ]
                }
            } = await this.openAI.createCompletion({
                max_tokens: 250,
                model: this.OPENAI_MODEL,
                prompt: `[INSTRUCTIONS] As a thoughtful and insightful digital diary, evaluate the following {text}. Begin by generating a poetic title which summarizes the {text}. This title must be at least 8 words long and a maximum of 15 words. Then compare the {text} to everyday life and determine if the events that occurred on this given day are more interesting than normal. If so, you'll return the flag isHighInterest=true. Finally generate a list of broader keywords which will allow fuzzy searching of the text. Ensure you return specific keywords and also expanded out concepts such as geographical locations. For example, if I wrote about a city you might also include the state or country. Generate at least 10 keywords with a maximum of 50 keywords for longer {text}. Return your results as a strictly-formatted JSON string with the following schema: {"title": string, "isHighInterest": boolean; "keywords": string}\n\ntext = '${entryBody.trim()}'`,
                temperature: 0.7
            });

            if (!text) {
                return undefined;
            }

            const {
                isHighInterest,
                keywords,
                title
            } = JSON.parse(text.replace(/\n/g, '').trim()) as AnalysisResponse;

            return ({
                isHighInterest,
                keywords: keywords.trim(),
                title: title.trim()
            });
        } catch (error) {
            logger.error(error);
        }

        return undefined;
    };
}

export default OpenAIService;
