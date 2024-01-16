"use client";
import { Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import styles from './page.module.css';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import NewFieldComponent, { FieldObject } from './components/newFieldComponent';
import { useState } from 'react';

export default function NewTypePage() 
{
    const [fields, setFields] = useState<FieldObject[]>([]);
    const [typeName, setTypeName] = useState<string>("");

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

    function validateFieldsAndSend() {
        var validCheck = true;
        
        if (typeName === "") {
            validCheck = false;
        }
        for (let i = 0; i < fields.length && validCheck; i++) 
        {
            if (fields[i].fieldName === "" || fields[i].fieldType === "") {
                validCheck = false;
            }
        }
        console.log(validCheck);
        console.log(fields);
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
                <Button variant="contained" color="success" onClick={validateFieldsAndSend}>
                    Create
                </Button>
            </div>
        </main>
    );
}