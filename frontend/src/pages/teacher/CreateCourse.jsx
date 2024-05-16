import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export function CreateCourse() {
    const [course, setCourse] = useState({
        title: '',
        description: '',
        imageUrl: '',
        price: 0
    });

    const navigate= useNavigate() ;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCourse({ ...course, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/courses/create', course);
            console.log('Course added:', response.data);
            const courseId = response.data.courseId;

            navigate(`/admin/${courseId}`, { state: { course: response.data, courseId: response.data.courseId }});

        } catch (error) {
            console.error('Error adding course:', error);
        }
    };

    return (
        <div className='max-w-5xl mx-auto flex'>
          <div>
          <h1 className='text-2xl'>Name your course</h1>
        <p className='text-sm text-slate-600'>What you would like to name your course? Don't worry, you can change this later.</p>
          <form className='space-y-8 mt-8'  onSubmit={handleSubmit}  >

            <div>
            <label htmlFor="title" className='block text-sm font-medium text-gray-900'>Course Title</label>
          <input type="text" name="title" value={course.title} onChange={handleChange}
          placeholder='e.g. Advanced web development'
          className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5' />

            </div>
            <button type="submit" className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'>Submit</button>
         
          </form>
          </div>
        </div>
    );
}

