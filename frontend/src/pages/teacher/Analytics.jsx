import React, { useEffect, useState } from 'react';
import DataCard from '../../components/dashboard/analytics/DataCard';
import { db } from '../../config/Firbase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import UserTableAction from '../../components/dashboard/analytics/UserTableAction';
import ChartBoard from '../../components/students/ChartBoard';

export function Analytics() {
  const [totalPurchases, setTotalPurchases] = useState(0);

  useEffect(() => {
    const fetchTotalPurchases = async () => {
      try {
        const usersRef = collection(db, 'users');
        const usersSnapshot = await getDocs(usersRef);

        let totalPurchases = 0;

        // Loop through all users
        for (const userDoc of usersSnapshot.docs) {
          const userId = userDoc.id;

          // Fetch user's purchase courses count
          const userDocRef = doc(db, 'users', userId);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            const purchaseCoursesCount = Array.isArray(userData.purchaseCourses) ? userData.purchaseCourses.length : 0;
            totalPurchases += purchaseCoursesCount;
          }
        }

        setTotalPurchases(totalPurchases);
      } catch (error) {
        console.error('Error fetching total purchases:', error);
      }
    };

    fetchTotalPurchases();
  }, []);

  return (
    <div className='p-6'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-8'>
        <DataCard
          label={'Total Purchases'}
          value={totalPurchases}
          className='bg-green-500 text-white'
        />
        {/* <ChartBoard totalPurchases={totalPurchases} /> */}
      </div>
      <UserTableAction />
    </div>
  );
}
