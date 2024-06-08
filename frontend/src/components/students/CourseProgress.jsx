import { LinearProgress } from '@mui/material';
import React from 'react';

export default function CourseProgress({ value }) {
  return (
    <div>
      <LinearProgress className='h-2' variant="determinate" value={value} />
      <p className='font-medium mt-2 text-sky-700'>
        {Math.round(value)}% Complete
      </p>
    </div>
  );
}
