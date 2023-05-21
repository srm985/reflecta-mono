import EnrollmentTokensModel from '../models/EnrollmentTokensModel';
import InvitationTokensModel from '../models/InvitationTokensModel';
import UsersModel from '../models/UsersModel';

import MailService from '../services/MailService';

import CustomError from '../utils/CustomError';
import JWT from '../utils/JWT';
import Secret from '../utils/Secret';

export interface EnrollingUserDetails {
    emailAddress: string;
    firstName: string;
    invitationToken: string;
    lastName: string;
    password: string;
}

class EnrollmentController {
    private readonly enrollmentTokensModels: EnrollmentTokensModel;

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

        this.enrollmentTokensModels = new EnrollmentTokensModel();
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
                JWT_SECRET_KEY_INVITATION_TOKEN = ''
            }
        } = process;

        // We prepare an invitation token tied to the invitee's email address
        const invitationToken = this.jwt.generateToken({
            invitedUserEmailAddress
        }, JWT_SECRET_KEY_INVITATION_TOKEN);

        if (!invitationToken) {
            throw new CustomError({
                privateMessage: 'Unable to generate invitation token...',
                statusCode: 500
            });
        }

        // Store our invitation token in database
        await this.invitationTokensModel.insertInvitationToken(invitedUserEmailAddress, invitationToken);

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

        const isTokenValid = await this.invitationTokensModel.isInvitationTokenValid(invitationToken, emailAddress);

        // We only allow enrollment if you were given an invitation
        if (!isTokenValid) {
            throw new CustomError({
                privateMessage: `Invalid invitation token: ${invitationToken}...`,
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

        // Invalidate the invitation token and send email verification email
        await Promise.all([
            this.enrollmentTokensModels.insertEnrollmentToken(userID, enrollmentToken),
            this.mailService.sendEmailConfirmation({
                emailConfirmationURL: `${this.BASE_URL_API}/api/verify?enrollmentToken=${enrollmentToken}`,
                to: emailAddress
            }),
            this.invitationTokensModel.invalidateInvitationToken(invitationToken)
        ]);
    };

    verifyEnrollmentToken = async (enrollmentToken: string) => {
        const {
            env: {
                JWT_SECRET_KEY_ENROLLMENT_TOKEN = ''
            }
        } = process;

        const isTokenValid = await this.enrollmentTokensModels.isEnrollmentTokenValid(enrollmentToken);

        // Does this exist in our database and is it active
        if (!isTokenValid) {
            throw new CustomError({
                privateMessage: `Invalid invitation token: ${enrollmentToken}...`,
                statusCode: 401
            });
        }

        const jwtDetails = this.jwt.decodeToken(enrollmentToken, JWT_SECRET_KEY_ENROLLMENT_TOKEN);

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

        // Quick sanity check to make sure we're not getting a spoofed token or anything
        if (typeof userID !== 'number') {
            throw new CustomError({
                privateMessage: `Invalid invitation token user ID: ${enrollmentToken}...`,
                statusCode: 401
            });
        }

        // Activate our user and invalidate the activation token
        await Promise.all([
            this.enrollmentTokensModels.invalidateEnrollmentToken(enrollmentToken),
            this.usersModel.activateUser(userID)
        ]);
    };
}

export default EnrollmentController;
