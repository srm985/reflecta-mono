import InvitationTokensModel from '../models/InvitationTokensModel';
import UsersModel from '../models/UsersModel';

import CustomError from '../utils/CustomError';
import JWT from '../utils/JWT';

export interface EnrollingUserDetails {
    emailAddress: string;
    firstName: string;
    invitationToken: string;
    lastName: string;
    password: string;
}

class UserController {
    private readonly invitationTokensModel: InvitationTokensModel;

    private readonly usersModel: UsersModel;

    private readonly jwt: JWT;

    constructor() {
        this.invitationTokensModel = new InvitationTokensModel();
        this.usersModel = new UsersModel();

        this.jwt = new JWT();
    }

    inviteUser = async (invitedUserEmailAddress: string) => {
        const {
            env: {
                SECRET_KEY_INVITATION_TOKEN
            }
        } = process;

        if (!SECRET_KEY_INVITATION_TOKEN) {
            throw new CustomError({
                privateMessage: 'Missing SECRET_KEY_INVITATION_TOKEN environment variable...',
                statusCode: 500
            });
        }

        const secretToken = this.jwt.generateToken(invitedUserEmailAddress, SECRET_KEY_INVITATION_TOKEN);

        if (!secretToken) {
            throw new CustomError({
                privateMessage: 'Unable to generate invitation token...',
                statusCode: 500
            });
        }

        await this.invitationTokensModel.insertInvitationToken(invitedUserEmailAddress, secretToken);
    };

    enroll = async (newUserDetails: EnrollingUserDetails) => {
        const {
            emailAddress,
            firstName,
            invitationToken,
            lastName
        } = newUserDetails;

        const isTokenValid = await this.invitationTokensModel.isInvitationTokenValid(invitationToken, emailAddress);

        if (!isTokenValid) {
            throw new CustomError({
                privateMessage: `Invalid invitation token: ${invitationToken}...`,
                statusCode: 401
            });
        }
        const isActiveUser = await this.usersModel.isActiveUser(emailAddress);

        // It's safe to return a 409 because we know it's the correct user so we're not exposing an existing email address
        if (isActiveUser) {
            throw new CustomError({
                privateMessage: 'User already exists...',
                statusCode: 409,
                userMessage: 'This email address has already been registered...'
            });
        }

        await this.usersModel.addUser({
            emailAddress,
            firstName,
            lastName,
            password: 'notyethashedpassword'
        });

        // send confirmation email
    };
}

export default UserController;
