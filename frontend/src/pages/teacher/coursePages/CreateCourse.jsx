import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../../config/Firbase';

export function CreateCourse() {
    const [course, setCourse] = useState({
        title: '',
        description: '',
        imageUrl: '',
        price: 0
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCourse({ ...course, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const docRef = await addDoc(collection(db, 'Courses'), {
                Title: course.title,
                Description: course.description,
                ImageUrl: course.imageUrl,
                Price: course.price,
                isPublished: false,
            });

            console.log('Course added:', docRef.id);
            navigate(`/admin/${docRef.id}`, { state: { courseId: docRef.id } });

        } catch (error) {
            console.error('Error adding course:', error);
        }
    };

    return (
        <div className='max-w-5xl mx-auto flex justify-center items-center h-full'>
            <div className='w-full max-w-md p-8 bg-white shadow-lg rounded-lg'>
                <h1 className='text-2xl font-bold mb-4'>Name your course</h1>
                <p className='text-sm text-gray-600 mb-6'>What would you like to name your course? Don't worry, you can change this later.</p>
                <form className='space-y-6' onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="title" className='block text-sm font-medium text-gray-700'>Course Title</label>
                        <input
                            type="text"
                            name="title"
                            value={course.title}
                            onChange={handleChange}
                            placeholder='e.g. Advanced Web Development'
                            className='mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
