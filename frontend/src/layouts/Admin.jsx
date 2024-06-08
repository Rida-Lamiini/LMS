import React from 'react';
import { BookOpenText, BarChart2 } from 'lucide-react'; // Corrected import

import { Link, Outlet } from 'react-router-dom';
import { Sidebar, SidebarItem } from '../components/SideBar';
import Header from '../components/Header';

export function Admin() {
  return (
    <div className='grid grid-cols-4 gap-x-8'>
      <div className="col-span-1">
        <Sidebar>
          <Link to="/admin/courses">
            <SidebarItem icon={<BookOpenText size={20}/>} text="Courses" />
          </Link>
          <Link to="/admin/analytics">
            <SidebarItem icon={<BarChart2 size={20}/>} text="Analytics" /> 
          </Link>
        </Sidebar>
      </div>
      <div className='col-span-3 p-4'>
        <Header/>
        <Outlet />
      </div>
    </div>
  );
}
