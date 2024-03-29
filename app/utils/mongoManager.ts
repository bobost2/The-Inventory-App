"use server";
import { InsertOneResult, MongoClient, ObjectId, WithId } from "mongodb";
import { ErrorType, UserLoginDBRepsonse } from "../interfaces/authInterfaces";
import { teamDetails } from "../interfaces/teamInterfaces";
import { FieldObject } from "../dashboard/newType/components/newFieldComponent";
import { FieldDropDown, ItemObject } from "../dashboard/components/AddEditItem";

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
        await client.close();
        return { hashedPassword: user.password, _id: user._id };
    }

    await client.close();
    return { hashedPassword: "", _id: new ObjectId() };
}

export async function getUserTeamsDB(userID:ObjectId):Promise<teamDetails[]>
{
    var connectionString:string = process.env.MONGO_CONNECTION_STRING || "";
    const client = new MongoClient(connectionString);

    const database = client.db("InventoryDB");
    const users = database.collection("users");

    const aggregation = [
        {
          '$match': {
            '_id': new ObjectId(userID)
          }
        }, {
          '$lookup': {
            'from': 'teams', 
            'localField': 'teams', 
            'foreignField': '_id', 
            'as': 'teamDetails'
          }
        }, {
          '$unwind': {
            'path': '$teamDetails'
          }
        }, {
          '$group': {
            '_id': '$teamDetails._id', 
            'name': {
              '$first': '$teamDetails.name'
            }
          }
        }
      ];
    
    const cursor = users.aggregate(aggregation);
    const result = await cursor.toArray();

    await client.close();
    return result as teamDetails[];
}

export async function createTeamDB(teamName:string, userID:ObjectId):Promise<string>
{
    var connectionString:string = process.env.MONGO_CONNECTION_STRING || "";
    const client = new MongoClient(connectionString);

    var createdTeamID:string = "";

    const database = client.db("InventoryDB");
    const teams = database.collection("teams");
    const users = database.collection("users");

    const team = { name: teamName };
    const result = await teams.insertOne(team);

    if(result.acknowledged)
    {
        var updatedUser = await users.updateOne({ _id: userID }, { $push: { teams: new ObjectId(result.insertedId) } });
        if(updatedUser.acknowledged)
        {
            createdTeamID = result.insertedId.toString();
        }
    }

    await client.close();
    return createdTeamID;
}

export async function joinTeamDB(teamID:string, userID:ObjectId):Promise<boolean>
{
    var result:boolean = false;
    var connectionString:string = process.env.MONGO_CONNECTION_STRING || "";
    const client = new MongoClient(connectionString);

    const database = client.db("InventoryDB");
    const users = database.collection("users");
    const teams = database.collection("teams");

    const userInTeamRes = await users.findOne({ _id: userID, teams: new ObjectId(teamID) });

    if(!userInTeamRes)
    {
        const team = await teams.findOne({ _id: new ObjectId(teamID) });
        if(team)
        {
            const userRes = await users.updateOne({ _id: userID }, { $push: { teams: team._id } });
            if(userRes.acknowledged)
            {
                result = true;
            }
        }
    }

    await client.close();
    return result;
}

export async function verifyUserID(userID:ObjectId):Promise<boolean>
{
    var result:boolean = false;
    var connectionString:string = process.env.MONGO_CONNECTION_STRING || "";
    const client = new MongoClient(connectionString);

    const database = client.db("InventoryDB");
    const users = database.collection("users");

    const user = await users.findOne({ _id: userID });
    
    if(user)
    {
        result = true;
    }

    await client.close();
    return result;
}

export async function createNewTypeDB(teamID:string, typeName:string, fields:FieldObject[]):Promise<boolean>
{
    var connectionString:string = process.env.MONGO_CONNECTION_STRING || "";
    const client = new MongoClient(connectionString);

    const database = client.db("InventoryDB");
    const types = database.collection("types");

    const type = { name: typeName, teamID: new ObjectId(teamID), fields: fields };
    const typeRes = await types.insertOne(type);

    await client.close();
    return typeRes.acknowledged;
}

export async function returnTypesDB(teamID:string):Promise<FieldDropDown[]>
{
    var connectionString:string = process.env.MONGO_CONNECTION_STRING || "";
    const client = new MongoClient(connectionString);

    const database = client.db("InventoryDB");
    const types = database.collection("types");

    const typesRes = await types.find({ teamID: new ObjectId(teamID) }).toArray();

    var typesArr:FieldDropDown[] = [];
    typesRes.forEach(element => {
        typesArr.push({ typeID: element._id.toString(), typeName: element.name, fields: element.fields });
    });

    await client.close();
    return typesArr;
}

export async function createNewItemDB(item:ItemObject):Promise<boolean>
{
    var connectionString:string = process.env.MONGO_CONNECTION_STRING || "";
    const client = new MongoClient(connectionString);

    const database = client.db("InventoryDB");
    const items = database.collection("items");

    item.teamID = new ObjectId(item.teamID);
    const itemRes = await items.insertOne(item);

    await client.close();
    return itemRes.acknowledged;
}

export async function returnItemsDB(teamID:string, typeName?:string):Promise<ItemObject[]>
{
    var connectionString:string = process.env.MONGO_CONNECTION_STRING || "";
    const client = new MongoClient(connectionString);

    const database = client.db("InventoryDB");
    const items = database.collection("items");

    var itemsRes:WithId<ItemObject>[];
    
    if (typeName) 
    {  
        itemsRes = await items.find({ teamID: new ObjectId(teamID), itemType: typeName }).toArray() as WithId<ItemObject>[];
    }
    else
    {
        itemsRes = await items.find({ teamID: new ObjectId(teamID) }).toArray() as WithId<ItemObject>[];
    }

    var itemsArr:ItemObject[] = [];
    itemsRes.forEach(element => {
        const item: ItemObject = {
            itemID: element._id.toString(),
            teamID: teamID,
            itemName: element.itemName,
            itemType: element.itemType,
            itemQuantity: element.itemQuantity,
            itemBarcode: element.itemBarcode,
            itemLocation: element.itemLocation,
            itemAvailability: element.itemAvailability,
            itemUsedBy: element.itemUsedBy,
            itemUsedByObjectID: element.itemUsedByObjectID,
            itemBoxCondition: element.itemBoxCondition,
            itemBoxLocation: element.itemBoxLocation,
            itemDescription: element.itemDescription,
            fields: element.fields
        };
        itemsArr.push(item);
    });

    await client.close();
    return itemsArr;
}

export async function returnItemDB(teamID:string, itemID:string):Promise<ItemObject>
{
    var connectionString:string = process.env.MONGO_CONNECTION_STRING || "";
    const client = new MongoClient(connectionString);

    const database = client.db("InventoryDB");
    const items = database.collection("items");

    const itemRes = await items.findOne({ _id: new ObjectId(itemID), teamID: new ObjectId(teamID) }) as WithId<ItemObject>;

    await client.close();
    return itemRes;
}

export async function deleteItemDB(teamID:string, itemID:string):Promise<boolean>
{
    var result:boolean = false;
    var connectionString:string = process.env.MONGO_CONNECTION_STRING || "";
    const client = new MongoClient(connectionString);

    const database = client.db("InventoryDB");
    const items = database.collection("items");

    const itemRes = await items.deleteOne({ _id: new ObjectId(itemID), teamID: new ObjectId(teamID) });

    if(itemRes.acknowledged)
    {
        result = true;
    }

    await client.close();
    return result;
}

export async function replaceItemDB(item:ItemObject):Promise<boolean>
{
    var result:boolean = false;
    var connectionString:string = process.env.MONGO_CONNECTION_STRING || "";
    const client = new MongoClient(connectionString);

    const database = client.db("InventoryDB");
    const items = database.collection("items");

    item.teamID = new ObjectId(item.teamID);
    const _id = new ObjectId(item.itemID);

    delete item.itemID;

    const itemRes = await items.replaceOne({ _id: _id, teamID: item.teamID }, item);

    if(itemRes.acknowledged)
    {
        result = true;
    }

    await client.close();
    return result;
}