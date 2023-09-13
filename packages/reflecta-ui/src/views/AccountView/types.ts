export type EmailAddress = string;
export type FirstName = string;
export type LastName = string;
export type Password = string | null;
export type UserID = number | null;

export type AccountDetails = {
    emailAddress: EmailAddress;
    firstName: FirstName;
    lastName: LastName;
    password?: Password;
    userID?: UserID;
};

export type IAccountView = {};
