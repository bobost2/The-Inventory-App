"use server";
import { returnUserPassHash } from "./mongoManager";
var bcrypt = require('bcryptjs')

export async function login(username: string, password: string):Promise<boolean>
{
    // Get the hashed password from the user
    await returnUserPassHash(username).then(async (hash:string) => {
        // Compare the password with the hash
        await bcrypt.compare(password, hash).then((res:boolean) => {
            if(res === true)
            {
                console.log("User is logged in");
                // User is logged in

                // Create user token somehow
                return true;
            }
            else
            {
                console.log("User is not logged in");
                // User is not logged in
                return false;
            }
        });
    });
    return false;
}

export async function register(email:string, username: string, password: string) 
{
    var salt = bcrypt.genSaltSync(10);
    bcrypt.hash(password, 10, function(err:any, hash:string) 
    {
        console.warn(hash);
        // Register the user with the hashed password

        // Generate a token for the user
        
        // Return true/false based on the result and also 
        // return an error if there is one
    });
}