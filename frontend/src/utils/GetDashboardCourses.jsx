import React, { useState, useEffect } from 'react'
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import {db} from "../Firbase/auth"

export async function GetDashboardCourses(userId) {
  const [completedCourses, setCompletedCourses] = useState([]);
  const [inProgressCourses, setInProgressCourses] = useState([]);
  console.log(userId + "do,");

  useEffect(() => {
    if (!userId) {
      console.log("User is not authenticated");
      return;
    }

    const purchasedCoursesRef = collection(doc(db, 'users', userId), 'purchase');
    getDocs(purchasedCoursesRef)
      .then(purchasedCoursesSnapshot => {
        const completed = [];
        const inProgress = [];

        purchasedCoursesSnapshot.docs.forEach(courseDoc => {
          const courseId = courseDoc.id;
          const courseData = courseDoc.data();

          const userProgressRef = doc(db, 'users', userId, 'userProgress', courseId);
          console.log(userProgressRef+  "zod,zo");
          getDoc(userProgressRef)
            .then(userProgressDoc => {
              if (userProgressDoc.exists()) {
                const { completedChapters } = userProgressDoc.data();
                console.log(completedChapters+ "reda");

                const courseChaptersRef = collection(doc(db, 'Courses', courseId), 'chapters');
                getDocs(courseChaptersRef)
                  .then(courseChaptersSnapshot => {
                    const totalChapters = courseChaptersSnapshot.docs.length;

                    if (completedChapters.length === totalChapters) {
                      completed.push({ id: courseId, ...courseData });
                    } else {
                      inProgress.push({ id: courseId, ...courseData });
                    }
                    console.log(completed);
                    setCompletedCourses(completed);
                    setInProgressCourses(inProgress);
                  })
                  .catch(error => {
                    console.error('Error fetching course chapters:', error);
                  });
              } else {
                inProgress.push({ id: courseId, ...courseData });
                setInProgressCourses(inProgress);
              }
            })
            .catch(error => {
              console.error('Error fetching user progress:', error);
            });
        });
      })
      .catch(error => {
        console.error('Error fetching purchased courses:', error);
      });
  }, [userId]);

  return { completedCourses, inProgressCourses };
}