import { PlayCircle, Lock } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

export default function CourseSidebarItem({  label, id, courseId , isLocked}) {
    console.log(isLocked);
    const Icon = isLocked ? Lock : PlayCircle;
    

    return (
        <Link to={`/courses/${courseId}/${id}`} className='text-slate-500 text-sm pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20'>
            <div className='flex items-center gap-x-2 py-4'>
                <Icon size={22} className='text-slate-500' />
                {label}
            </div>
        </Link>
    );
}
