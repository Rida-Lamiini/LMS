import React, { useState } from 'react';
import Header from '../Header';

export default function StudentNav({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value); // Pass the search term to the parent component
  };

  return (
    <div className='flex items-center justify-between mt-3'>
      <div className='relative flex items-center'>
        <input
          className='w-auto rounded-full bg-slate-100 focus-visible:ring-slate-200 outline-none border-none'
          placeholder='Search for a course'
          value={searchTerm}
          onChange={handleSearchChange} // Update the search term on change
        />
      </div>
      <div>
        <Header />
      </div>
    </div>
  );
}
