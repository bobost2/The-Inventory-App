"use client";
import { useSession } from 'next-auth/react';
import styles from './page.module.css'
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import PostAddIcon from '@mui/icons-material/PostAdd';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function DashboardPage() 
{
    const session = useSession();
    const router = useRouter();

    return (
        <main className={styles.DashboardPage}>
            <div className={styles.DashboardPopup}>
                <h2 style={{margin: 0}}>Please select an operation:</h2>
                <div className={styles.DashboardButtonBox}>
                   <div className={styles.DashboardButton}>
                        <CreateNewFolderIcon style={{fontSize: "7rem", marginBottom: "17px"}}/>
                        <Button variant="contained" color='success' 
                            onClick={()=>router.push("dashboard/newType")}>Create a new type</Button>
                   </div>
                   <div className={styles.DashboardButton}>
                        <PostAddIcon style={{fontSize: "7rem", marginBottom: "17px"}}/>
                        <Button variant="contained" color='success' 
                        onClick={()=>router.push("dashboard/newItem")}>Add a new item</Button>
                   </div>
                   <div className={styles.DashboardButton}>
                        <FindInPageIcon style={{fontSize: "7rem", marginBottom: "17px"}}/>
                        <Button variant="contained" color='success' 
                        onClick={()=>router.push("dashboard/searchItems")}>Search all items</Button>
                   </div>
                </div>
            </div>
        </main>
    );
}