"use server";
import { checkIfUserExistsOnRegister, registerUser, returnUserPassHash } from "./mongoManager";
import { RegisterResponse, ErrorType, LoginResponse } from "../interfaces/authInterfaces";
import jwt from 'jsonwebtoken';
var bcrypt = require('bcryptjs')

export async function login(username: string, password: string): Promise<LoginResponse> {
    try {
        const response = await returnUserPassHash(username);
        const res = await bcrypt.compare(password, response.hashedPassword);
        
        if (res === true) {
            // Credentials are correct, create token and return it
            const jwt_secret:string = process.env.JWT_SECRET || "";
            if (jwt_secret == "") 
            { 
                console.error("JWT_SECRET is not set");
                return { isSuccessful: false };
            }
            const token = jwt.sign({ _id: response._id, username: username }, jwt_secret, { expiresIn: '6h' });
            return { isSuccessful: true, token: token };
        } else {
            // Credentials are incorrect
            return { isSuccessful: false };
        }
    } catch (error) {
        console.error("An error occurred:", error);
        return { isSuccessful: false };
    }
}

export async function register(email:string, username: string, password: string): Promise<RegisterResponse>
{
    // Emails are not case sensitive
    email = email.toLowerCase();
    if (password.length < 4) { return { isSuccessful:false } };
    try {
        // Check if user exists
        const errorCheck = await checkIfUserExistsOnRegister(email, username);
        
        if (errorCheck.emailExists || errorCheck.usernameExists) {
            return { isSuccessful: false, errorType: errorCheck };
        }

        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(password, salt);
        
        var result = await registerUser(email, username, hash);

        if (result.acknowledged) 
        {
            // Credentials are correct, create token and return it
            const jwt_secret:string = process.env.JWT_SECRET || "";
            if (jwt_secret == "") 
            { 
                console.error("JWT_SECRET is not set");
                return { isSuccessful: false };
            }
            const token = jwt.sign({ _id: result.insertedId, username: username }, jwt_secret, { expiresIn: '6h' });
            return { isSuccessful: true, token: token };
        }

        return { isSuccessful: false };
    } catch (error) {
        console.error("An error occurred:", error);
        return { isSuccessful: false, errorType: { emailExists: false, usernameExists: false }};
    }
}