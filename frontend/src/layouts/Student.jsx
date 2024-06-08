import React , {useEffect, useState} from 'react';
import { LayoutDashboard, Globe } from 'lucide-react';
import { Link, Outlet } from 'react-router-dom';
import { Sidebar, SidebarItem } from '../components/SideBar';
import Header from '../components/Header';
import { auth, db } from "../config/Firbase"; // Assuming this import is correct
import { doc, getDoc } from 'firebase/firestore'; // Import corrected


export function Student() {
  const [username,setUsername] = useState("")

  const getUserData = async () => {
    try {
      const user = auth.currentUser;
      
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          
          const userData = userDoc.data();
          console.log("sddsss");
          console.log(userData);
          setUsername(userData.username);
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
  useEffect(()=>{
    getUserData();
  },[])
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-10 p-6">
      <div className="md:col-span-1">
        <Sidebar className="">
          <Link to="/student/dashboard" className="block mb-4">
            <SidebarItem icon={<LayoutDashboard size={20} />} text="Dashboard" />
          </Link>
          <Link to="/student/browse" className="block">
            <SidebarItem icon={<Globe size={20} />} text="Browse" />
          </Link>
        </Sidebar>
      </div>
      <div className="md:col-span-3 bg-white p-6 ">
        <Outlet />
      </div>
    </div>
  );
}

// Sidebar component (if needed to be included in this snippet)
