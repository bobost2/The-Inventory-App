"use server";
import { checkIfUserExistsOnRegister, registerUser } from "./mongoManager";
import { RegisterResponse } from "../interfaces/authInterfaces";
var bcrypt = require('bcryptjs')

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
            return { isSuccessful: true };
        }

        return { isSuccessful: false };
    } catch (error) {
        console.error("An error occurred:", error);
        return { isSuccessful: false, errorType: { emailExists: false, usernameExists: false }};
    }
}