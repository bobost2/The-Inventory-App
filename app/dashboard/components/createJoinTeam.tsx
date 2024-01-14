'use client';

import React, { ReactComponentElement } from "react";
import styles from './createJoinTeam.module.css'
import { Alert, Button, Dialog, IconButton, Snackbar, TextField } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { createTeam, joinTeamID } from "@/app/utils/teamManager";

type CreateJoinTeamProps = {
    openPopup: boolean;
    lockClose: boolean;
    setLockClose: (lockClose: boolean) => void;
    setOpenPopup: (openPopup: boolean) => void;
    refreshTeams: () => void;
}

enum PaneID
{
    CreateJoinPanel = 0,
    CreateTeamPanel = 1,
    JoinTeamPanel = 2
}

var teamName: string = '';
var teamID: string = '';

export default function CreateJoinTeamComponent(props:CreateJoinTeamProps)
{
    const [paneID, setPaneID] = React.useState(PaneID.CreateJoinPanel);
    const [disableButton, setDisableButton] = React.useState(true);
    const [disableButtonOperation, setDisableButtonOperation] = React.useState(false);

    const [openAlert, setOpenAlert] = React.useState(false);
    const [alertMessage, setAlertMessage] = React.useState('');

    const handleCloseAlert = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpenAlert(false);
    };

    function handleTeamNameChange(event: React.ChangeEvent<HTMLInputElement>) {
        teamName = event.target.value;
        setDisableButton(teamName.length === 0);
    }

    function handleTeamIDChange(event: React.ChangeEvent<HTMLInputElement>) {
        teamID = event.target.value;
        setDisableButton(teamID.length === 0);
    }

    function onCloseDialog()
    {
        props.setOpenPopup(false);
        setDisableButton(true);
        setTimeout(() => {
            setPaneID(PaneID.CreateJoinPanel);
        }, 300);
    }

    function onReturnButton()
    {
        setPaneID(PaneID.CreateJoinPanel);
        setDisableButton(true);
    }

    async function sendInfo(isJoining:boolean)
    {
        var isSuccessful:boolean = false;
        setDisableButtonOperation(true);

        if(isJoining)
        {
            const res:boolean = await joinTeamID(teamID);
            if(res)
            {
                localStorage.setItem('currentTeamID', teamID);
                props.refreshTeams();
                isSuccessful = true;
            }
            else
            {
                setAlertMessage("Team ID not found or you have already joined that team!");
                setOpenAlert(true);
            }
        }
        else
        {
            const newTeamID = await createTeam(teamName);
            if(newTeamID !== "")
            {
                localStorage.setItem('currentTeamID', newTeamID);
                props.refreshTeams();
                isSuccessful = true;
            }
            else
            {
                setAlertMessage("Internal server error!");
                setOpenAlert(true);
            }
        }
        if(isSuccessful)
        {
            props.setLockClose(false);
            onCloseDialog();
        }
        
        setDisableButtonOperation(false);
    }

    const selectPage = (panelID: number) => 
    {
        switch(panelID)
        {
            case PaneID.CreateJoinPanel:
                teamName = '';
                teamID = '';
                return (
                    <div className={styles.dialogCreateJoinContents}>
                        <div className={styles.dialogCreateJoinOptions}>
                            <GroupAddIcon style={{fontSize: "7.5rem"}}/>
                            <Button style={{marginTop: "10px"}} color='success'
                                onClick={() => setPaneID(PaneID.CreateTeamPanel)}
                                variant="contained"
                            > Create team
                            </Button>
                        </div>
                        <div className={styles.dialogCreateJoinSeparator}/>
                        <div className={styles.dialogCreateJoinOptions}>
                            <PeopleAltIcon style={{fontSize: "7.5rem"}}/>
                            <Button style={{marginTop: "10px"}} color='success'
                                onClick={() => setPaneID(PaneID.JoinTeamPanel)}
                                variant="contained"
                            > Join team
                            </Button>
                        </div>
                    </div>
                )

            case PaneID.CreateTeamPanel:
                return (
                    <div className={styles.dialogCreateJoinInputContents}>
                        <TextField id="team-name-field" label="Team name" variant="outlined"  onChange={handleTeamNameChange} required/>
                        <div className={styles.dialogCreateJoinInputButtonBox}>
                            <Button color='success' variant="contained" onClick={onReturnButton}>
                                Go back
                            </Button>
                            <Button color='success' variant="contained" onClick={()=>sendInfo(false)} 
                                disabled={disableButton || disableButtonOperation}
                            > Create team
                            </Button>
                        </div>
                    </div>
                )

            case PaneID.JoinTeamPanel:
                return (
                    <div className={styles.dialogCreateJoinInputContents}>
                        <TextField id="team-id-field" label="Team ID" variant="outlined" onChange={handleTeamIDChange} required />
                        <div className={styles.dialogCreateJoinInputButtonBox}>
                            <Button color='success' variant="contained" onClick={onReturnButton}>
                                Go back
                            </Button>
                            <Button color='success' variant="contained" onClick={()=>sendInfo(true)} 
                                disabled={disableButton || disableButtonOperation}
                            > Join team
                            </Button>
                        </div>
                    </div>
                )
        }
    }

    const changeTitle = ():string => 
    {
        switch(paneID)
        {
            case PaneID.CreateJoinPanel:
                return "Create or join team:";

            case PaneID.CreateTeamPanel:
                return "Create team:";

            case PaneID.JoinTeamPanel:
                return "Join team:";
        }
    }

    return (
        <div>
            <Dialog
                open={props.openPopup}
                fullWidth
            >
                <div className={styles.dialogBG}>
                    <div className={styles.dialogTitleBox}>
                        <h2 style={{margin: '5px 0px 5px 10px'}}>{changeTitle()}</h2>
                        <IconButton 
                            aria-label="close" 
                            style={{color: "#c2ffaf", marginRight: "5px", display: (props.lockClose ? "none" : "")}}
                            onClick={onCloseDialog}
                            >
                            <CloseIcon />
                        </IconButton>
                    </div>
                    <div style={{width:"100%"}}>
                        {selectPage(paneID)}
                    </div>
                </div>
            </Dialog>
            <Snackbar open={openAlert} autoHideDuration={4000} onClose={handleCloseAlert} 
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseAlert} severity="error" sx={{ width: '100%' }}>
                    {alertMessage}
                </Alert>
            </Snackbar>
        </div>
    );
}