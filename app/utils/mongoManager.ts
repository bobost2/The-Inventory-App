"use server";
import { MongoClient } from "mongodb";
import { ErrorType } from "../interfaces/authInterfaces";

export async function checkIfUserExistsOnRegister(email:string, username:string) : Promise<ErrorType>
{
    var connectionString:string = process.env.MONGO_CONNECTION_STRING || "";
    const client = new MongoClient(connectionString);

    const database = client.db("InventoryDB");
    const users = database.collection("users");

    const query = { $or: [{ username: username }, { email: email }] };
    const userArr = await users.find(query).toArray();

    var errorType:ErrorType = { usernameExists: false, emailExists: false };

    userArr.forEach(element => {
        if (element.username == username) {
            errorType.usernameExists = true;
        }
        if (element.email == email) {
            errorType.emailExists = true;
        }
    });

    await client.close();
    return errorType;
}

export async function registerUser(email:string, username:string, password:string):Promise<boolean>
{
    var connectionString:string = process.env.MONGO_CONNECTION_STRING || "";
    const client = new MongoClient(connectionString);

    const database = client.db("InventoryDB");
    const users = database.collection("users");
    try {
        const user = { email: email, username: username, password: password };
        const result = await users.insertOne(user);

        return result.acknowledged;
    } catch (e) {
        console.error(e);
        return false;
    } finally {
        await client.close();
    }
}

export async function returnUserPassHash(username:string):Promise<string>
{
    var connectionString:string = process.env.MONGO_CONNECTION_STRING || "";
    const client = new MongoClient(connectionString);

    const database = client.db("InventoryDB");
    const users = database.collection("users");
  
    const query = { username: username };
    
    const user = await users.findOne(query);
    if (user) {
        return user.password;
    }

    await client.close();
    return "";
}