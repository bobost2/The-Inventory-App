"use client";

import styles from "./page.module.css";
import { useEffect, useState } from "react";
import AddEditItemComponent, { ItemObject } from "../../components/AddEditItem";
import { returnItem } from "@/app/utils/inventoryManager";
import { useRouter } from "next/navigation";
import { CircularProgress } from "@mui/material";

export default function EditItemPage( {params}: any)
{
    const router = useRouter();
    const [item, setItem] = useState<ItemObject>();
    const [loading, setLoading] = useState<boolean>(true);
   
    async function FetchItem()
    {
        const teamID = localStorage.getItem("currentTeamID");
        
        if (teamID && teamID?.length !== 0)
        {
            const res = await returnItem(teamID, params.id);
            if(!res)
            {
                router.back(); // no time for 404 page, just go back
                return;
            }
            setItem(res);
            setLoading(false);
        }
    }
    
    useEffect(() => {
        setLoading(true);
        FetchItem();
    }, []);
    
    if (loading)
    {
        return (
            <main className={styles.loadingItemPage}>
                <div className={styles.loadingMessageBox}>
                    <CircularProgress style={{color: '#c2ffaf', width: "60px", height: "60px"}} />
                    <h1>Loading item...</h1>
                </div>
            </main>
        )
    }
    else if (item)
    {
        return (
            <AddEditItemComponent isEditing={true} itemProps={item} />
        );
    }
    else
    {
        // Note that this should never happen, but just in case here it is
        return (
            <main className={styles.loadingItemPage}>
                <h1>Something went horribly wrong. Go back please!</h1>
            </main>
        )
    }
}