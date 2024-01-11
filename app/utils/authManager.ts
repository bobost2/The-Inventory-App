"use server";
import { checkIfUserExistsOnRegister, registerUser, returnUserPassHash } from "./mongoManager";
import { RegisterResponse, ErrorType } from "../interfaces/authInterfaces";
var bcrypt = require('bcryptjs')

export async function login(username: string, password: string): Promise<boolean> {
    try {
        const hash = await returnUserPassHash(username);
        const res = await bcrypt.compare(password, hash);
        
        if (res === true) {
            console.log("User is logged in");
            // User is logged in

            // Create user token somehow
            return true;
        } else {
            console.log("User is not logged in");
            // User is not logged in
            return false;
        }
    } catch (error) {
        console.error("An error occurred:", error);
        return false;
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

        return { isSuccessful: result };
    } catch (error) {
        console.error("An error occurred:", error);
        return { isSuccessful: false, errorType: { emailExists: false, usernameExists: false }};
    }
}