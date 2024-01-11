export type RegisterResponse = {
    isSuccessful: boolean;
    errorType?: ErrorType;
}

export type ErrorType = {
    usernameExists: boolean;
    emailExists: boolean;
}