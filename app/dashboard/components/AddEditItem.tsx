"use client";
import { Button, FormControl, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import styles from './AddEditItem.module.css';
import { useEffect, useState } from 'react';
import { FieldObject } from '../newType/components/newFieldComponent';
import { createNewItem, editItem, returnTypes } from '@/app/utils/inventoryManager';
import ExistingFieldComponent from './existingFieldComponent';
import Router from 'next/navigation';
import { ObjectId } from 'mongodb';

export type FieldDropDown = {
    typeID: string;
    typeName: string;
    fields: FieldObject[];
}

export type FieldObjectValue = {
    fieldName: string;
    fieldType: string;
    fieldValue: 
    {
        value1:any;
        value2:any;
    };
} 

export type ItemObject = 
{
    itemID?: string;
    teamID: string | ObjectId;
    itemName: string;
    itemType: string;
    itemQuantity: number;
    itemBarcode: string;
    itemLocation: string;
    itemAvailability: string;
    itemUsedBy: string;
    itemUsedByObjectID: string;
    itemBoxCondition: string;
    itemBoxLocation: string;
    itemDescription: string;
    fields: FieldObjectValue[];
}

export type AddEditProps =
{
    isEditing: boolean;
    itemProps?: ItemObject;
}

export default function AddEditItemComponent(props: AddEditProps) 
{
    const [itemName, setItemName] = useState<string>("");
    const [itemType, setItemType] = useState<string>("");
    const [itemQuantity, setItemQuantity] = useState<number>(1);
    const [fieldsData, setFieldsData] = useState<FieldDropDown[]>([]);
    const [itemBarcode, setItemBarcode] = useState<string>("");
    const [itemLocation, setItemLocation] = useState<string>("");
    const [itemAvailability, setItemAvailability] = useState<string>("free");
    const [itemUsedBy, setItemUsedBy] = useState<string>("");
    const [itemUsedByObjectID, setItemUsedByObjectID] = useState<string>("");
    const [itemBoxCondition, setItemBoxCondition] = useState<string>("none");
    const [itemBoxLocation, setItemBoxLocation] = useState<string>("");
    const [itemDescription, setItemDescription] = useState<string>("");
    const [fields, setFields] = useState<FieldObjectValue[]>([]);

    const [disableButton, setDisableButton] = useState<boolean>(false);
    
    async function GetTypes()
    {
        const teamID = localStorage.getItem("currentTeamID");
        
        if (teamID && teamID?.length !== 0)
        {
            const fieldsDataAPI:FieldDropDown[] = await returnTypes(teamID);
            setFieldsData(fieldsDataAPI);
        }
    }

    const router = Router.useRouter();

    async function applyItemProps()
    {
        if (props.itemProps)
        {
            setItemName(props.itemProps.itemName);
            setItemType(props.itemProps.itemType);
            setItemQuantity(props.itemProps.itemQuantity);
            setItemBarcode(props.itemProps.itemBarcode);
            setItemLocation(props.itemProps.itemLocation);
            setItemAvailability(props.itemProps.itemAvailability);
            setItemUsedBy(props.itemProps.itemUsedBy);
            setItemUsedByObjectID(props.itemProps.itemUsedByObjectID);
            setItemBoxCondition(props.itemProps.itemBoxCondition);
            setItemBoxLocation(props.itemProps.itemBoxLocation);
            setItemDescription(props.itemProps.itemDescription);
            setFields(props.itemProps.fields);
        }
    }

    async function onStart()
    {
        await GetTypes();
        await applyItemProps();
    }

    useEffect(() => {
        onStart();
    }, []);

    function handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
        setItemName(event.target.value);
    }

    function handleTypeChange(event: SelectChangeEvent<string>) 
    {
        setItemType(event.target.value);
        var res = fieldsData.find(e => e.typeName === event.target.value);
        if (res)
        {
           setFields(res.fields.map(e => {
                return {
                    fieldName: e.fieldName,
                    fieldType: e.fieldType,
                    fieldValue: {value1: "", value2: ""}
                }
            }));
        }
    }

    function handleQuantityChange(event: React.ChangeEvent<HTMLInputElement>) {
        const value = parseInt(event.target.value);
        if (value > 0)
        {
            setItemQuantity(value);
        }
        else
        {
            setItemQuantity(itemQuantity);
        }
    }

    function handleBarcodeChange(event: React.ChangeEvent<HTMLInputElement>) {
        setItemBarcode(event.target.value);
    }

    function handleLocationChange(event: React.ChangeEvent<HTMLInputElement>) {
        setItemLocation(event.target.value);
    }

    function handleAvailabilityChange(event: SelectChangeEvent<string>) {
        setItemAvailability(event.target.value);
    }

    function handleUsedByChange(event: React.ChangeEvent<HTMLInputElement>) {
        setItemUsedBy(event.target.value);
    }

    function handleUsedByObjectIDChange(event: React.ChangeEvent<HTMLInputElement>) {
        setItemUsedByObjectID(event.target.value);
    }

    function handleBoxConditionChange(event: SelectChangeEvent<string>) {
        setItemBoxCondition(event.target.value);
    }

    function handleBoxLocationChange(event: React.ChangeEvent<HTMLInputElement>) {
        setItemBoxLocation(event.target.value);
    }

    function handleDescriptionChange(event: React.ChangeEvent<HTMLInputElement>) {
        setItemDescription(event.target.value);
    }

    async function AddButton() {
        setDisableButton(true);
        const teamID = localStorage.getItem("currentTeamID");
        var res = false;

        if (teamID && teamID?.length !== 0)
        {
            const itemObject:ItemObject = {
                itemID: props.isEditing ? props.itemProps?.itemID : undefined,
                teamID: teamID,
                itemName: itemName,
                itemType: itemType,
                itemQuantity: itemQuantity,
                itemBarcode: itemBarcode,
                itemLocation: itemLocation,
                itemAvailability: itemAvailability,
                itemUsedBy: itemUsedBy,
                itemUsedByObjectID: itemUsedByObjectID,
                itemBoxCondition: itemBoxCondition,
                itemBoxLocation: itemBoxLocation,
                itemDescription: itemDescription,
                fields: fields
            }

            if (props.isEditing)
            {
                res = await editItem(itemObject);
            }
            else
            {
                res = await createNewItem(itemObject);
            }
        }

        if (res)
        {
            if (props.isEditing)
            {
                router.back();
            }
            else
            {
                router.push("/dashboard");
            }
        }

        setDisableButton(false);
    }

    return (
        <main className={styles.NewItemPage}>
            <div className={styles.EnterTypeName}>
                <h2>{props.isEditing ? "Edit item:" : "Add a new item:"}</h2>
                <div style={{marginTop: "-20px"}}>
                    <TextField className={styles.MainFields} style={{marginRight: "20px", marginTop: "20px"}}
                        required label="Enter name:" variant="outlined" value={itemName} onChange={handleNameChange} />
                    <FormControl className={styles.MainFields} style={{marginRight: "20px", marginTop: "20px"}}>
                        <InputLabel>Type</InputLabel>
                        <Select label="Type" value={itemType} onChange={handleTypeChange}>
                            {
                                fieldsData.map((e, i) => 
                                <MenuItem key={i} value={e.typeName}>{e.typeName}</MenuItem>)
                            }
                        </Select>
                    </FormControl>
                    <TextField className={styles.MainFields} style={{marginRight: "20px", marginTop: "20px"}}
                        label="Quantity:" variant="outlined" type="number" value={itemQuantity} onChange={handleQuantityChange} />
                    <TextField className={styles.MainFields} style={{marginRight: "20px", marginTop: "20px"}}
                        label="Barcode:" variant="outlined" value={itemBarcode} onChange={handleBarcodeChange}/>
                    <TextField className={styles.MainFields} style={{marginRight: "20px", marginTop: "20px"}}
                        label="Location:" variant="outlined"value={itemLocation} onChange={handleLocationChange} />
                    <FormControl className={styles.MainFields} style={{marginRight: "20px", marginTop: "20px"}}>
                        <InputLabel>Availability</InputLabel>
                        <Select label="Availability" value={itemAvailability} onChange={handleAvailabilityChange}>
                            <MenuItem value={"free"}>Free</MenuItem>
                            <MenuItem value={"rented"}>Rented</MenuItem>
                            <MenuItem value={"used"}>Used</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField className={styles.MainFields} style={{marginRight: "20px", marginTop: "20px"}}
                        label="Used by:" variant="outlined" value={itemUsedBy} onChange={handleUsedByChange}/>
                    <TextField className={styles.MainFields} style={{marginRight: "20px", marginTop: "20px"}}
                        label="Used by object ID:" variant="outlined" value={itemUsedByObjectID} onChange={handleUsedByObjectIDChange}/>
                    <FormControl className={styles.MainFields} style={{marginRight: "20px", marginTop: "20px"}}>
                        <InputLabel>Box condition</InputLabel>
                        <Select label="Box condition" value={itemBoxCondition} onChange={handleBoxConditionChange} >
                            <MenuItem value={"likeNew"}>Like new</MenuItem>
                            <MenuItem value={"lightlyDamaged"}>Lightly damaged</MenuItem>
                            <MenuItem value={"moderatelyDamaged"}>Moderately damaged</MenuItem>
                            <MenuItem value={"heavilyDamaged"}>Heavily damaged</MenuItem>
                            <MenuItem value={"none"}>None</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField className={styles.MainFields} style={{marginRight: "20px", marginTop: "20px"}}
                        label="Box location:" variant="outlined" value={itemBoxLocation} onChange={handleBoxLocationChange}/>
                </div>
                <TextField
                    label="Description"
                    multiline
                    maxRows={4}
                    className={styles.DescField}
                    style={{marginTop: "20px"}}
                    value={itemDescription} onChange={handleDescriptionChange}
                />
            </div>

            <div className={styles.typeTable}>
                <TableContainer component={Paper} style={{ background: '#00000000' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell width={"30%"} style={{ borderRight: '1px solid #515151', 
                                    fontWeight: 700, fontSize: "20px", color: "#c2ffaf" }}>
                                    Field name</TableCell>
                                <TableCell className={styles.TitleCell} width={"70%"} style={{
                                    fontWeight: 700, fontSize: "20px", color: "#c2ffaf"}}>
                                    Field value</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                fields.map((e, i) => 
                                <ExistingFieldComponent key={i} index={i} setFields={setFields} 
                                fields={fields}/>)
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>

            <div className={styles.BottomButtonBox}>
                <Button variant="contained" color="success" onClick={()=>router.back()}>
                    Go back
                </Button>
                <Button variant="contained" color="success" onClick={AddButton} disabled={itemName.length === 0 || disableButton}>
                    {props.isEditing ? "Edit" : "Add"}
                </Button>
            </div>
        </main>
    );
}