"use client";
import AddEditItemComponent from '../components/AddEditItem';

export default function NewItemPage() 
{
    return (
        <AddEditItemComponent isEditing={false} />
    );
}