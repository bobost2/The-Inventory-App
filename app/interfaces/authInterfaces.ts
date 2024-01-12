import { ObjectId } from "mongodb";

export type RegisterResponse = {
    isSuccessful: boolean;
    token?: string;
    errorType?: ErrorType;
}

export type ErrorType = {
    usernameExists: boolean;
    emailExists: boolean;
}

export type LoginResponse = {
    isSuccessful: boolean;
    token?: string;
}

export type UserLoginDBRepsonse = {
    hashedPassword: string;
    _id: ObjectId;
}