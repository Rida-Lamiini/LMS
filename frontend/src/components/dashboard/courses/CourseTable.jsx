import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../config/Firbase'; // Adjust the import path as needed
import { Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CourseTable = ({ searchQuery }) => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Courses'));
        const coursesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCourses(coursesData);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  const handleEdit = (id) => {
    navigate(`/admin/${id}`, { state: { courseId: id } });
  };

  // Filter courses based on the search query
  const filteredCourses = courses.filter(course =>
    course.Title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500 border-collapse">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-4 py-2">
              Title
            </th>
            <th scope="col" className="px-4 py-2">
              Price
            </th>
            <th scope="col" className="px-4 py-2">
              Status
            </th>
            <th scope="col" className="px-4 py-2">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {/* Render filtered courses */}
          {filteredCourses.map(course => (
            <tr key={course.id} className="border-b border-gray-200">
              <td className="px-4 py-2 font-medium text-gray-900">
                {course.Title}
              </td>
              <td className="px-4 py-2">
                ${course.price}
              </td>
              <td className="px-4 py-2">
                {course.isPublished ? 'Published' : 'Not Published'}
              </td>
              <td className="px-4 py-2">
                <Edit size={16} className='cursor-pointer text-blue-500 hover:text-blue-700' onClick={() => handleEdit(course.id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
