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
                data: method !== 'GET' ? payload : undefined,
                method,
                params: method === 'GET' ? payload : undefined,
                paramsSerializer: (params) => Object.entries(params).map(([
                    key,
                    value
                ]) => {
                    if (!value) {
                        return undefined;
                    }

                    if (Array.isArray(value) && !value.length) {
                        return undefined;
                    }

                    return Array.isArray(value) ? `${key}=${value.join(`&${key}=`)}` : `${key}=${value}`;
                }).filter((param) => param).join('&'),
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

    get = async <ResponsePayload>(serviceURL: string, params?: object): Promise<ResponsePayload | ErrorResponse> => this.makeCall<ResponsePayload>(serviceURL, 'GET', params);

    patch = async <ResponsePayload>(serviceURL: string, payload: object): Promise<ResponsePayload | ErrorResponse> => this.makeCall<ResponsePayload>(serviceURL, 'PATCH', payload);

    post = async <ResponsePayload>(serviceURL: string, payload: object): Promise<ResponsePayload | ErrorResponse> => this.makeCall<ResponsePayload>(serviceURL, 'POST', payload);
}

export default Client;
