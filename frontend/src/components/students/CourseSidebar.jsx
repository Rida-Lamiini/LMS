import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, doc, getDoc, orderBy } from 'firebase/firestore';
import { db, auth } from '../../config/Firbase';
import CourseSidebarItem from './CourseSidebarItem';
import CourseProgress from './CourseProgress';

export default function CourseSidebar({ id }) {
  const [courseData, setCourseData] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [purchase, setPurchase] = useState(false); // State to track if the course is purchased
  const [progress, setProgress] = useState(null); // State to track course progress
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || auth.currentUser); // State to store user data

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const courseDocRef = doc(db, 'Courses', id);
        const courseSnapshot = await getDoc(courseDocRef);
        if (courseSnapshot.exists()) {
          setCourseData(courseSnapshot.data());
          fetchChapters();
          checkIfPurchased(); // Check if the course is purchased once the course data is fetched
        } else {
          console.log('Course not found');
        }
      } catch (error) {
        console.error('Error fetching course data:', error);
      }
    };
  
    const fetchChapters = async () => {
      try {
        const chaptersCollectionRef = collection(doc(db, 'Courses', id), 'chapters');
        const chaptersQuery = query(chaptersCollectionRef, orderBy('position'));
        const chaptersSnapshot = await getDocs(chaptersQuery);
        const chaptersData = chaptersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setChapters(chaptersData);
      } catch (error) {
        console.error('Error fetching chapters:', error);
      }
    };
  
    const checkIfPurchased = async () => {
      try {
        const userId = user.uid;
        const userDocRef = doc(db, 'users', userId);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          const purchaseCourses = Array.isArray(userData.purchaseCourses) ? userData.purchaseCourses : [];
          const isPurchased = purchaseCourses.some(course => course.courseId === id);
          setPurchase(isPurchased);
        }
        
      } catch (error) {
        console.error('Error checking if purchased:', error);
      }
    };

    const fetchProgress = async () => {
      try {
        const userProgressDocRef = doc(db, 'users', user.uid);
        const userProgressDocSnap = await getDoc(userProgressDocRef);
        if (userProgressDocSnap.exists()) {
          const userData = userProgressDocSnap.data();
          const completedChapters = userData.userProgress && userData.userProgress[id] && userData.userProgress[id].completedChapters 
            ? userData.userProgress[id].completedChapters.length 
            : 0;
          const completedChaptersPercent = (completedChapters / chapters.length) * 100;
          setProgress(completedChaptersPercent);
        } else {
          setProgress(0);
        }
      } catch (error) {
        console.error('Error fetching progress:', error);
        setProgress(0); // Set default progress on error
      }
    };

    // Update user state on auth state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user)); // Save user data to local storage
    });

    fetchCourseData();
    fetchProgress();

    return () => {
      unsubscribe(); // Unsubscribe from auth state changes when component unmounts
    };
  }, [id, user, chapters.length]); // Update when id, user, or chapters.length changes

  return (
    <div className='h-full border-r flex flex-col overflow-y-auto shadow-sm'>
      {courseData && (
        <div className='p-8 flex flex-col border-b'>
          <h2>{courseData.Title}</h2>
          {purchase && progress !== null && (
            <div className='mt-10'>
              <CourseProgress value={progress} />
            </div>
          )}
        </div>
      )}
      <div className='flex flex-col w-full'>
        {chapters.map((chapter) => (
          chapter.isPublished && (
            <CourseSidebarItem
              key={chapter.id}
              id={chapter.id}
              label={chapter.title}
              courseId={id}
              isLocked={!chapter.isFree && !purchase}
              isCompleted={progress !== null && progress >= ((chapter.position - 1) / chapters.length) * 100}
            />
          )
        ))}
      </div>
    </div>
  );
}
