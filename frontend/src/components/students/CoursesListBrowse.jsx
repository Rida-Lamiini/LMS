import React from 'react';
import CourseCard from './CourseCard';

export default function CoursesListBrowse({ items }) {
  console.log(items);
  return (
    <div>
      <div className='grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 '>
      {items.map(item => (
        <CourseCard
          key={item.id}
          id={item.id}
          title={item.Title}
          imageUrl= {item.imageUrl} 
          price = {item.price}
          categoryRef = {item.categoryRef
          }
        />
       
      ))}
    </div>
    {items.length === 0 && (
      <div className='text-center text-sm text-slate-400 mt-10 '>
        no courses foud
      </div>
    )}

    </div>
    
  );
}
