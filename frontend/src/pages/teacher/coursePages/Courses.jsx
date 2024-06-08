import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { CourseTable } from '../../../components/dashboard/courses/CourseTable';

export function Courses() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div>
      <div>
        <div className='flex justify-around mb-6'>
          <div>
            <input
              type='text'
              placeholder='Search Courses'
              value={searchQuery}
              onChange={handleSearchChange}
              className='border border-gray-300 rounded-md px-3 py-1 mr-3'
            />
          </div>
          <div>
            <Link to='/admin/create'>
              <button className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 '>Create</button>
            </Link>
          </div>
        </div>
        <div>
          <CourseTable searchQuery={searchQuery} />
        </div>
      </div>
      <Outlet />
    </div>
  );
}
