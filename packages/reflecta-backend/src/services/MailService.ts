import client, {
    MailService as SendGridMailService
} from '@sendgrid/mail';

export interface InvitationMessageDetails {
    enrollURL: string;
    to: string;
}

export interface EmailConfirmationMessageDetails {
    emailConfirmationURL: string;
    to: string;
}

class MailService {
    private readonly sendGridClient: SendGridMailService;

    private readonly SEND_GRID_DEFAULT_FROM_ACCOUNT: string;

    constructor() {
        const {
            env: {
                SEND_GRID_DEFAULT_FROM_ACCOUNT = '',
                SEND_GRID_TOKEN = ''
            }
        } = process;

        this.sendGridClient = client;

        this.sendGridClient.setApiKey(SEND_GRID_TOKEN);

        this.SEND_GRID_DEFAULT_FROM_ACCOUNT = SEND_GRID_DEFAULT_FROM_ACCOUNT;
    }

    sendInvitation = async (messageDetails: InvitationMessageDetails) => {
        const {
            enrollURL,
            to
        } = messageDetails;

        const {
            env: {
                SEND_GRID_TEMPLATE_ID_INVITATION_LINK = ''
            }
        } = process;

        await this.sendGridClient.send({
            dynamicTemplateData: {
                REFLECTA_ENROLL_URL: enrollURL
            },
            from: this.SEND_GRID_DEFAULT_FROM_ACCOUNT,
            replyTo: this.SEND_GRID_DEFAULT_FROM_ACCOUNT,
            templateId: SEND_GRID_TEMPLATE_ID_INVITATION_LINK,
            to
        });
    };

    sendEmailConfirmation = async (messageDetails: EmailConfirmationMessageDetails) => {
        const {
            emailConfirmationURL,
            to
        } = messageDetails;

        const {
            env: {
                SEND_GRID_TEMPLATE_ID_EMAIL_CONFIRMATION = ''
            }
        } = process;

        await this.sendGridClient.send({
            dynamicTemplateData: {
                REFLECTA_VERIFY_EMAIL_URL: emailConfirmationURL
            },
            from: this.SEND_GRID_DEFAULT_FROM_ACCOUNT,
            replyTo: this.SEND_GRID_DEFAULT_FROM_ACCOUNT,
            templateId: SEND_GRID_TEMPLATE_ID_EMAIL_CONFIRMATION,
            to
        });
    };
}

export default MailService;
