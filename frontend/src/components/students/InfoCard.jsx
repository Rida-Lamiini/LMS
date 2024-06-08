import React from 'react'

export default function InfoCard({Icon,label,numberOfItem}) {
  return (
    <div className='border rounded-md flex items-center gap-x-2'>
        <Icon className="w-4 h-4"/>
        <div>
            <p className='font-medium'>
                {label}
            </p>
            <p className='text-gray-500 text-sm'>
                {numberOfItem} {numberOfItem ===1 ? "Course": "Courses"}
            </p>
        </div>
        
    </div>
  )
}
