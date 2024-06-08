import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { auth, db } from '../../config/Firbase'; // Adjust the import path as needed
import VideoPlayer from './VideoPlayer';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import Header from '../Header';
import { ArrowLeft } from 'lucide-react';

export default function ChapterLayout() {
  const { id, chapterId } = useParams(); // Access the params using useParams hook
  const [chapterData, setChapterData] = useState(null);
  const [nextChapterId, setNextChapterId] = useState(null);
  const [purchase, setPurchase] = useState(false);
  const [courseData, setCourseData] = useState(null);
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const fetchChapterData = async () => {
      try {
        if (user) {
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            const purchaseCourses = Array.isArray(userData.purchaseCourses) ? userData.purchaseCourses : [];
            const isPurchased = purchaseCourses.some(course => course.courseId === id);
            setPurchase(isPurchased);
          }
        }

        // Fetch the course data
        const courseDocRef = doc(db, 'Courses', id);
        const courseSnapshot = await getDoc(courseDocRef);
        if (courseSnapshot.exists()) {
          setCourseData(courseSnapshot.data());
        } else {
          console.log('Course not found');
          return;
        }

        // Fetch the current chapter data
        const chapterDocRef = doc(db, 'Courses', id, 'chapters', chapterId);
        const chapterSnapshot = await getDoc(chapterDocRef);
        if (chapterSnapshot.exists()) {
          setChapterData(chapterSnapshot.data());
        } else {
          console.log('Chapter not found');
          return;
        }

        // Fetch all chapters for the course
        const chaptersCollectionRef = collection(db, 'Courses', id, 'chapters');
        const chaptersQuery = query(chaptersCollectionRef, orderBy('position'));
        const chaptersSnapshot = await getDocs(chaptersQuery);
        const chaptersData = chaptersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Find the next chapter based on position
        const currentChapterIndex = chaptersData.findIndex(chapter => chapter.id === chapterId);
        if (currentChapterIndex !== -1 && currentChapterIndex < chaptersData.length - 1) {
          const nextChapter = chaptersData[currentChapterIndex + 1];
          setNextChapterId(nextChapter.id);
        } else {
          console.log('Next chapter not found');
        }
      } catch (error) {
        console.error('Error fetching chapter data:', error);
      }
    };

    fetchChapterData();
  }, [chapterId, id, user]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <Link to="/student/browse" className="flex items-center  text-blue-500">
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back to Browse
        </Link>
        <Header />
      </div>

      <div className="bg-gray-100 rounded-md p-4 mt-4">
        {chapterData && (
          <VideoPlayer
            chapterId={chapterId}
            title={chapterData.title}
            courseId={id}
            nextChapterId={nextChapterId}
            videoUrl={chapterData.videoUrl}
            isLocked={!purchase}
            isFree={chapterData.isFree}
            chapterData={chapterData}
            courseData={courseData} // Pass course data to VideoPlayer
          />
        )}
      </div>
    </div>
  );
}
