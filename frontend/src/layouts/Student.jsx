import React from 'react';
import { LayoutDashboard ,Globe } from 'lucide-react';
import { Link  , Outlet} from 'react-router-dom';

import { Sidebar  , SidebarItem } from '../components/SideBar';
export function Student() {
  return (
    <div className='grid grid-cols-4 gap-x-28'>
      <div className="flex">
          <Sidebar className ="">
            <Link to="/student/dashboard">
            <SidebarItem icon={<LayoutDashboard size={20}/>} text="Dashboard" />

            </Link>
            <Link to="/student/browse">
            <SidebarItem icon={<Globe size={20}/>} text="Browse" />

            </Link>
            

          </Sidebar>
      </div>
      <div className='col-span-3'>
        <Outlet/>
      </div>
    </div>
  )
}
