import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, doc, getDoc, where, query, getDocs } from 'firebase/firestore';
import { auth, db } from '../../config/Firbase';
import { BookOpen } from 'lucide-react';
import CourseProgress from './CourseProgress';

export default function CourseCard({ id, imageUrl, title, categoryRef, price }) {
  const [categoryName, setCategoryName] = useState('Uncategorized');
  const [chapters, setChapters] = useState([]);
  const [progress, setProgress] = useState(null);
  const [isPurchased, setIsPurchased] = useState(false);
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const fetchCategoryName = async () => {
      try {
        if (categoryRef) {
          const categoryDoc = await getDoc(doc(db, categoryRef.path));
          if (categoryDoc.exists()) {
            setCategoryName(categoryDoc.data().name);
          }
        }
      } catch (error) {
        console.error('Error fetching category name:', error);
      }
    };

    const fetchChapters = async () => {
      try {
        const chaptersCollectionRef = collection(doc(db, 'Courses', id), 'chapters');
        const querySnapshot = await getDocs(query(chaptersCollectionRef, where('isPublished', '==', true)));

        const fetchedChapters = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })).sort((a, b) => a.position - b.position);

        setChapters(fetchedChapters);
      } catch (error) {
        console.error('Error fetching chapters:', error);
      }
    };

    const fetchProgress = async () => {
      try {
        if (user) {
          const userProgressDocRef = doc(db, 'users', user.uid);
          const userProgressDocSnap = await getDoc(userProgressDocRef);
          const userData = userProgressDocSnap.data();

          const purchasedCourse = userData.purchaseCourses.find(course => course.courseId === id);
          setIsPurchased(!!purchasedCourse);

          if (purchasedCourse) {
            const courseId = purchasedCourse.courseId;
            const courseProgress = userData?.userProgress?.[courseId];
            const completedChaptersCount = courseProgress?.completedChapters?.length || 0;
            const totalChaptersCount = chapters.length;
            const completionPercentage = totalChaptersCount ? (completedChaptersCount / totalChaptersCount) * 100 : 0;
            setProgress(completionPercentage);
          }
        }
      } catch (error) {
        console.error('Error fetching progress:', error);
      }
    };

    fetchCategoryName();
    fetchChapters();
    fetchProgress();
  }, [categoryRef, id, chapters.length, user]);

  return (
    <Link to={`/courses/${id}`}>
      <div className='group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full'>
        <div className='relative w-full aspect-video rounded-md overflow-hidden'>
          <img src={imageUrl} alt={title} className='object-cover' />
        </div>
        <div className='flex flex-col pt-2'>
          <div className='text-lg md:text-base group-hover:text-sky-700 transition line-clamp-2'>
            {title}
          </div>
          <p className='text-xs text-gray-500'>{categoryName}</p>
          <div className='my-3 flex items-center gap-x-2 text-sm md:text-xs'>
            <div className='flex items-center gap-x-1 text-slate-500'>
              <BookOpen />
              <span>{chapters.length} {chapters.length === 1 ? "Chapter" : "Chapters"}</span>
            </div>
          </div>
          {/* <p className='text-md text-slate-700'>
            ${price}
          </p> */}
        </div>
        <div>
          {isPurchased && progress !== null && (
            <CourseProgress value={progress} />
          )}
        </div>
        
      </div>
    </Link>
  );
}
