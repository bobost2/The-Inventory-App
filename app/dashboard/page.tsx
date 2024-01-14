"use client";

import { SessionProvider } from "next-auth/react";
import NavBarComponent from "./components/navbar";
import styles from './page.module.css'

export default function DashboardPage() 
{
    return (
        <SessionProvider>
            <main className={styles.DashboardPage}>
                <NavBarComponent/>
                <h1>Dashboard page</h1>
            </main>
        </SessionProvider>
    );
}