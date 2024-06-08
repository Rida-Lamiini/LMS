import React, { useState, useEffect } from 'react';
import { AlertCircle, File, Loader2, Lock } from 'lucide-react';
import ReactPlayer from 'react-player';
import { doc, getDocs, collection, getDoc, query, where, orderBy } from 'firebase/firestore';
import { auth, db } from '../../config/Firbase'; // Adjust the import path as needed
import CourseEnrollButton from './CourseEnrollButton';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CourseProgressButton from './CourseProgressButton';

export default function VideoPlayer({ chapterId, courseId, chapterData, courseData, isLocked, isFree }) {
  console.log(isLocked);
  const [videoUrl, setVideoUrl] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [purchase, setPurchase] = useState(false);
  const [loading, setLoading] = useState(true);
  const [nextChapterId, setNextChapterId] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const user = auth.currentUser;
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user) {
          const userId = user.uid;
          const userDocRef = doc(db, 'users', userId);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            const purchaseCourses = userData.purchaseCourses || [];
            const isPurchased = purchaseCourses.some(course => course.courseId === courseId);
            setPurchase(isPurchased);
          }
        }

        const chapterDocRef = doc(db, 'Courses', courseId, 'chapters', chapterId);
        const videosCollectionRef = collection(chapterDocRef, 'Videos');
        const querySnapshot = await getDocs(videosCollectionRef);

        if (!querySnapshot.empty) {
          const videoDoc = querySnapshot.docs[0];
          const { url } = videoDoc.data();
          setVideoUrl(url);
        }

        const attachmentsCollectionRef = collection(db, 'Courses', courseId, 'Attachments');
        const attachmentsSnapshot = await getDocs(attachmentsCollectionRef);
        const attachmentsList = attachmentsSnapshot.docs.map(doc => doc.data());
        setAttachments(attachmentsList);

        const chaptersCollectionRef = collection(db, 'Courses', courseId, 'chapters');
        const chaptersQuerySnapshot = await getDocs(query(chaptersCollectionRef, orderBy('position'), where('position', '>', chapterData.position)));
        if (!chaptersQuerySnapshot.empty) {
          const nextChapterDoc = chaptersQuerySnapshot.docs[0];
          setNextChapterId(nextChapterDoc.id);
        }

        if (user && purchase) {
          const userProgressDocRef = doc(db, 'users', user.uid, 'userProgress', courseId);
          const userProgressDocSnapshot = await getDoc(userProgressDocRef);
          if (userProgressDocSnapshot.exists()) {
            const { completedChapters } = userProgressDocSnapshot.data();
            setIsCompleted(completedChapters.includes(chapterId));
          }
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, chapterId, chapterData.position, user, purchase]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-video">
        {isLocked && !isFree ? (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-800 bg-opacity-75">
            <Lock className="h-8 w-8 text-white" />
            <p className="text-white text-lg ml-4">This chapter is locked</p>
          </div>
        ) : (
          <>
            {videoUrl && (
              <div className="absolute inset-0">
                <ReactPlayer url={videoUrl} controls width="100%" height="100%" />
              </div>
            )}
          </>
        )}
      </div>
      <div className="p-4 flex flex-col md:flex-row items-center justify-between mt-4">
        <h2 className="text-2xl font-semibold mb-2">{chapterData.title}</h2>
        {!purchase ? (
          <div>
            <CourseEnrollButton courseId={courseId} courseData={courseData} />
          </div>
        ) : (
          <div>
            <CourseProgressButton
              chapterId={chapterId}
              courseId={courseId}
              nextChapterId={nextChapterId}
            />
          </div>
        )}
      </div>
      <br />
      <div>{chapterData.description}</div>
      <br />
      {purchase && attachments.length > 0 && (
        <div className="p-4">
          {attachments.map((attachment) => (
            <a
              href={attachment.url}
              key={attachment.path}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
            >
              <File className="mr-2" />
              <p className='text-xs line-clamp-1'>{attachment.url}</p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
