import React from 'react';
import VerificationInput from 'react-verification-input';

export default function VerificationForm() {
  return (
    <div className=" absolute max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Verification Form</h2>
      <div className="mt-4">
        <VerificationInput
          codeLength={6}
          className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400"
        />
      </div>
    </div>
  );
}
