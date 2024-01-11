'use client';
import { Button, TextField } from '@mui/material'
import styles from './page.module.css'
import { register } from '../utils/authManager';
import { RegisterResponse, ErrorType } from '../interfaces/authInterfaces';
import { useState } from 'react';

var username: string = '';
var email: string = '';
var password: string = '';

export default function RegisterPage() {
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [errorType, setErrorType] = useState<ErrorType>();
    
    function handleEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
        email = event.target.value;
    }
    
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
    
            // Authentication logic
            register(email, username, password).then((result: RegisterResponse) => {
                console.log(result);
                if(result.isSuccessful)
                {
                    // do stuff
                }
                else
                {
                    setErrorType(result.errorType);
                }
                setIsLoggingIn(false);
            });
        }
    }

    return (
        <main>
            <h1 className={styles.title}>Register page</h1>
            <form className={styles.loginBox} onSubmit={handleSubmit}>
                <TextField required id="email-field" label="Email" type="email" 
                    helperText={errorType?.emailExists ? "Email already exists!" : ""}
                    error={errorType?.emailExists} onChange={handleEmailChange} variant="outlined" />
                <TextField style={{margin: '10px 0px 0px 0px'}} required id="username-field" 
                    helperText={errorType?.usernameExists ? "Username already exists!" : ""}
                    error={errorType?.usernameExists} label="Username" onChange={handleUsernameChange} variant="outlined" />
                <TextField style={{margin: '10px 0px'}} required id="password-field" 
                    onChange={handlePasswordChange} label="Password" variant="outlined" type="password" />
                <div className={styles.buttonBox}>
                    <Button style={{width: "40%"}} color='success' id='register-button'
                        disabled={isLoggingIn} variant="contained" type="submit">Register</Button>
                    <Button style={{width: "40%"}} color='success' href='/'
                        id='goback-button' variant="contained">Go Back</Button>
                </div>
            </form>
        </main>
    )
  }