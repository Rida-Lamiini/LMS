import React from 'react';
import { BookOpenText, BarChart2 } from 'lucide-react'; // Corrected import

import { Link, Outlet } from 'react-router-dom';
import { Sidebar, SidebarItem } from '../components/SideBar';

export function Admin() {
  return (
    <div className='grid grid-cols-4 gap-x-28'>
      <div className="flex">
        <Sidebar>
          <Link to="/admin/courses">
            <SidebarItem icon={<BookOpenText size={20}/>} text="Courses" />
          </Link>
          <Link to="/admin/analytics">
            <SidebarItem icon={<BarChart2 size={20}/>} text="Analytics" /> {/* Corrected icon name */}
          </Link>
        </Sidebar>
      </div>
      <div className='col-span-3'>
        <Outlet />
      </div>
    </div>
  );
}
