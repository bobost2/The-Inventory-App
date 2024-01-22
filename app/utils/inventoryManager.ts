"use server";

import { getServerSession } from "next-auth";
import { FieldObject } from "../dashboard/newType/components/newFieldComponent";
import { ObjectId } from "mongodb";
import { createNewItemDB, createNewTypeDB, returnItemsDB, returnTypesDB, verifyUserID } from "./mongoManager";
import { FieldDropDown, ItemObject } from "../dashboard/newItem/page";

export async function createNewType(teamID:string, fieldName:string, fields:FieldObject[]):Promise<boolean>
{
    const session = await getServerSession();
    var success = false;
    if (session?.user?.image && teamID.length > 0 && ObjectId.isValid(teamID))
    {
        const userID = new ObjectId(session?.user?.image?.toString());
        const userExists = await verifyUserID(userID);
        
        if (userExists)
        {
            success = await createNewTypeDB(teamID, fieldName, fields);
        }
    }

    return success;
}

export async function returnTypes(teamID:string):Promise<FieldDropDown[]>
{
    var types:FieldDropDown[] = [];
    if(ObjectId.isValid(teamID))
    {
        types = await returnTypesDB(teamID);
    }
    return types;
}

export async function createNewItem(item:ItemObject):Promise<boolean>
{
    var success = false;
    if(ObjectId.isValid(item.teamID))
    {
        success = await createNewItemDB(item);
    }
    return success;
}

export async function returnItems(teamID:string, typeName?:string):Promise<ItemObject[]>
{
    var items:ItemObject[] = [];
    if(ObjectId.isValid(teamID))
    {
        items = await returnItemsDB(teamID, typeName);
    }
    return items;
}