import { Pencil } from 'lucide-react';
import React, { useState } from 'react';
import axios from 'axios';

export function TextForm({ initialData, courseId }) {
    const [isEditing, setIsEditing] = useState(false);
    const [description, setDescription] = useState(initialData);

    const toggleEdit = () => setIsEditing((curr) => !curr);

    const handleChange = (e) => {
        setDescription(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.put(`http://localhost:8080/courses/${courseId}/update-description`, { description });

            setDescription(response.data.description);
            console.log('Description saved:', response.data);

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
    )
}
