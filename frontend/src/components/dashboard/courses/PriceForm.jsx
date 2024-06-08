import React, { useState, useEffect } from 'react';
import { Pencil } from 'lucide-react';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../../config/Firbase';

export function PriceForm({ initialData, courseId }) {
    const [isEditing, setIsEditing] = useState(false);
    const [price, setPrice] = useState(parseFloat(initialData) || 0); // Providing a default value if initialData is not valid or missing

    useEffect(() => {
        // Fetch price data from Firestore if initialData is not provided
        if (!initialData) {
            const fetchPrice = async () => {
                try {
                    const courseDocRef = doc(db, 'Courses', courseId);
                    const docSnap = await getDoc(courseDocRef);
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        if (data.price) {
                            setPrice(parseFloat(data.price));
                        }
                    }
                } catch (error) {
                    console.error('Error fetching price:', error);
                }
            };
            fetchPrice();
        }
    }, [initialData, courseId]);

    const toggleEdit = () => setIsEditing((curr) => !curr);

    const handleChange = (e) => {
        setPrice(parseFloat(e.target.value) || 0); // Parse value to float, providing default value if parsing fails
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const courseRef = doc(db, 'Courses', courseId);
            await updateDoc(courseRef, { price });

            console.log('Price saved:', price);
            toggleEdit();
        } catch (error) {
            console.error('Error saving price:', error);
        }
    };

    return (
        <div className='mt-6 border bg-gray-100 rounded-md p-4'>
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
                    {price ? `${price} $` : 'No price yet'}
                </p>
            )}
            {isEditing && (
                <form onSubmit={handleSubmit}>
                    <input
                        type="number"
                        className='space-y-4 mt-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        value={price}
                        onChange={handleChange}
                    />
                    <div className=" mt-4">
                        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Save</button>
                    </div>
                </form>
            )}
        </div>
    );
}
