"use server";
import { MongoClient } from "mongodb";

export async function registerUserDB(email:string, username:string, password:string)
{

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