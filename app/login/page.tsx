'use client';
import { Button, TextField } from '@mui/material'
import { login } from '@/app/utils/authManager';
import styles from './page.module.css'
import { useState } from 'react';

var username: string = '';
var password: string = '';

export default function LoginPage() 
{
    const [loginFailed, setLoginFailed] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    function handleUsernameChange(event: React.ChangeEvent<HTMLInputElement>) {
        username = event.target.value;
    }

    function handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
        password = event.target.value;
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) 
    {
        // Prevent page from reloading
        event.preventDefault();

        // Check if user is already logging in
        if(!isLoggingIn)
        {
            setIsLoggingIn(true);
            setLoginFailed(false);
            setErrorMessage("");
    
            // Authentication logic
            login(username, password).then((result) => {
                setIsLoggingIn(false);
                setLoginFailed(!result.isSuccessful);
                
                if(!result.isSuccessful)
                {
                    setErrorMessage("Invalid username or password!");
                }

                if (result.token)
                {
                    localStorage.setItem("token", result.token);
                }
            });
        }
    }
    
    return (
        <main>
            <h1 className={styles.title}>Login page</h1>
            <form className={styles.loginBox} onSubmit={handleSubmit}>
                <TextField required id="username-field" label="Username" error={loginFailed}
                    onChange={handleUsernameChange} variant="outlined" />
                <TextField style={{margin: '10px 0px'}} required id="password-field" error={loginFailed} 
                    helperText={errorMessage} onChange={handlePasswordChange} label="Password" variant="outlined" type="password" />
                <div className={styles.buttonBox}>
                    <Button style={{width: "40%"}} color='success' id="login-button" disabled={isLoggingIn}
                        variant="contained" type="submit">Login</Button>
                    <Button style={{width: "40%"}} color='success' href='/'
                        id='goback-button' variant="contained">Go Back</Button>
                </div>
            </form>
        </main>
    )
  }