import React, { useEffect, useState } from 'react';
import { auth, db } from "../config/Firbase"; // Assuming this import is correct
import { doc, getDoc } from 'firebase/firestore'; // Import corrected
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '@mui/material';

export default function Header() {
  const [userData, setUserData] = useState(null);
  let navigate = useNavigate();

  useEffect(() => {
    const getUserData = async () => {
      try {
        const user = auth.currentUser;
        
        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            // console.log(userData);
            setUserData(userData);
            // Store user data in local storage
            localStorage.setItem('userData', JSON.stringify(userData));
          } else {
            console.log("No user data found");
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    // Check if user data exists in local storage
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    } else {
      getUserData();
    }
  }, []);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate("/");
      // Clear user data from local storage on logout
      localStorage.removeItem('userData');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="flex justify-end items-center py-2 px-6 border-b-2 mb-4">
      <div>
        <button
          className=" font-bold py-2 px-4 rounded"
          onClick={handleSignOut}
        >
          <LogOut size={20} />
        </button>
      </div>
      <div className="mr-4">
        {userData ? (
          <div className="flex items-center">
            <p>{userData.username}</p>
            {/* Render the avatar if available */}
            {userData.avatar && <Avatar src={userData.avatar} alt={userData.username} />}
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}
