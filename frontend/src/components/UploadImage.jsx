import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import * as LR from '@uploadcare/blocks';
import "@uploadcare/blocks/web/lr-file-uploader-regular.min.css";
import { ImageIcon } from 'lucide-react';
LR.registerBlocks(LR);

export function UploadImage({ courseId }) {
  const [currentFile, setCurrentFile] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (currentFile) {
      updateImageUrl(currentFile.cdnUrl);
    }
  }, [currentFile]);

  const updateImageUrl = async (url) => {
    try {
      const response = await axios.put(`http://localhost:8080/courses/${courseId}/update-image-url`, { imageUrl: url });
      setMessage(`Image URL updated successfully for Course ID ${courseId}`);
      console.log('Image URL saved:', response.data);
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
      src={currentFile.cdnUrl}
      alt={currentFile.fileInfo.originalFilename}
    />
  </div>
) : (
  // <p className='text-sm mt-2'>No image selected</p>
  <ImageIcon className='object-cover rounded-md'/>
)}

      </div>
    </div>
  );
}
