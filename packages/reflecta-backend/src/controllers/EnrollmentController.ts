import EnrollmentTokensModel from '@models/EnrollmentTokensModel';
import InvitationTokensModel from '@models/InvitationTokensModel';
import UsersModel from '@models/UsersModel';

import MailService from '@services/MailService';

import CustomError from '@utils/CustomError';
import generateRandom from '@utils/generateRandom';
import JWT from '@utils/JWT';
import Secret from '@utils/Secret';

export interface EnrollingUserDetails {
    emailAddress: string;
    firstName: string;
    invitationToken: string;
    lastName: string;
    password: string;
}

export interface EnrollmentTokenPayload {
    userID: number;
}

class EnrollmentController {
    private readonly enrollmentTokensModel: EnrollmentTokensModel;

    private readonly invitationTokensModel: InvitationTokensModel;

    private readonly usersModel: UsersModel;

    private readonly mailService: MailService;

    private readonly jwt: JWT;

    private readonly secret: Secret;

    private readonly BASE_URL_API: string;

    private readonly BASE_URL_APPLICATION: string;

    constructor() {
        const {
            env: {
                BASE_URL_API = '',
                BASE_URL_APPLICATION = ''
            }
        } = process;

        this.enrollmentTokensModel = new EnrollmentTokensModel();
        this.invitationTokensModel = new InvitationTokensModel();
        this.usersModel = new UsersModel();

        this.mailService = new MailService();

        this.jwt = new JWT();
        this.secret = new Secret();

        this.BASE_URL_API = BASE_URL_API;
        this.BASE_URL_APPLICATION = BASE_URL_APPLICATION;
    }

    inviteUser = async (invitedUserEmailAddress: string) => {
        const {
            env: {
                JWT_EXPIRATION_MINUTES_INVITATION_TOKEN = '',
                JWT_SECRET_KEY_INVITATION_TOKEN = ''
            }
        } = process;

        // We'll store our token ID on the table instead of the token to mitigate unauthorized use
        const tokenID = generateRandom();

        // We prepare an invitation token tied to the invitee's email address
        const invitationToken = this.jwt.generateToken({
            expirationTimeMinutes: JWT_EXPIRATION_MINUTES_INVITATION_TOKEN,
            secretKey: JWT_SECRET_KEY_INVITATION_TOKEN,
            tokenID
        });

        if (!invitationToken) {
            throw new CustomError({
                privateMessage: 'Unable to generate invitation token...',
                statusCode: 500
            });
        }

        console.log(invitationToken);

        // Store our invitation token in database
        await this.invitationTokensModel.insertInvitationToken(invitedUserEmailAddress, tokenID);

        // Send off a quick email which should include a link and the invitation token for our prospective user
        await this.mailService.sendInvitation({
            enrollURL: `${this.BASE_URL_APPLICATION}/enroll?invitationToken=${invitationToken}`,
            to: invitedUserEmailAddress
        });
    };

    enroll = async (newUserDetails: EnrollingUserDetails) => {
        const {
            emailAddress,
            firstName,
            invitationToken,
            lastName,
            password
        } = newUserDetails;

        const {
            env: {
                JWT_EXPIRATION_MINUTES_ENROLLMENT_TOKEN = '',
                JWT_SECRET_KEY_ENROLLMENT_TOKEN = '',
                JWT_SECRET_KEY_INVITATION_TOKEN = ''
            }
        } = process;

        const providedTokenDetails = this.jwt.decodeToken<{}>(invitationToken, JWT_SECRET_KEY_INVITATION_TOKEN);

        // User didn't provided a token or the cryptographic signature is incorrect
        if (!providedTokenDetails) {
            throw new CustomError({
                privateMessage: `Invitation token: ${invitationToken} not valid...`,
                statusCode: 401
            });
        }

        const tokenDetails = await this.invitationTokensModel.invitationTokenByID(providedTokenDetails.jti);

        // Enrollment requires a valid and active invitation token
        if (!tokenDetails) {
            throw new CustomError({
                privateMessage: `Invitation token: ${invitationToken} not found or no longer valid...`,
                statusCode: 401
            });
        }

        // No sense in enrolling if you already have an active account
        const isActiveUser = await this.usersModel.isActiveUser(emailAddress);

        // I think it's safe to return 409 even though it does expose if an email address exists
        if (isActiveUser) {
            throw new CustomError({
                privateMessage: 'User already exists...',
                statusCode: 409,
                userMessage: 'This email address has already been registered...'
            });
        }

        const hashedPassword = await this.secret.hash(password);

        // Insert our inactive user into the database
        const userID = await this.usersModel.addUser({
            emailAddress,
            firstName,
            lastName,
            password: hashedPassword
        });

        // This could happen if we fail to correctly insert a new user
        if (!userID) {
            throw new CustomError({
                privateMessage: `Failed to create user with email address: ${emailAddress}...`,
                statusCode: 500
            });
        }

        // We'll store our token ID on the table instead of the token to mitigate unauthorized use
        const tokenID = generateRandom();

        // Create our enrollment token which contains the new user ID
        const enrollmentToken = this.jwt.generateToken({
            expirationTimeMinutes: JWT_EXPIRATION_MINUTES_ENROLLMENT_TOKEN,
            payload: {
                userID
            },
            secretKey: JWT_SECRET_KEY_ENROLLMENT_TOKEN,
            tokenID
        });

        if (!enrollmentToken) {
            throw new CustomError({
                privateMessage: 'Unable to generate enrollment token...',
                statusCode: 500
            });
        }

        console.log(enrollmentToken);

        // Invalidate the invitation token and send email verification email
        await Promise.all([
            this.invitationTokensModel.invalidateInvitationToken(invitationToken),
            this.enrollmentTokensModel.insertEnrollmentToken(userID, tokenID),
            this.mailService.sendEmailConfirmation({
                emailConfirmationURL: `${this.BASE_URL_API}/verify?enrollmentToken=${enrollmentToken}`,
                to: emailAddress
            })
        ]);
    };

    verifyEnrollmentToken = async (enrollmentToken: string) => {
        const {
            env: {
                JWT_SECRET_KEY_ENROLLMENT_TOKEN = ''
            }
        } = process;

        const providedTokenDetails = this.jwt.decodeToken<EnrollmentTokenPayload>(enrollmentToken, JWT_SECRET_KEY_ENROLLMENT_TOKEN);

        // We obviously expect a valid token
        if (!providedTokenDetails) {
            throw new CustomError({
                privateMessage: `Invalid invitation token body: ${enrollmentToken}...`,
                statusCode: 401
            });
        }

        const tokenDetails = await this.enrollmentTokensModel.enrollmentTokenByUserID(providedTokenDetails.data.userID);

        // Enrollment verification requires a valid and active invitation token
        if (!tokenDetails) {
            throw new CustomError({
                privateMessage: `Enrollment verification token: ${enrollmentToken} not found or no longer valid...`,
                statusCode: 401
            });
        }

        // Activate our user and invalidate the activation token
        await Promise.all([
            this.enrollmentTokensModel.invalidateEnrollmentToken(enrollmentToken),
            this.usersModel.activateUser(providedTokenDetails.data.userID)
        ]);
    };
}

export default EnrollmentController;
