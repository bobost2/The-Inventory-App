import { ObjectId } from "mongodb";

export type RegisterResponse = {
    isSuccessful: boolean;
    errorType?: ErrorType;
}

export type ErrorType = {
    usernameExists: boolean;
    emailExists: boolean;
}

export type UserLoginDBRepsonse = {
    hashedPassword: string;
    _id: ObjectId;
}