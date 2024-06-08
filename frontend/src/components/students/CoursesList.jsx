import React from 'react';
import CourseCard from './CourseCard';

export default function CoursesList({ items }) {
  console.log(items);
  return (
    <div>
      <div className='grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 '>
        {items.map(item => (
          <CourseCard
            key={item.courseId}
            id={item.courseId}
            title={item.courseData.Title}
            imageUrl={item.courseData.imageUrl}
            price={item.courseData.price}
            categoryRef={item.courseData.categoryRef}
          />
        ))}
      </div>
      {items.length === 0 && (
        <div className='text-center text-sm text-slate-400 mt-10 '>
          No courses found
        </div>
      )}
    </div>
  );
}
