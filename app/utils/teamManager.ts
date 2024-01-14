"use server";

import { getServerSession } from "next-auth/next"
import { ObjectId } from "mongodb";
import { createTeamDB, getUserTeamsDB, joinTeamDB } from "./mongoManager";
import { teamDetails } from "../interfaces/teamInterfaces";

export async function getUserTeams():Promise<teamDetails[]>
{
    const session = await getServerSession();
    var teams:teamDetails[] = [];
    
    if (session?.user?.image)
    {
        const userID = new ObjectId(session?.user?.image?.toString());
        const tempTeams = await getUserTeamsDB(userID);

        // I'm doing this, because it sends objectID and the 
        // server is throwing some warnings
        teams = tempTeams.map(team => ({
            _id: team._id.toString(),
            name: team.name
        }));
    }
    return teams;
}

export async function createTeam(teamName:string):Promise<string>
{
    var createdTeamID:string = "";
    const session = await getServerSession();

    if (session?.user?.image && teamName.length > 0)
    {
        const userID = new ObjectId(session?.user?.image?.toString());
        createdTeamID = await createTeamDB(teamName, userID);
    }

    return createdTeamID;
}

export async function joinTeamID(teamID:string):Promise<boolean>
{
    const session = await getServerSession();
    var success = false;
    if (session?.user?.image && teamID.length > 0 && ObjectId.isValid(teamID))
    {
        const userID = new ObjectId(session?.user?.image?.toString());
        success = await joinTeamDB(teamID, userID);
    }

    return success;
}