"use server";

import { getServerSession } from "next-auth";
import { FieldObject } from "../dashboard/newType/components/newFieldComponent";
import { ObjectId } from "mongodb";
import { createNewTypeDB, verifyUserID } from "./mongoManager";

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