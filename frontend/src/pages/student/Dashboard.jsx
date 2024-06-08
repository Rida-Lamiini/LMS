import React, { useEffect, useState } from 'react';
import CoursesList from '../../components/students/CoursesList';
import { auth, db } from '../../config/Firbase';
import { getDoc, doc, collection, query, where, getDocs } from 'firebase/firestore';
import { CheckCircle, Clock } from 'lucide-react';
import InfoCard from '../../components/students/InfoCard';

export function Dashboard() {
  const [completedCourses, setCompletedCourses] = useState([]);
  const [inProgressCourses, setInProgressCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          console.log('User is not authenticated');
          return;
        }

        const userProgressDocRef = doc(db, 'users', currentUser.uid);
        const userProgressDocSnap = await getDoc(userProgressDocRef);
        const userData = userProgressDocSnap.data();
        if (!userData) {
          console.log('User progress data not found');
          return;
        }

        const { purchaseCourses, userProgress } = userData;
        const purchasedCourseIds = purchaseCourses.map(course => course.courseId);

        const completed = [];
        const inProgress = [];

        for (const courseId of purchasedCourseIds) {
          const courseProgress = userProgress[courseId];
          const chaptersRef = collection(db, 'Courses', courseId, 'chapters');
          const chaptersQuery = query(chaptersRef);
          const chaptersSnapshot = await getDocs(chaptersQuery);
          const totalChapters = chaptersSnapshot.docs.length;
          const completedChapters = courseProgress?.completedChapters?.length || 0;

          if (completedChapters === totalChapters) {
            const courseDocRef = doc(db, 'Courses', courseId);
            const courseDocSnap = await getDoc(courseDocRef);
            const courseData = courseDocSnap.data();
            completed.push({ courseId, courseData });
          } else {
            const courseDocRef = doc(db, 'Courses', courseId);
            const courseDocSnap = await getDoc(courseDocRef);
            const courseData = courseDocSnap.data();
            inProgress.push({ courseId, courseData });
          }
        }

        setCompletedCourses(completed);
        setInProgressCourses(inProgress);
      } catch (error) {
        console.error('Error fetching user progress:', error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className='p-6 space-y-4'>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <InfoCard
          Icon={Clock}
          label="In Progress"
          numberOfItem={inProgressCourses.length}
        />
        <InfoCard
          Icon={CheckCircle}
          label="Completed"
          numberOfItem={completedCourses.length}
        />
      </div>

      <CoursesList items={[...inProgressCourses, ...completedCourses]} />
    </div>
  );
}
