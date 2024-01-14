'use client';

import React, { ReactComponentElement } from "react";
import styles from './createJoinTeam.module.css'
import { Button, Dialog, IconButton, TextField } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

type CreateJoinTeamProps = {
    openPopup: boolean;
    setOpenPopup: (openPopup: boolean) => void;
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
                            >
                                Create team
                            </Button>
                        </div>
                        <div className={styles.dialogCreateJoinSeparator}/>
                        <div className={styles.dialogCreateJoinOptions}>
                            <PeopleAltIcon style={{fontSize: "7.5rem"}}/>
                            <Button style={{marginTop: "10px"}} color='success'
                                onClick={() => setPaneID(PaneID.JoinTeamPanel)}
                                variant="contained"
                            >
                                Join team
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
                            <Button color='success' variant="contained" onClick={onCloseDialog} disabled={disableButton}>
                                Create team
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
                            <Button color='success' variant="contained" onClick={onCloseDialog} disabled={disableButton}>
                                Join team
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
                            style={{color: "#c2ffaf", marginRight: "5px"}}
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
        </div>
    );
}