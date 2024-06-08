import { Pencil } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { doc, updateDoc , collection } from 'firebase/firestore'; // Import Firestore methods
import { db } from '../../../../config/Firbase';
export function TitleForm({ initialData, chapterId, courseId  }) {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(initialData);
    console.log(initialData);


    useEffect(()=>{
        setTitle(initialData)

    },[initialData])


    const toggleEdit = () => setIsEditing((curr) => !curr);

    const handleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
             // Reference to the chapter document
             const chapterRef = doc(db, 'Courses', courseId, 'chapters',chapterId);

             // Update the title field in Firestore
             await updateDoc(chapterRef, { title: title });

            console.log('Title saved:', title);

            toggleEdit();
        } catch (error) {
            console.error('Error saving title:', error);
        }
    };

    return (
        <div className='mt-6 border bg-slate-100 rounded-md p-4'>
            <div className="font-medium flex item-center justify-between">
                Chapter Title
                <button onClick={toggleEdit} className='flex items-center'>
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <><Pencil className='h-4 w-4 mr-2' />
                            Edit title
                        </>
                    )}

                </button>
            </div>
            {!isEditing && (
                <p className='text-sm mt-2'>
                    {title}
                </p>
            )}
            {isEditing && (
                <form onSubmit={handleSubmit}>
                    <input type="text" className='space-y-4 mt-4' value={title} onChange={handleChange} />
                    <div className="flex item-center gap-x-2">
                        <button type="submit">Save</button>
                    </div>
                </form>
            )}
        </div>
    );
}
