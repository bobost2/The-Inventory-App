"use client";
import { Button, Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import { DataGrid, GridColDef, GridToolbar, GridValueGetterParams } from '@mui/x-data-grid';
import styles from './page.module.css';
import React, { use, useEffect, useState } from 'react';
import { FieldDropDown } from '../newItem/page';
import { returnItems, returnTypes } from '@/app/utils/inventoryManager';
import Router from 'next/navigation';

export default function SearchItemsPage() {
    
    const router = Router.useRouter();

    const [filterByType, setFilterByType] = useState(false);
    const [itemType, setItemType] = useState<string>("");
    const [fieldsData, setFieldsData] = useState<FieldDropDown[]>([]);
    const [columns, setColumns] = useState<GridColDef[]>([]);
    const [rowsData, setRowsData] = useState<any[]>([]);

    function handleTypeChange(event: SelectChangeEvent<string>) 
    {
        setItemType(event.target.value);
        loadRows(true, event.target.value);
    }

    async function GetTypes()
    {
        const teamID = localStorage.getItem("currentTeamID");
        
        if (teamID && teamID?.length !== 0)
        {
            const fieldsDataAPI:FieldDropDown[] = await returnTypes(teamID);
            setFieldsData(fieldsDataAPI);
        }
    }

    const handleFilterByType = (event: any) => {
        setFilterByType(event.target.checked);
        loadRows(event.target.checked && itemType.length !== 0, itemType);
    };

    // this is for the default item with no type
    const stockColumns: GridColDef[] = [
        { field: 'itemName', headerName: 'Name', width: 300 },
        { field: 'itemType', headerName: 'Type', width: 130 },
        { field: 'itemQuantity', headerName: 'Quantity', type: 'number', width: 90 },
        { field: 'itemLocation', headerName: 'Location', width: 300 },
        { field: 'itemAvailability', headerName: 'Availability', width: 150 },
        { field: 'itemUsedBy', headerName: 'Used by', width: 150 },
        { field: 'itemBoxCondition', headerName: 'Box condition', width: 130 },
        { field: 'itemBoxLocation', headerName: 'Box location', width: 300 },
    ];

    async function loadRows(isFiltered: boolean, itemTypeLocal?: string)
    {
        const teamID = localStorage.getItem("currentTeamID");
        
        if (teamID && teamID?.length !== 0)
        {
            if (isFiltered)
            {
                const result = await returnItems(teamID, itemTypeLocal);
                var columnsLocal = stockColumns;

                const type = fieldsData.find(e => e.typeName === itemTypeLocal);
                if (type)
                {
                    console.log(type);
                    type.fields.forEach((e, i) => {
                        switch(e.fieldType)
                        {
                            case "string":
                                columnsLocal.push({ field: e.fieldName, headerName: e.fieldName, width: 200 });
                                break;
                            
                            case "number":
                                columnsLocal.push({ field: e.fieldName, headerName: e.fieldName, type: 'number', width: 90 });
                                break;
                            
                            case "date":
                                columnsLocal.push({ field: e.fieldName, headerName: e.fieldName, type: 'date', width: 150 });
                                break;

                            case "linkedObject":
                                columnsLocal.push({ field: e.fieldName, headerName: e.fieldName, width: 150 });
                                break

                            case "hrefObject":
                                columnsLocal.push({ field: e.fieldName, headerName: e.fieldName, width: 150 });
                                break;

                            case "numberWithSuffix":
                                columnsLocal.push({ field: e.fieldName, headerName: e.fieldName, type: 'number', width: 90 });
                                break;
                        }
                    })
                    setColumns(columnsLocal);

                    var rowsLocal:any[] = [];
                    result.forEach((e, i) => {
                        var additionalFields:any = {};
                        e.fields.forEach((f, j) => {
                            switch(f.fieldType)
                            {
                                case "string":
                                    additionalFields[f.fieldName] = f.fieldValue.value1;
                                    break;
                                
                                case "number":
                                    additionalFields[f.fieldName] = parseFloat(f.fieldValue.value1);
                                    break;
                                
                                case "date":
                                    additionalFields[f.fieldName] = new Date(f.fieldValue.value1);
                                    break;

                                case "linkedObject":
                                    additionalFields[f.fieldName] = f.fieldValue.value1;
                                    break

                                case "hrefObject":
                                    additionalFields[f.fieldName] = f.fieldValue.value1;
                                    break;

                                case "numberWithSuffix":
                                    additionalFields[f.fieldName] = parseFloat(f.fieldValue.value1);
                                    break;
                            }
                        })

                        rowsLocal.push({
                            id: e.itemID,
                            itemName: e.itemName,
                            itemType: e.itemType,
                            itemQuantity: e.itemQuantity,
                            itemLocation: e.itemLocation,
                            itemAvailability: e.itemAvailability,
                            itemUsedBy: e.itemUsedBy,
                            itemBoxCondition: e.itemBoxCondition,
                            itemBoxLocation: e.itemBoxLocation,
                            ...additionalFields
                        })
                    })
                    setRowsData(rowsLocal);
                }
            }
            else
            {
                const result = await returnItems(teamID);
                setColumns(stockColumns);
                
                var rowsLocal:any[] = [];
                result.forEach((e, i) => {
                    rowsLocal.push({
                        id: e.itemID,
                        itemName: e.itemName,
                        itemType: e.itemType,
                        itemQuantity: e.itemQuantity,
                        itemLocation: e.itemLocation,
                        itemAvailability: e.itemAvailability,
                        itemUsedBy: e.itemUsedBy,
                        itemBoxCondition: e.itemBoxCondition,
                        itemBoxLocation: e.itemBoxLocation,
                    })
                })
                setRowsData(rowsLocal);
            }
        }
        
    }

    useEffect(() => {
        GetTypes();
        loadRows(false);
    }, []);

    return (
        <main className={styles.SearchItemsPage}>
            <div className={styles.SearchItemsSettingsBox}>
                <div className={styles.SearchItemsTitle}>
                    <h2>Search items:</h2>
                    <div className={styles.FilterByTypeBox}>
                        <FormControlLabel control={<Checkbox />} label="Filter by type:" 
                            value={filterByType} onChange={handleFilterByType} />
                        <FormControl className={styles.TypeSelectorBox} disabled={!filterByType}>
                            <InputLabel>Type</InputLabel>
                            <Select label="Type" value={itemType} onChange={handleTypeChange} >
                                {
                                    fieldsData.map((e, i) => 
                                    <MenuItem key={i} value={e.typeName}>{e.typeName}</MenuItem>)
                                }
                            </Select>
                        </FormControl>
                    </div>
                </div>
            </div>
            <div style={{ height: '100%', width: '100%' }}>
                <DataGrid
                    rows={rowsData}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 10 },
                        },
                    }}
                    pageSizeOptions={[5, 10, 15]}
                    slots={{ toolbar: GridToolbar }}
                    slotProps={{
                        toolbar: {
                          showQuickFilter: true,
                        },
                      }}
                    onRowDoubleClick={(params) => {
                        router.push(`/dashboard/viewItem/${params.id}`);
                    }}
                />
                <div className={styles.GoBackButton}>
                    <Button style={{pointerEvents: 'all'}} variant="contained" color="success" href="/dashboard">
                        Go back
                    </Button>
                </div>
            </div>
        </main>
    );
}