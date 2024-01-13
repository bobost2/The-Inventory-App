"use server";
import { InsertOneResult, MongoClient, ObjectId } from "mongodb";
import { ErrorType, UserLoginDBRepsonse } from "../interfaces/authInterfaces";

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

export async function registerUser(email:string, username:string, password:string):Promise<InsertOneResult>
{
    var connectionString:string = process.env.MONGO_CONNECTION_STRING || "";
    const client = new MongoClient(connectionString);

    const database = client.db("InventoryDB");
    const users = database.collection("users");
    try {
        const user = { email: email, username: username, password: password };
        const result = await users.insertOne(user);
        return result;
    } catch (e) {
        console.error(e);
        return { acknowledged: false, insertedId: new ObjectId() };
    } finally {
        await client.close();
    }
}

export async function returnUserByLogin(username:string):Promise<UserLoginDBRepsonse>
{
    var connectionString:string = process.env.MONGO_CONNECTION_STRING || "";
    const client = new MongoClient(connectionString);

    const database = client.db("InventoryDB");
    const users = database.collection("users");
  
    const query = { username: username };
    
    const user = await users.findOne(query);
    if (user) {
        return { hashedPassword: user.password, _id: user._id };
    }

    await client.close();
    return { hashedPassword: "", _id: new ObjectId() };
}