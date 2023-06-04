import EnrollmentTokensModel from '@models/EnrollmentTokensModel';
import InvitationTokensModel from '@models/InvitationTokensModel';
import UsersModel from '@models/UsersModel';

import MailService from '@services/MailService';

import CustomError from '@utils/CustomError';
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

    private readonly SALT_ROUNDS_TOKEN: number;

    constructor() {
        const {
            env: {
                BASE_URL_API = '',
                BASE_URL_APPLICATION = '',
                SALT_ROUNDS_TOKEN = ''
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
        this.SALT_ROUNDS_TOKEN = parseInt(SALT_ROUNDS_TOKEN, 10);
    }

    inviteUser = async (invitedUserEmailAddress: string) => {
        const {
            env: {
                JWT_SECRET_KEY_INVITATION_TOKEN = ''
            }
        } = process;

        // We prepare an invitation token tied to the invitee's email address
        const invitationToken = this.jwt.generateToken({}, JWT_SECRET_KEY_INVITATION_TOKEN);

        if (!invitationToken) {
            throw new CustomError({
                privateMessage: 'Unable to generate invitation token...',
                statusCode: 500
            });
        }

        console.log(invitationToken);

        // Hash our token for secure storage
        const hashedInvitationToken = await this.secret.hash(invitationToken, this.SALT_ROUNDS_TOKEN);

        // Store our invitation token in database
        await this.invitationTokensModel.insertInvitationToken(invitedUserEmailAddress, hashedInvitationToken);

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
                JWT_SECRET_KEY_ENROLLMENT_TOKEN = ''
            }
        } = process;

        const tokenDetails = await this.invitationTokensModel.invitationTokenByEmail(emailAddress);

        // Enrollment requires a valid and active invitation token
        if (!tokenDetails) {
            throw new CustomError({
                privateMessage: `Invitation token: ${invitationToken} not found or no longer valid...`,
                statusCode: 401
            });
        }

        const {
            invitation_token: hashedInvitationToken
        } = tokenDetails;

        const doTokensMatch = await this.secret.doSecretsMatch(invitationToken, hashedInvitationToken);

        // Our tokens are hashed so we'll check to ensure the provided token is correct
        if (!doTokensMatch) {
            throw new CustomError({
                privateMessage: `Provided invitation token: ${invitationToken} is not correct for email address: ${emailAddress}...`,
                statusCode: 401
            });
        }

        // No sense in enrolling if you already have an active account
        const isActiveUser = await this.usersModel.isActiveUser(emailAddress);

        // It's safe to return a 409 because we know it's the correct user from the token so we're not exposing an existing email address
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

        // Create our enrollment token which contains the new user ID
        const enrollmentToken = this.jwt.generateToken({
            userID
        }, JWT_SECRET_KEY_ENROLLMENT_TOKEN);

        if (!enrollmentToken) {
            throw new CustomError({
                privateMessage: 'Unable to generate enrollment token...',
                statusCode: 500
            });
        }

        console.log(enrollmentToken);

        // Hash our token for secure storage
        const hashedEnrollmentToken = await this.secret.hash(enrollmentToken, this.SALT_ROUNDS_TOKEN);

        // Invalidate the invitation token and send email verification email
        await Promise.all([
            this.invitationTokensModel.invalidateInvitationToken(invitationToken),
            this.enrollmentTokensModel.insertEnrollmentToken(userID, hashedEnrollmentToken),
            this.mailService.sendEmailConfirmation({
                emailConfirmationURL: `${this.BASE_URL_API}/api/verify?enrollmentToken=${enrollmentToken}`,
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

        const jwtDetails = this.jwt.decodeToken<EnrollmentTokenPayload>(enrollmentToken, JWT_SECRET_KEY_ENROLLMENT_TOKEN);

        // We expect an object payload if it's valid
        if (!jwtDetails || typeof jwtDetails !== 'object') {
            throw new CustomError({
                privateMessage: `Invalid invitation token body: ${enrollmentToken}...`,
                statusCode: 401
            });
        }

        const {
            data: {
                userID
            }
        } = jwtDetails;

        const tokenDetails = await this.enrollmentTokensModel.enrollmentTokenByUserID(userID);

        // Enrollment requires a valid and active invitation token
        if (!tokenDetails) {
            throw new CustomError({
                privateMessage: `Enrollment token: ${enrollmentToken} not found or no longer valid...`,
                statusCode: 401
            });
        }

        const {
            enrollment_token: hashedEnrollmentToken
        } = tokenDetails;

        const doTokensMatch = await this.secret.doSecretsMatch(enrollmentToken, hashedEnrollmentToken);

        // Our tokens are hashed so we'll check to ensure the provided token is correct
        if (!doTokensMatch) {
            throw new CustomError({
                privateMessage: `Provided enrollment token: ${enrollmentToken} is not correct for user ID: ${userID}...`,
                statusCode: 401
            });
        }

        // Activate our user and invalidate the activation token
        await Promise.all([
            this.enrollmentTokensModel.invalidateEnrollmentToken(enrollmentToken),
            this.usersModel.activateUser(userID)
        ]);
    };
}

export default EnrollmentController;
