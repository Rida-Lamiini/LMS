import React from 'react'
import { useParams , useLocation } from 'react-router-dom'
import { TitleForm } from '../../../components/TitleForm';

import { LayoutDashboard } from 'lucide-react';

export  function CourseEdit() {
    const {id} = useParams();
    const location = useLocation();
    const { course } = location.state;

    // Calculate the number of filled fields
const filledFields = Object.values(course).filter(value => value !== '').length;
console.log('Number of filled fields:', filledFields);

// Calculate the total number of fields
const totalFields = Object.keys(course).length;
console.log('Total number of fields:', totalFields);

  return (
    <div className="p-6">
        <div className="flex items-center justify-between">
            <div className="flex flex-col gap-y-2">
                <h1 className='text-2xl font-medium'>
                    Course Setup
                </h1>
                <span className='text-sm text-slate-700'>
                    Complete all fields ({filledFields-1}/ {totalFields})
                </span>
            </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-16'>
            <div>
            <div className='flex items-center gap-x-2'>
                <LayoutDashboard/>
                <h2 className='text-xl'>Customize your course</h2>

            </div>
            <TitleForm
               initialData = {course.title}
               courseId = {course.id}
            />

            </div>
            
        </div>
    </div>
  )
}
