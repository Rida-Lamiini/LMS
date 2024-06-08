import React, { useState, useEffect } from 'react';
import emailjs from 'emailjs-com';
import { db, auth } from '../../config/Firbase'; // Adjust the import path as needed
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import CourseProgressButton from './CourseProgressButton';

const EMAILJS_SERVICE_ID = 'service_8qql8r7';
const EMAILJS_TEMPLATE_ID = 'template_d10ibnt';
const EMAILJS_USER_ID = '8hSbmsuUIyAO4WIxG';

export default function CourseEnrollButton({ courseId, courseData }) {
  const [enrolled, setEnrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasPurchased, setHasPurchased] = useState(false);

  const sendEmail = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const templateParams = {
          userName: user.displayName, // Adjust if needed
          courseTitle: courseData.Title,
          courseId: courseId,
          // Add any other parameters you want to include in the email
        };

        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_USER_ID);
        console.log('Email sent successfully!');
      } else {
        console.log('User not authenticated.');
      }
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  const fetchEnrollmentStatus = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          
          if (userData.pendingCourses) {
            const isEnrolledInPending = userData.pendingCourses.some(course => course.courseId === courseId);
            setEnrolled(isEnrolledInPending);
          }

          if (userData.purchaseCourses) {
            const isPurchased = userData.purchaseCourses.some(course => course.courseId === courseId);
            setHasPurchased(isPurchased);
          }
        }
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching enrollment status:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollmentStatus();
  }, [courseId]); // Added courseId to the dependency array to refetch when courseId changes

  const handleEnrollClick = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          const updatedPendingCourses = userData.pendingCourses ? [...userData.pendingCourses] : [];

          if (!updatedPendingCourses.some(course => course.courseId === courseId)) {
            updatedPendingCourses.push({
              authorized: true,
              courseName: courseData.Title,
              courseId: courseId,
            });

            await updateDoc(userDocRef, {
              pendingCourses: updatedPendingCourses,
              [`userProgress.${courseId}`]: {
                startedDate: new Date(),
                courseId: courseId,
              },
            });

            console.log('Course enrolled successfully!');
            setEnrolled(true);
            sendEmail(); // Send email when the user enrolls
          } else {
            console.log('Course already enrolled.');
          }
        }
      } else {
        console.log('User not authenticated.');
      }
    } catch (error) {
      console.error('Error enrolling course:', error);
    }
  };

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          {!enrolled && (
            <button
              className='w-full md:w-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2'
              onClick={handleEnrollClick}
            >
              Enroll
            </button>
          )}
          {hasPurchased && <CourseProgressButton courseId={courseId} />}
        </>
      )}
    </div>
  );
}
