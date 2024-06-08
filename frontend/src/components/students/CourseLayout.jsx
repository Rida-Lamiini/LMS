import React from 'react';
import CourseSidebar from './CourseSidebar';
import { Outlet, useParams } from 'react-router-dom';

export default function CourseLayout() {
  const { id } = useParams();

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-80 bg-gray-100 border-r border-gray-200">
        <CourseSidebar id={id} />
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1">
        {/* Mobile Navbar */}
        <div className="md:hidden h-16 bg-gray-100 border-b border-gray-200">
          {/* TODO: Mobile Navbar content */}
        </div>

        {/* Main content area */}
        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
