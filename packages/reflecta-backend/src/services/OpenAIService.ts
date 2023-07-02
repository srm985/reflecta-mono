import {
    Configuration,
    OpenAIApi
} from 'openai';

import logger from '@utils/logger';

export type AnalysisResponse = {
    isHighInterest: boolean;
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
            const response = await this.openAI.createCompletion({
                max_tokens: 50,
                model: this.OPENAI_MODEL,
                prompt: `Evaluate the following journal entry. Create a title with at least eight words and maximum of 15 words that captures the overall theme of the entry. Also, decide if the given entry is something unique and of high interest or just a generic entry. It should be considered high interest if any sort of major events happened that day that would be found to recall later. Return isHighInterest=true if it is high interest or isHighInterest=false if it is not.\n${entryBody.trim()}`
            });

            const {
                2: title,
                3: isHighInterest
            } = (response.data.choices[0].text || '').split('\n');

            return ({
                isHighInterest: isHighInterest.includes('=true'),
                title: title.replace(/^Title: /, '')
            });
        } catch (error) {
            logger.error(error);
        }

        return undefined;
    };
}

export default OpenAIService;
