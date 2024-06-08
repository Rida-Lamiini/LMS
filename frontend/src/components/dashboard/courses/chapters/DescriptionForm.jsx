import { Pencil } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore'; // Import Firestore methods
import { db } from '../../../../config/Firbase'; // Adjust the import path as needed

export function DescriptionForm({ initialData, courseId, chapterId }) {
    const [isEditing, setIsEditing] = useState(false);
    console.log(initialData);
    const [description, setDescription] = useState(initialData); // Set initial value to empty string if initialData is null or undefined

    useEffect(()=>{
            setDescription(initialData)
    },[initialData])

    const toggleEdit = () => setIsEditing((curr) => !curr);

    const handleChange = (e) => {
        setDescription(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const chapterRef = doc(db, 'Courses', courseId, 'chapters', chapterId); // Reference to the chapter document
            await updateDoc(chapterRef, { description: description }); // Update the description field in Firestore

            console.log('Description saved:', description);

            toggleEdit();
        } catch (error) {
            console.error('Error saving description:', error);
        }
    };

    return (
        <div className='mt-6 border bg-slate-100 rounded-md p-4'>
            <div className="font-medium flex items-center justify-between">
                Chapter Description
                <button onClick={toggleEdit} className='flex items-center'>
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className='h-4 w-4 mr-2' />
                            Edit description
                        </>
                    )}
                </button>
            </div>
            {!isEditing && (
                <p className='text-sm mt-2'>
                    {description ? description : 'No description'}
                </p>
            )}
            {isEditing && (
                <form onSubmit={handleSubmit}>
                    <textarea className='space-y-4 mt-4' value={description} onChange={handleChange} />
                    <div className="flex items-center gap-x-2">
                        <button type="submit">Save</button>
                    </div>
                </form>
            )}
        </div>
    );
}
