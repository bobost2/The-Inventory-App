"use server";

import { getServerSession } from "next-auth";
import { FieldObject } from "../dashboard/newType/components/newFieldComponent";
import { ObjectId } from "mongodb";
import { createNewItemDB, createNewTypeDB, deleteItemDB, replaceItemDB, returnItemDB, returnItemsDB, returnTypesDB, verifyUserID } from "./mongoManager";
import { FieldDropDown, ItemObject } from "../dashboard/components/AddEditItem";

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

export async function editItem(item:ItemObject):Promise<boolean>
{
    var success = false;
    if(ObjectId.isValid(item.teamID) && item.itemID && ObjectId.isValid(item.itemID))
    {
        success = await replaceItemDB(item);
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

export async function returnItem(teamID:string, itemID:string):Promise<ItemObject | null>
{
    var item:ItemObject | null = null;
    if(ObjectId.isValid(teamID) && ObjectId.isValid(itemID))
    {
        const itemRes = await returnItemDB(teamID, itemID);

        if (itemRes)
        {
            item = {
                itemID: itemID,
                teamID: teamID,
                itemName: itemRes.itemName,
                itemType: itemRes.itemType,
                itemQuantity: itemRes.itemQuantity,
                itemBarcode: itemRes.itemBarcode,
                itemLocation: itemRes.itemLocation,
                itemAvailability: itemRes.itemAvailability,
                itemUsedBy: itemRes.itemUsedBy,
                itemUsedByObjectID: itemRes.itemUsedByObjectID,
                itemBoxCondition: itemRes.itemBoxCondition,
                itemBoxLocation: itemRes.itemBoxLocation,
                itemDescription: itemRes.itemDescription,
                fields: itemRes.fields
            };
        }
    }
    return item;
}

export async function deleteItem(teamID:string, itemID:string):Promise<boolean>
{
    var success = false;
    if(ObjectId.isValid(teamID) && ObjectId.isValid(itemID))
    {
        success = await deleteItemDB(teamID, itemID);
    }
    return success;
}