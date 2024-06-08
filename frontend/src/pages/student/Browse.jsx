import React, { useState, useEffect } from 'react';
import Categories from '../../components/students/Categories';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/Firbase'; // Adjust the import path as needed
import StudentNav from '../../components/students/StudentNav';
import CoursesList from '../../components/students/CoursesList'; // Adjust the import path as needed
import CoursesListBrowse from '../../components/students/CoursesListBrowse';

export function Browse() {
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'categories'));
        const fetchedCategories = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCategories(fetchedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchCourses = async () => {
      try {
        const q = query(collection(db, 'Courses'), where('isPublished', '==', true));
        const querySnapshot = await getDocs(q);
        const fetchedCourses = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log('Fetched courses:', fetchedCourses);
        setCourses(fetchedCourses);
        setFilteredCourses(fetchedCourses); // Set filteredCourses initially to all fetched courses
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchData();
    fetchCourses();
  }, []);

  useEffect(() => {
    const filtered = courses.filter(course => {
      const matchesCategory = activeCategory ? course.categoryId === activeCategory : true;
      const matchesSearch = course.Title.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
    setFilteredCourses(filtered);
  }, [activeCategory, searchTerm, courses]);

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <div>
      <div className='px-6'>
        <StudentNav onSearch={handleSearch} />
      </div>
      <div className='p-3'>
        <Categories items={categories} onCategoryClick={handleCategoryClick} />
      </div>
      <div className='p-3'>
        <CoursesListBrowse items={filteredCourses} />
      </div>
    </div>
  );
}
