import axios, {
    AxiosInstance,
    Method
} from 'axios';

import {
    BASE_URL_API
} from '@constants';

import Authentication from './Authentication';

export interface ErrorResponse {
    errorMessage: string;
}

class Client {
    private readonly authentication: Authentication;

    constructor() {
        this.authentication = new Authentication();
    }

    private makeCall = async <ResponsePayload>(serviceURL: string, method: Method, payload?: object): Promise<ResponsePayload | ErrorResponse> => {
        try {
            const tokenSignature = this.authentication.retrieve();

            console.log({
                BASE_URL_API
            });

            const instance: AxiosInstance = axios.create({
                baseURL: BASE_URL_API
            });

            instance.interceptors.request.use((config) => {
                if (tokenSignature) {
                    // eslint-disable-next-line no-param-reassign
                    config.headers.Authorization = `Bearer ${tokenSignature}`;
                }

                return config;
            });

            const response = await instance({
                data: payload,
                method,
                url: serviceURL,
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

    delete = async <ResponsePayload>(serviceURL: string, payload: object): Promise<ResponsePayload | ErrorResponse> => this.makeCall<ResponsePayload>(serviceURL, 'DELETE', payload);

    get = async <ResponsePayload>(serviceURL: string): Promise<ResponsePayload | ErrorResponse> => this.makeCall<ResponsePayload>(serviceURL, 'GET');

    post = async <ResponsePayload>(serviceURL: string, payload: object): Promise<ResponsePayload | ErrorResponse> => this.makeCall<ResponsePayload>(serviceURL, 'POST', payload);

    put = async <ResponsePayload>(serviceURL: string, payload: object): Promise<ResponsePayload | ErrorResponse> => this.makeCall<ResponsePayload>(serviceURL, 'PUT', payload);
}

export default Client;
