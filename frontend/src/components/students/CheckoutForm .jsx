import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../config/Firbase'; // Adjust the import path as needed

const CheckoutForm = ({ courseId ,price }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      try {
        const user = auth.currentUser;
        if (!user) {
          throw new Error('User not authenticated');
        }

        // Handle successful payment here
        console.log('PaymentMethod:', paymentMethod);

        // Save purchase information in Firestore
        await setDoc(doc(db, 'users', user.uid, 'purchase', courseId), {
          paymentMethodId: paymentMethod.id,
          courseId: courseId,
          purchaseDate: new Date(),
          price: price
          
        });

        // Add userProgress
        await setDoc(doc(db, 'users', user.uid, 'userProgress', courseId), {
          startedDate: new Date(), // Add any other data related to progress
        });

        alert('Payment successful and data saved to Firestore');
      } catch (firestoreError) {
        console.error('Error saving data to Firestore:', firestoreError);
        setError(firestoreError.message);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className='absolute left-0 w-full max-w-sm mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
      <div className='mb-4'>
        <label className='block text-gray-700 text-sm font-bold mb-2'>
          Card Details
        </label>
        <CardElement className='stripe-card-element' />
      </div>
      <button
        type='submit'
        disabled={!stripe || loading}
        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
      >
        {loading ? 'Processing...' : 'Pay'}
      </button>
      {error && <div className='text-red-500'>{error}</div>}
    </form>
  );
};

export default CheckoutForm;
