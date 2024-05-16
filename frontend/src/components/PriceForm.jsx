import { useState } from 'react';
import { Pencil } from 'lucide-react';
import axios from 'axios';

export function PriceForm({ initialData, courseId }) {
    const [isEditing, setIsEditing] = useState(false);
    const [price, setPrice] = useState(parseFloat(initialData));

    const toggleEdit = () => setIsEditing((curr) => !curr);

    const handleChange = (e) => {
        setPrice(parseFloat(e.target.value)); // Parse value to float
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.put(`http://localhost:8080/courses/${courseId}/update-price`,  price , {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            setPrice(price); // Assuming the response directly returns the updated price
            console.log('Price saved:', response.data);
    
            toggleEdit();
        } catch (error) {
            console.error('Error saving price:', error);
        }
    };

    return (
        <div className='mt-6 border bg-slate-100 rounded-md p-4'>
            <div className="font-medium flex items-center justify-between">
                Course Price
                <button onClick={toggleEdit} className='flex items-center'>
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className='h-4 w-4 mr-2' />
                            Edit price
                        </>
                    )}
                </button>
            </div>
            {!isEditing && (
                <p className='text-sm mt-2'>
                    {price ? `${price} $` : 'no price yet'}
                </p>
            )}
            {isEditing && (
                <form onSubmit={handleSubmit}>
                    <input
                        type="number"
                        className='space-y-4 mt-4'
                        value={price}
                        onChange={handleChange}
                    />
                    <div className="flex items-center gap-x-2">
                        <button type="submit">Save</button>
                    </div>
                </form>
            )}
        </div>
    );
}
