import { Pencil } from 'lucide-react';
import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore'; // Import Firestore methods
import { db } from '../../../../config/Firbase'; // Adjust the import path as needed

export function AccessForm({ initialData, initialFree, courseId, chapterId }) {
    const [isEditing, setIsEditing] = useState(false);
    const [description, setDescription] = useState(initialData || ''); // Set initial value to empty string if initialData is null or undefined
    const [isFree, setIsFree] = useState(initialFree || false); // Set initial value to false if initialFree is null or undefined

    const toggleEdit = () => setIsEditing((curr) => !curr);

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleFreeChange = (e) => {
        setIsFree(e.target.checked);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const chapterRef = doc(db, 'Courses', courseId, 'chapters', chapterId); // Reference to the chapter document
            await updateDoc(chapterRef, { isFree: isFree }); // Update the description and free fields in Firestore

            console.log('Description and access saved:', description, isFree);

            toggleEdit();
        } catch (error) {
            console.error('Error saving description and access:', error);
        }
    };

    return (
        <div className='mt-6 border bg-slate-100 rounded-md p-4'>
            <div className="font-medium flex items-center justify-between">
                ChapterAccess
                <button onClick={toggleEdit} className='flex items-center'>
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className='h-4 w-4 mr-2' />
                            Edit
                        </>
                    )}
                </button>
            </div>
            {!isEditing && (
                <div className='mt-2'>
                    <p className='text-sm'>{isFree ? 'Free Access' : 'Paid Access'}</p>
                </div>
            )}
            {isEditing && (
                <form onSubmit={handleSubmit}>
                    
                    <div className="flex items-center gap-x-2 mt-2">
                        <label className='text-sm'>
                            <input 
                                type="checkbox" 
                                checked={isFree} 
                                onChange={handleFreeChange} 
                                className='mr-2'
                            />
                            Free Access
                        </label>
                    </div>
                    <div className="flex items-center gap-x-2 mt-4">
                        <button type="submit" className='px-4 py-2 bg-blue-500 text-white rounded'>
                            Save
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
