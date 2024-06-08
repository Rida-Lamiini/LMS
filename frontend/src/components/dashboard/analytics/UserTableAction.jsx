import React, { useState, useEffect } from 'react';
import { db } from '../../../config/Firbase'; // Adjust the import path as needed
import { collection, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Menu, MenuItem } from '@mui/material';

export default function UserTableAction() {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const fetchStudentData = async () => {
    try {
      const purchasesQuery = collection(db, 'users');
      const querySnapshot = await getDocs(purchasesQuery);
      const purchasesData = querySnapshot.docs
        .map(doc => {
          const data = doc.data();
          console.log('User:', data.username || 'N/A');
          console.log('Pending Courses:', data.pendingCourses || []);
          console.log('Purchase Courses:', data.purchaseCourses || []);
          return {
            id: doc.id,
            username: data.username || 'N/A',
            email: data.email || 'N/A',
            pendingCourses: Array.isArray(data.pendingCourses) ? data.pendingCourses : [],
            purchaseCourses: Array.isArray(data.purchaseCourses) ? data.purchaseCourses : []
          };
        })
        .filter(user => user.email !== 'lamiini2004@gmail.com'); // Exclude the specific email
      setUserData(purchasesData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching student data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, []);

  const handleMenuClick = (event, userId, courses) => {
    setAnchorEl(event.currentTarget);
    setSelectedCourses(courses);
    setSelectedUserId(userId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCourses([]);
    setSelectedUserId(null);
  };

  const handleCourseClick = async (course) => {
    try {
      const userRef = doc(db, 'users', selectedUserId);
      const userSnapshot = await getDoc(userRef);
      const userData2 = userSnapshot.data();

      const updatedPendingCourses = Array.isArray(userData2.pendingCourses) ? userData2.pendingCourses.filter(c => c.courseId !== course.courseId) : [];
      const updatedPurchaseCourses = Array.isArray(userData2.purchaseCourses) ? [...userData2.purchaseCourses, course] : [course];

      await updateDoc(userRef, {
        pendingCourses: updatedPendingCourses,
        purchaseCourses: updatedPurchaseCourses
      });

      // Update local state
      setUserData(prevUserData =>
        prevUserData.map(user => 
          user.id === selectedUserId 
            ? {
                ...user,
                pendingCourses: updatedPendingCourses,
                purchaseCourses: updatedPurchaseCourses
              }
            : user
        )
      );

      handleMenuClose();
    } catch (error) {
      console.error('Error updating courses:', error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Username</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {userData.map(user => (
            <TableRow key={user.id}>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Button onClick={(event) => handleMenuClick(event, user.id, [...user.pendingCourses, ...user.purchaseCourses])}>
                  View Courses
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  {selectedCourses.length > 0 ? (
                    selectedCourses.map((course, index) => {
                      const isPending = user.pendingCourses.some(c => c.courseId === course.courseId);
                      return (
                        <MenuItem 
                          key={index} 
                          onClick={() => isPending && handleCourseClick(course)}
                          disabled={!isPending}
                        >
                          {course.courseName} - {isPending ? 'Pending' : 'Purchased'}
                        </MenuItem>
                      );
                    })
                  ) : (
                    <MenuItem>No Courses</MenuItem>
                  )}
                </Menu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
