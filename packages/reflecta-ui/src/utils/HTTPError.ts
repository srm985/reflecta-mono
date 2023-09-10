export interface HTTPErrorDetails {
    statusCode?: number;
    errorMessage?: string;
}

class HTTPError implements HTTPErrorDetails {
    public readonly errorMessage: string | undefined;

    public readonly statusCode: number | undefined;

    constructor({
        errorMessage,
        statusCode
    }: HTTPErrorDetails) {
        this.errorMessage = errorMessage;
        this.statusCode = statusCode;
    }
}

export default HTTPError;
