import React, { useEffect, useRef, useState } from 'react';
import * as LR from '@uploadcare/blocks';
import "@uploadcare/blocks/web/lr-file-uploader-regular.min.css";
import { doc, updateDoc } from 'firebase/firestore'; // Import Firestore methods

import { ImageIcon } from 'lucide-react';
import { db } from '../../../config/Firbase';
LR.registerBlocks(LR);

export function UploadImage({ courseId , initialData}) {
  const [currentFile, setCurrentFile] = useState(initialData);
  const [message, setMessage] = useState('');
  console.log(initialData);

  useEffect(() => {
    if (currentFile) {
      updateImageUrl(currentFile.cdnUrl);
    }
    setCurrentFile(initialData)
  }, [currentFile]);

  const updateImageUrl = async (url) => {
    try {
      const courseRef = doc(db, 'Courses', courseId); // Reference to the course document
            await updateDoc(courseRef, { imageUrl: url }); // Update the title field in Firestore
        console.log(url);
    } catch (error) {
      setMessage(`Error updating image URL: ${error.message}`);
      console.error('Error saving image URL:', error);
    }
  };

  const handleChangeEvent = (event) => {
    const uploadedFiles = event.detail.allEntries.filter((file) => file.status === 'success');
    if (uploadedFiles.length > 0) {
      setCurrentFile(uploadedFiles[0]);
    }
  };

  const ctxProviderRef = useRef(null);

  useEffect(() => {
    const ctxProvider = ctxProviderRef.current;
    if (!ctxProvider) return;

    ctxProvider.addEventListener('change', handleChangeEvent);

    return () => {
      ctxProvider.removeEventListener('change', handleChangeEvent);
    };
  }, []);

  return (
    // <div>
  

  
    //   <p>{message}</p>
    // </div>
    <div className='mt-6 border bg-slate-100 rounded-md p-4'>
        <div className='font-medium flex item-center justify-between'>
          Course image
          <div>
          <lr-config
        ctx-name="my-uploader"
        pubkey="49b2de2173d426480d77"
      />

      <lr-file-uploader-regular
        ctx-name="my-uploader"
      />

      <lr-upload-ctx-provider
        ctx-name="my-uploader"
        ref={ctxProviderRef}
      />
          </div>
          

        </div>
        <div>
        {currentFile ? (
  <div key={currentFile.uuid}>
    <img
    src='https://ucarecdn.com/2cc51dd2-6ad7-4ed4-83e3-0811d82672e6/'
      alt={currentFile.fileInfo.originalFilename}
    />
  </div>
) : (
  // <p className='text-sm mt-2'>No image selected</p>
  <ImageIcon className='object-cover rounded-md'/>
)}

      </div>
      <img src={initialData} alt="" />
    </div>
  );
}
