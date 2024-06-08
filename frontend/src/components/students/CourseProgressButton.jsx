import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import { CheckCircle, XCircle } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../../config/Firbase';
import { useNavigate, useParams } from 'react-router-dom';

export default function CourseProgressButton({ courseId, nextChapterId }) {
  const [user, setUser] = useState(auth.currentUser);
  const navigate = useNavigate();
  const { chapterId } = useParams();
  const [chapterCompleted, setChapterCompleted] = useState(false);

  useEffect(() => {
    const fetchChapterCompletionData = async () => {
      try {
        if (!user) {
          console.error('User is not authenticated');
          return;
        }

        const userProgressDocRef = doc(db, 'users', user.uid);
        const userProgressDocSnap = await getDoc(userProgressDocRef);
        const userData = userProgressDocSnap.data();

        if (userData?.userProgress?.[courseId]?.completedChapters?.includes(chapterId)) {
          setChapterCompleted(true);
        } else {
          setChapterCompleted(false);
        }
      } catch (error) {
        console.error('Error fetching chapter completion data:', error);
      }
    };

    fetchChapterCompletionData();
  }, [user, courseId, chapterId]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleButtonClick = async () => {
    if (!user) {
      console.error('User is not authenticated');
      return;
    }

    const userProgressDocRef = doc(db, 'users', user.uid);

    try {
      const userProgressDocSnap = await getDoc(userProgressDocRef);
      const userData = userProgressDocSnap.data() || {};

      // Ensure userProgress and courseProgress exist
      let courseProgress = userData.userProgress ? userData.userProgress[courseId] : undefined;

      if (!courseProgress) {
        courseProgress = { completedChapters: [] };
        if (!userData.userProgress) {
          userData.userProgress = {};
        }
        userData.userProgress[courseId] = courseProgress;
      }

      if (!courseProgress.completedChapters) {
        courseProgress.completedChapters = [];
      }

      if (chapterCompleted) {
        courseProgress.completedChapters = courseProgress.completedChapters.filter(id => id !== chapterId);
        setChapterCompleted(false);
      } else {
        courseProgress.completedChapters.push(chapterId);
        setChapterCompleted(true);
      }

      await setDoc(userProgressDocRef, {
        userProgress: {
          ...userData.userProgress,
          [courseId]: courseProgress
        }
      }, { merge: true });

      // if (!chapterCompleted) {
      //   navigate(`/courses/${courseId}/${nextChapterId}`);
      // }

    } catch (error) {
      console.error('Error updating chapter completion status:', error);
    }
  };

  const Icon = chapterCompleted ? XCircle : CheckCircle;
  return (
    <Button
      variant='contained'
      color={chapterCompleted ? 'secondary' : 'success'}
      className='w-full md:w-auto'
      onClick={handleButtonClick}
    >
      {chapterCompleted ? 'Mark as incomplete' : 'Mark as complete'}
      <Icon className='h-4 w-4' />
    </Button>
  );
}
