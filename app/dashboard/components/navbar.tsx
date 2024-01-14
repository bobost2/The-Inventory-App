'use client';
import React, { useEffect } from "react";
import styles from './navbar.module.css'
import { useRouter } from 'next/navigation';
import { useSession, signOut } from "next-auth/react";
import CreateJoinTeamComponent from "./createJoinTeam";
import InventoryIcon from '@mui/icons-material/Inventory';
import LogoutIcon from '@mui/icons-material/Logout';
import GroupsIcon from '@mui/icons-material/Groups';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Alert, FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, Skeleton, Snackbar, Tooltip } from "@mui/material";
import { getUserTeams } from "@/app/utils/teamManager";
import { teamDetails } from "@/app/interfaces/teamInterfaces";

export default function NavBarComponent()
{
    const session = useSession();
    const router = useRouter();

    const [openAlert, setOpenAlert] = React.useState(false);
    const [teamID, setTeamID] = React.useState('');
    const [openTeamAdd, setOpenTeamAdd] = React.useState(false);
    const [openTeamLock, setOpenTeamLock] = React.useState(false);
    const [teamIDs, setTeamIDs] = React.useState<teamDetails[]>([]);
    const [teamsLoading, setTeamsLoading] = React.useState(true);

    const handleCloseAlert = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpenAlert(false);
    };

    const handleChange = (event: SelectChangeEvent) => {
        if("CreateJoinTeam" === event.target.value)
        {
            setOpenTeamAdd(true);
        }
        else
        {
            setTeamID(event.target.value as string);
            localStorage.setItem('currentTeamID', event.target.value as string);
        }
    };

    async function getTeams()
    {
        const teamIDArr:teamDetails[] = await getUserTeams();

        if(teamIDArr.length > 0)
        {
            setTeamIDs(teamIDArr);
            const currentTeamID = localStorage.getItem('currentTeamID');
            if(currentTeamID && teamIDArr.find(team => team._id === currentTeamID))
            {
                setTeamID(currentTeamID);
            }
            else
            {
                setTeamID(teamIDArr[0]._id);
                localStorage.setItem('currentTeamID', teamIDArr[0]._id);
            }
            setTeamsLoading(false);
        }
        else
        {
            setOpenTeamLock(true);
            setOpenTeamAdd(true);
            setTeamsLoading(false);
        }
    }

    function copyTeamID()
    {
        navigator.clipboard.writeText(teamID);
        setOpenAlert(true);
    }

    useEffect(() => {
        getTeams();
    }, []);

    const loadTeamsUI = () => 
    {
        if(teamIDs.length > 0)
        {
            return teamIDs.map((team, i) => {
                return <MenuItem key={`team${i}`} value={team._id}>{team.name}</MenuItem>
            });
        }
        return <div></div>
    }

    return (
        <div>
            <nav className={styles.navbar}>
                <div className={styles.logo} onClick={()=>router.push("dashboard")}>
                    <InventoryIcon className={styles.inventoryIcon} style={{fontSize: '30px'}} />
                    <h1 className={styles.navTitle}>The Inventory App</h1>
                </div>

                <div className={styles.teamSelect}>
                    <div>
                        <GroupsIcon style={{margin: '20px 15px 0px 0px', fontSize: '35px'}}/>
                    </div>
                    {
                        teamsLoading ?
                        <Skeleton variant="text" animation="wave" sx={{ fontSize: '1.5rem', width: '250px', marginRight: "10px" }} />
                        :
                        <FormControl variant="standard" fullWidth>
                            <InputLabel style={{color: '#c2ffaf', fontWeight: '600'}} id="team-select-label">Current team:</InputLabel>
                            <Select
                                labelId="team-select-label"
                                id="team-select"
                                value={teamID}
                                label="Current team:"
                                onChange={handleChange}
                                style={{height: '35px', color: '#c2ffaf', fontWeight: '600'}}
                            >
                                {loadTeamsUI()}
                                <MenuItem value={'CreateJoinTeam'}>
                                    <div style={{display:'flex'}}>
                                        <AddCircleOutlineIcon style={{marginRight: "7px"}}/>
                                        <div style={{marginTop:"1px"}}>Create/Join team</div>
                                    </div>
                                </MenuItem>
                            </Select>
                        </FormControl>
                    }
                    <Tooltip title="Copy current team ID">
                        <IconButton aria-label="copy" onClick={copyTeamID} 
                            style={{margin: '10px 0px 0px 10px', fontSize: '20px'}}
                        >
                            <ContentCopyIcon style={{color: '#c2ffaf'}}/>
                        </IconButton>
                    </Tooltip>
                </div>

                <div className={styles.profile}>
                    {
                        session?.data?.user ?
                        <h2 className={styles.profileName}>{session.data.user.name}</h2>
                        :
                        <Skeleton variant="text" animation="wave" sx={{ fontSize: '1.5rem', width: '175px', marginRight: "10px" }} />
                    }
                    <Tooltip title="Log out">
                        {/* The signOut fuction reddirect the user to the login page for some reason.
                            Thats why a callbackUrl has been added to mitigate this issue. */}
                        <IconButton style={{color:"#c2ffaf"}} aria-label="logoutButton" 
                            onClick={()=>signOut({ callbackUrl: `${window.location.origin}/` })}>
                            <LogoutIcon/>
                        </IconButton>
                    </Tooltip>
                </div>
            </nav>
            <CreateJoinTeamComponent openPopup={openTeamAdd} setOpenPopup={setOpenTeamAdd} 
                lockClose={openTeamLock} setLockClose={setOpenTeamLock} refreshTeams={getTeams} />

            <Snackbar open={openAlert} autoHideDuration={2000} onClose={handleCloseAlert} 
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseAlert} severity="success" sx={{ width: '100%' }}>
                    Team ID copied to clipboard!
                </Alert>
            </Snackbar>
        </div>
    );
}