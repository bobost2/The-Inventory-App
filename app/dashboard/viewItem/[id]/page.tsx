"use client";

import styles from "./page.module.css";
import { deleteItem, returnItem } from "@/app/utils/inventoryManager";
import { useEffect, useState } from "react";
import Router from "next/navigation";
import { FieldObjectValue, ItemObject } from "../../newItem/page";
import { Button, Chip, CircularProgress, Divider } from "@mui/material";
import PermMediaIcon from '@mui/icons-material/PermMedia';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import PlaceIcon from '@mui/icons-material/Place';
import CheckIcon from '@mui/icons-material/Check';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import PersonIcon from '@mui/icons-material/Person';
import RuleIcon from '@mui/icons-material/Rule';
import InventoryIcon from '@mui/icons-material/Inventory';
import AbcIcon from '@mui/icons-material/Abc';
import NumbersIcon from '@mui/icons-material/Numbers';
import DateRangeIcon from '@mui/icons-material/DateRange';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LanguageIcon from '@mui/icons-material/Language';

export default function ViewItemPage({params}: any) {
    
    const router = Router.useRouter();
    const [item, setItem] = useState<ItemObject>();
    const [loading, setLoading] = useState<boolean>(true);
    const [disableDelete, setDisableDelete] = useState<boolean>(false);

    async function FetchItem()
    {
        const teamID = localStorage.getItem("currentTeamID");
        
        if (teamID && teamID?.length !== 0)
        {
            const res = await returnItem(teamID, params.id);
            if(!res)
            {
                router.back(); // no time for 404 page, just go back
                return;
            }
            setItem(res);
            setLoading(false);
        }
    }

    function returnItemAvailability(availability: string)
    {
        switch (availability)
        {
            case "free":
                {
                    return(
                        <Chip icon={<CheckIcon />} label="FREE" color="success" 
                            style={{marginLeft: "10px"}} variant="outlined"/>
                    )
                }
            case "used":
                {
                    return(
                        <Chip icon={<PersonIcon />} label="USED" color="success" 
                        style={{marginLeft: "10px"}} variant="outlined"/>
                    )
                }
            case "rented":
                {
                    return(
                        <Chip icon={<SupervisorAccountIcon />} label="RENTED" color="success" 
                        style={{marginLeft: "10px"}} variant="outlined"/>
                    )
                }
        }

        return (
            <div></div>
        )
    }

    function returnBoxCondition(condition: string)
    {
        switch (condition)
        {
            case "likeNew":
                return "Like new";

            case "lightlyDamaged":
                return "Lightly damaged";

            case "moderatelyDamaged":
                return "Moderately damaged";

            case "heavilyDamaged":
                return "Heavily damaged";
        }
        return "";
    }

    function loadAdditionalField(field:FieldObjectValue, index: number)
    {
        if (field.fieldValue.value1.length !== 0)
        {
            switch (field.fieldType)
            {
                case "string":
                    return (
                        <div key={index} className={styles.additionalParam}>
                            <AbcIcon style={{fontSize: '30px'}}/>
                            <div><b>{field.fieldName}:</b> {field.fieldValue.value1}</div>
                        </div>
                    );
    
                case "number":
                    return (
                        <div key={index} className={styles.additionalParam}>
                            <NumbersIcon style={{fontSize: '30px'}}/>
                            <div><b>{field.fieldName}:</b> {field.fieldValue.value1}</div>
                        </div>
                    );
    
                case "date":
                    var date = new Date(field.fieldValue.value1);
                    return (
                        <div key={index} className={styles.additionalParam}>
                            <DateRangeIcon style={{fontSize: '30px'}}/>
                            <div><b>{field.fieldName}:</b> {date.toDateString()}</div>
                        </div>
                    );
    
                case "linkedObject":
                    return (
                        <div key={index} onClick={()=>router.push(`/dashboard/viewItem/${field.fieldValue.value2}`)} 
                            className={styles.clickableParam}>
                            <InventoryIcon style={{fontSize: '30px'}}/>
                            <div><b>{field.fieldName}:</b> {field.fieldValue.value1}</div>
                        </div>
                    );
    
                case "hrefObject":
                    return (
                        <div key={index} onClick={() => router.push(field.fieldValue.value2)} className={styles.clickableParam}>
                            <LanguageIcon style={{fontSize: '30px'}}/>
                            <div><b>{field.fieldName}:</b> {field.fieldValue.value1}</div>
                        </div>
                    );
    
                case "numberWithSuffix":
                    return (
                        <div key={index} className={styles.additionalParam}>
                            <AttachMoneyIcon style={{fontSize: '30px'}}/>
                            <div><b>{field.fieldName}:</b> {field.fieldValue.value1}{field.fieldValue.value2}</div>
                        </div>
                    );
            }
        }

        return (
            <div key={index}></div>
        )
    }

    async function deleteItemF(itemID: string | undefined)
    {
        const teamID = localStorage.getItem("currentTeamID");
        
        if (teamID && teamID?.length !== 0
            && itemID && itemID?.length !== 0)
        {
            setDisableDelete(true);
            const res = await deleteItem(teamID, itemID);

            if (res)
            {
                router.push("/dashboard/searchItems");
            }

            setDisableDelete(false);
        }
    }

    useEffect(() => {
        setLoading(true);
        FetchItem();
    }, []);

    if (loading)
    {
        return (
            <main className={styles.loadingItemPage}>
                <div className={styles.loadingMessageBox}>
                    <CircularProgress style={{color: '#c2ffaf', width: "60px", height: "60px"}} />
                    <h1>Loading item...</h1>
                </div>
            </main>
        )
    }
    else if (item)
    {
        return (
            <main className={styles.itemPage}>
                <div>
                    <div className={styles.itemPageMainInfo}>
                        <div style={{width: '100%'}}>
                            <h1>{item.itemName}</h1>
                            {
                                item.itemType.length !== 0 ? 
                                <h3 style={{marginTop:'10px'}}>Type: {item.itemType}</h3>
                                : 
                                <></>
                            }
                        </div>
                        {
                            item.itemDescription.length !== 0 ?
                            <div style={{marginLeft: '20%'}}>
                                <h3>Description:</h3>
                                <p>{item.itemDescription}</p>
                            </div>
                            :
                            <></>
                        }

                    </div>
                    <Divider>
                        <Chip label="ITEM INFORMATION" color="success"/>
                    </Divider>
                    <div className={styles.itemPageInfo}>
                        <div className={styles.iconParameter}>
                            <PermMediaIcon style={{fontSize: '30px'}}/>
                            <div><b>Quantity:</b> {item.itemQuantity}</div>
                        </div>
                        {
                            item.itemBarcode.length !== 0 ?
                            <div className={styles.iconParameter}>
                                <QrCode2Icon style={{fontSize: '30px'}}/>
                                <div><b>SKU:</b> {item.itemBarcode}</div>
                            </div>
                            :
                            <></>
                        }
                        {
                            item.itemLocation.length !== 0 ?
                            <div className={styles.iconParameter}>
                                <PlaceIcon style={{fontSize: '30px'}}/>
                                <div><b>Location:</b> {item.itemLocation}</div>
                            </div>
                            :
                            <></>
                        }
                    </div>
                    <Divider>
                        <Chip label="AVAILABILITY" color="success"/>
                    </Divider>
                    <div className={styles.itemPageInfo}>
                        <div className={styles.iconParameter}>
                            <RuleIcon style={{fontSize: '30px'}}/>
                            <div><b>Status:</b> {returnItemAvailability(item.itemAvailability)}</div>
                        </div>
                        {
                            item.itemUsedBy.length !== 0 ?
                            <div className={styles.iconParameter}>
                                <PersonIcon style={{fontSize: '30px'}}/>
                                <div><b>Used by:</b> {item.itemUsedBy}</div>
                            </div>
                            :
                            <></>
                        }
                        {
                            item.itemUsedByObjectID.length !== 0 ?
                            <div>
                                <Button variant="outlined" onClick={()=>router.push(`/dashboard/viewItem/${item.itemUsedByObjectID}`)}
                                    color="success" startIcon={<InventoryIcon />}>Used by item (click to navigate)</Button>
                            </div>
                            :
                            <></>
                        }
                    </div>
                    {
                        item.itemBoxCondition !== "none" ?
                        <div>
                            <Divider>
                                <Chip label="BOX INFORMATION" color="success"/>
                            </Divider>
                            <div className={styles.itemPageInfo}>
                                <div className={styles.iconParameter}>
                                    <RuleIcon style={{fontSize: '30px'}}/>
                                    <div><b>Condition:</b> {returnBoxCondition(item.itemBoxCondition)}</div>
                                </div>
                                {
                                    item.itemBoxLocation.length !== 0 ?
                                    <div className={styles.iconParameter}>
                                        <PlaceIcon style={{fontSize: '30px'}}/>
                                        <div><b>Location:</b> {item.itemBoxLocation}</div>
                                    </div>
                                    :
                                    <></>
                                }
                            </div>
                        </div>
                        :
                        <></>
                    }
                    {
                        item.itemType.length !== 0 ?
                        <div>
                            <Divider>
                                <Chip label="ADDITIONAL FIELDS" color="success"/>
                            </Divider>
                            <div className={styles.additionalFields}>
                                <div>
                                    {
                                        item.fields.map((e, i) =>
                                            loadAdditionalField(e, i)
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                        :
                        <></>
                    }
                </div>
                <div className={styles.BottomButtonBox}>
                    <Button variant="contained" color="success" onClick={()=>router.back()}>
                        Go back
                    </Button>
                    <div>
                        <Button variant="contained" color="error" disabled={disableDelete} onClick={()=>deleteItemF(item.itemID)}>
                            Delete
                        </Button>
                        <Button style={{marginLeft:"10px"}} variant="contained" color="success" href={`/dashboard/editItem/${item.itemID}`}>
                            Edit
                        </Button>
                    </div>
                </div>
            </main>
        )
    }
    else
    {
        // Note that this should never happen, but just in case here it is
        return (
            <main className={styles.loadingItemPage}>
                <h1>Something went horribly wrong. Go back please!</h1>
            </main>
        )
    }
}