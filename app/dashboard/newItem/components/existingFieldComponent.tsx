import { FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, TableCell, TableRow, TextField } from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import styles from './existingFieldComponent.module.css';
import React from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { FieldObjectValue } from "../page";
import dayjs from "dayjs";

type NewFieldComponentProps = {
    index: number;
    fields: FieldObjectValue[];
    setFields: React.Dispatch<React.SetStateAction<FieldObjectValue[]>>;
}

export default function ExistingFieldComponent(props: NewFieldComponentProps) {

    function onChangeString(event: React.ChangeEvent<HTMLInputElement>) {
        const newFields = [...props.fields];
        newFields[props.index].fieldValue.value1 = event.target.value;
        props.setFields(newFields);
    }
    
    function onChangeNumber(event: React.ChangeEvent<HTMLInputElement>) {
        const newFields = [...props.fields];
        newFields[props.index].fieldValue.value1 = event.target.value;
        props.setFields(newFields);
    }

    function onReadDate() {
        const unixTime = props.fields[props.index].fieldValue;
        if (unixTime)
        {
            return dayjs.unix(props.fields[props.index].fieldValue.value1);
        }
        return dayjs();
    }

    function onChangeDate(date: dayjs.Dayjs | null): void {
        if (date)
        {
            const unixTime = date.unix();

            const newFields = [...props.fields];
            newFields[props.index].fieldValue.value1 = unixTime;
            props.setFields(newFields);
        }
    }

    function onChangeLinkedObjectA(event: React.ChangeEvent<HTMLInputElement>) {
        const newFields = [...props.fields];
        newFields[props.index].fieldValue.value1 = event.target.value;
        props.setFields(newFields);
    }

    function onChangeLinkedObjectB(event: React.ChangeEvent<HTMLInputElement>) {
        const newFields = [...props.fields];
        newFields[props.index].fieldValue.value2 = event.target.value;
        props.setFields(newFields);
    }

    function onChangeHrefObjectA(event: React.ChangeEvent<HTMLInputElement>) {
        const newFields = [...props.fields];
        newFields[props.index].fieldValue.value1 = event.target.value;
        props.setFields(newFields);
    }

    function onChangeHrefObjectB(event: React.ChangeEvent<HTMLInputElement>) {
        const newFields = [...props.fields];
        newFields[props.index].fieldValue.value2 = event.target.value;
        props.setFields(newFields);
    }

    function onChangeNumberWithSuffixA(event: React.ChangeEvent<HTMLInputElement>) {
        const newFields = [...props.fields];
        newFields[props.index].fieldValue.value1 = event.target.value;
        props.setFields(newFields);
    }

    function onChangeNumberWithSuffixB(event: React.ChangeEvent<HTMLInputElement>) {
        const newFields = [...props.fields];
        newFields[props.index].fieldValue.value2 = event.target.value;
        props.setFields(newFields);
    }

    const GetFieldType = (fieldType: string) => {
        switch (fieldType) {
            case "string":
                return (
                    <TextField fullWidth label="Value" variant="outlined" 
                    value={props.fields[props.index].fieldValue.value1} onChange={onChangeString} />
                );
            case "number":
                return (
                    <TextField type="number" fullWidth label="Value" variant="outlined" 
                    value={props.fields[props.index].fieldValue.value1} onChange={onChangeNumber}/>
                );
            case "date":
                return (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            format="DD/MM/YYYY"
                            sx={{ width: "100%" }}
                            label="Value"
                            value={onReadDate()}
                            onChange={(date) => onChangeDate(date)}
                        />
                    </LocalizationProvider>
                );
            case "linkedObject":
                return (
                    <div className={styles.TwoFields}>
                        <TextField style={{width:"49%"}} label="Name" variant="outlined" 
                        value={props.fields[props.index].fieldValue.value1} onChange={onChangeLinkedObjectA} />
                        <TextField style={{width:"49%"}} label="Item ID" variant="outlined" 
                        value={props.fields[props.index].fieldValue.value2} onChange={onChangeLinkedObjectB} />
                    </div>
                );
            case "hrefObject":
                return (
                    <div className={styles.TwoFields}>
                        <TextField style={{width:"49%"}} label="Name" variant="outlined" 
                        value={props.fields[props.index].fieldValue.value1} onChange={onChangeHrefObjectA} />
                        <TextField style={{width:"49%"}} label="URL" variant="outlined" 
                        value={props.fields[props.index].fieldValue.value2} onChange={onChangeHrefObjectB} />
                    </div>
                );
            case "numberWithSuffix":
                return (
                    <div className={styles.TwoFields}>
                        <TextField style={{width:"49%"}} label="Value" type="number" variant="outlined"
                        value={props.fields[props.index].fieldValue.value1} onChange={onChangeNumberWithSuffixA} />
                        <TextField style={{width:"49%"}} label="Suffix" variant="outlined" 
                        value={props.fields[props.index].fieldValue.value2} onChange={onChangeNumberWithSuffixB} />
                    </div>
                );
            default:
                return (
                    <div>N/A</div>
                );
        }
    }

    return (
        <TableRow>
            <TableCell width={"30%"} style={{ borderRight: '1px solid #515151' }}>
                <div className={styles.FieldName}>
                    {props.fields[props.index].fieldName} <br/>
                    /{props.fields[props.index].fieldType}/
                </div>
            </TableCell>
            <TableCell width={"70%"}>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    {GetFieldType(props.fields[props.index].fieldType)}
                </div>
            </TableCell>
        </TableRow>
    );
}