export interface CustomErrorDetails {
    privateMessage: string;
    statusCode: number;
    userMessage?: string;
}

class CustomError implements CustomErrorDetails {
    public readonly privateMessage: string;

    public readonly statusCode: number;

    public readonly userMessage: string | undefined;

    constructor({
        privateMessage,
        statusCode,
        userMessage
    }: CustomErrorDetails) {
        this.privateMessage = privateMessage;
        this.statusCode = statusCode;
        this.userMessage = userMessage;
    }
}

export default CustomError;
