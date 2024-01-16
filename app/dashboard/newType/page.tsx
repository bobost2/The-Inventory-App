"use client";
import { Alert, Button, IconButton, Paper, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import styles from './page.module.css';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import NewFieldComponent, { FieldObject } from './components/newFieldComponent';
import { useState } from 'react';
import React from 'react';
import { createNewType } from '@/app/utils/inventoryManager';
import Router from 'next/navigation';

export default function NewTypePage() 
{
    const router = Router.useRouter();

    const [disableCreateButton, setDisableCreateButton] = useState<boolean>(false);
    const [fields, setFields] = useState<FieldObject[]>([]);
    const [typeName, setTypeName] = useState<string>("");

    const [openAlert, setOpenAlert] = React.useState(false);
    const [alertMessage, setAlertMessage] = React.useState('');

    const handleCloseAlert = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpenAlert(false);
    };

    function handleTypeNameChange(event: React.ChangeEvent<HTMLInputElement>) {
        setTypeName(event.target.value);
    }

    const addField = () => {
        setFields(prevFields => [...prevFields, { fieldName: "", fieldType: "" }]);
    }

    function deleteField(index: number) {
        setFields(prevFields => {
            const updatedFields = [...prevFields];
            updatedFields.splice(index, 1);
            return updatedFields;
        });
    }

    async function validateFieldsAndSend() {
        var validCheck = true;
        setDisableCreateButton(true);
        
        if (typeName === "") {
            validCheck = false;
        }
        for (let i = 0; i < fields.length && validCheck; i++) 
        {
            if (fields[i].fieldName === "" || fields[i].fieldType === "") {
                validCheck = false;
            }
        }

        const teamID = localStorage.getItem("currentTeamID");
        
        if (validCheck && teamID && teamID?.length !== 0)
        {
            const createdNewType = await createNewType(teamID, typeName, fields)
            if (createdNewType)
            {
                router.push("/dashboard");
            }
            else
            {
                setAlertMessage("Internal server error! Please try again later...");
                setOpenAlert(true);
            }
        }
        else
        {
            setAlertMessage("Please fill all of the fields!");
            setOpenAlert(true);
        }
        setDisableCreateButton(false);
    }
    
    return (
        <main className={styles.NewTypePage}>
            <div className={styles.EnterTypeName}>
                <h2>Create new type:</h2>
                <TextField className={styles.EnterTypeNameLabel} id="type-name-field" value={typeName} 
                    onChange={handleTypeNameChange} required label="Enter type name:" variant="outlined" />
            </div>

            <div className={styles.typeTable}>
                <TableContainer component={Paper} style={{ background: '#00000000' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell width={"50%"} style={{ borderRight: '1px solid #515151', 
                                    fontWeight: 700, fontSize: "20px", color: "#c2ffaf" }}>
                                    Field name</TableCell>
                                <TableCell className={styles.TitleCell} width={"50%"} style={{
                                    fontWeight: 700, fontSize: "20px", color: "#c2ffaf"}}>
                                    Field type</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                fields.map((e, i) => 
                                <NewFieldComponent key={i} index={i} setFields={setFields} 
                                fields={fields} onDelete={()=>deleteField(i)}/>)
                            }
                        </TableBody>
                    </Table>
                    <div className={styles.TableAddButton}>
                        <IconButton style={{color:"#c2ffaf"}} aria-label="add" onClick={addField}>
                            <AddCircleOutlineIcon style={{fontSize: "30px"}} />
                        </IconButton>
                    </div>
                </TableContainer>
            </div>

            <div className={styles.BottomButtonBox}>
                <Button variant="contained" color="success" href="/dashboard">
                    Go back
                </Button>
                <Button variant="contained" color="success" onClick={validateFieldsAndSend} disabled={disableCreateButton}>
                    Create
                </Button>
            </div>

            <Snackbar open={openAlert} autoHideDuration={4000} onClose={handleCloseAlert} 
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseAlert} severity="error" sx={{ width: '100%' }}>
                    {alertMessage}
                </Alert>
            </Snackbar>
        </main>
    );
}