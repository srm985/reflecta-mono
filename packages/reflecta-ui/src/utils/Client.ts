import axios, {
    Method
} from 'axios';

import {
    BASE_URL_API
} from '@constants';

export interface ErrorResponse {
    errorMessage: string;
}

class Client {
    private makeCall = async <ResponsePayload>(serviceURL: string, method: Method, payload?: object): Promise<ResponsePayload | ErrorResponse> => {
        try {
            const response = await axios({
                data: payload,
                method,
                url: `${BASE_URL_API}/${serviceURL}`,
                withCredentials: true
            });

            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response.data as ErrorResponse;
            }

            return ({
                errorMessage: 'An unknown error occurred...'
            });
        }
    };

    delete = async <ResponsePayload>(serviceURL: string): Promise<ResponsePayload | ErrorResponse> => this.makeCall<ResponsePayload>(serviceURL, 'DELETE');

    get = async <ResponsePayload>(serviceURL: string): Promise<ResponsePayload | ErrorResponse> => this.makeCall<ResponsePayload>(serviceURL, 'GET');

    post = async <ResponsePayload>(serviceURL: string, payload: object): Promise<ResponsePayload | ErrorResponse> => this.makeCall<ResponsePayload>(serviceURL, 'POST', payload);

    put = async <ResponsePayload>(serviceURL: string, payload: object): Promise<ResponsePayload | ErrorResponse> => this.makeCall<ResponsePayload>(serviceURL, 'PUT', payload);
}

export default Client;
