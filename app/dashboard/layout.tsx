"use client";
import { SessionProvider } from "next-auth/react";
import NavBarComponent from "./components/navbar";

export default function DashboardLayout(props:any)
{
    return (
        <SessionProvider>
            <NavBarComponent/>
            {props.children}
        </SessionProvider>
    );
}