import { Pencil } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore'; // Import Firestore methods
import { db } from '../../../config/Firbase';

export function TextForm({ initialData, courseId }) {
    const [isEditing, setIsEditing] = useState(false);
    const [description, setDescription] = useState(""); // Initialize description state with empty string

    useEffect(() => {
        setDescription(initialData || ""); // Set description state with initialData or empty string if initialData is null or undefined
    }, [initialData]);

    const toggleEdit = () => setIsEditing((curr) => !curr);

    const handleChange = (e) => {
        setDescription(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const courseRef = doc(db, 'Courses', courseId); // Reference to the course document
            await updateDoc(courseRef, { description }); // Update the description field in Firestore

            console.log('Description saved:', description);

            toggleEdit();
        } catch (error) {
            console.error('Error saving description:', error);
        }
    };

    return (
        <div className='mt-6 border bg-slate-100 rounded-md p-4'>
            <div className="font-medium flex item-center justify-between">
                Course Description
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
                    <div className="flex item-center gap-x-2">
                        <button type="submit">Save</button>
                    </div>
                </form>
            )}
        </div>
    );
}
