import { FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, TableCell, TableRow, TextField } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import React from "react";

export type FieldObject = {
    fieldName: string;
    fieldType: string;
}

type NewFieldComponentProps = {
    index: number;
    onDelete: () => void;
    fields: FieldObject[];
    setFields: React.Dispatch<React.SetStateAction<FieldObject[]>>;
}

export default function NewFieldComponent(props: NewFieldComponentProps) {

    const handleTypeChange = (event: SelectChangeEvent) => {
        const newFields = [...props.fields];
        newFields[props.index].fieldType = event.target.value as string;
        props.setFields(newFields);
    };

    const handleFieldNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newFields = [...props.fields];
        newFields[props.index].fieldName = event.target.value;
        props.setFields(newFields);
    }

    return (
        <TableRow>
            <TableCell width={"50%"} style={{ borderRight: '1px solid #515151' }}>
                <TextField value={props.fields[props.index].fieldName} onChange={handleFieldNameChange} required 
                    fullWidth label="Field name" variant="outlined" />
            </TableCell>
            <TableCell width={"50%"}>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <FormControl fullWidth required>
                      <InputLabel>Type</InputLabel>
                      <Select label="Type" value={props.fields[props.index].fieldType} onChange={handleTypeChange} >
                        <MenuItem value={"string"}>String</MenuItem>
                        <MenuItem value={"number"}>Number</MenuItem>
                        <MenuItem value={"date"}>Date</MenuItem>
                        <MenuItem value={"linkedObject"}>LinkedObject</MenuItem>
                        <MenuItem value={"hrefObject"}>HrefObject</MenuItem>
                        <MenuItem value={"numberWithSuffix"}>NumberWithSuffix</MenuItem>
                      </Select>
                    </FormControl>
                    <IconButton style={{color:"#c2ffaf", marginLeft: "10px"}} onClick={props.onDelete} aria-label="delete">
                        <DeleteIcon />
                    </IconButton>
                </div>
            </TableCell>
        </TableRow>
    );
}