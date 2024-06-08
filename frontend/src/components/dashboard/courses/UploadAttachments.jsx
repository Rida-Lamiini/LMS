import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { getDownloadURL, listAll, ref, uploadBytes, deleteObject } from "firebase/storage";
import { v4 } from "uuid";
import { UploadCloud, Pencil, File, Trash2 } from 'lucide-react';
import { AtcMedia, db } from '../../../config/Firbase'; // Adjust the path to your Firebase config
import { doc, setDoc, getDocs, collection, deleteDoc } from 'firebase/firestore';

export function UploadAttachments({ courseId }) {
  const [atcUrls, setAtcUrls] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((curr) => !curr);

  const onDrop = (acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const fileId = v4();
      const atcRef = ref(AtcMedia, `files_${courseId}/${fileId}`);
      uploadBytes(atcRef, file).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          const fileData = {
            url,
            storagePath: snapshot.ref.fullPath,
          };

          // Save file reference in Firestore under the course's Attachments subcollection
          const courseDocRef = doc(db, 'Courses', courseId);
          const attachmentsCollectionRef = collection(courseDocRef, 'Attachments');
          const fileDocRef = doc(attachmentsCollectionRef, fileId);
          setDoc(fileDocRef, fileData);

          setAtcUrls((prevUrls) => [...prevUrls, { ...fileData, id: fileId }]);
        });
      });
    });
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  useEffect(() => {
    const fetchFiles = async () => {
      const courseDocRef = doc(db, 'Courses', courseId);
      const attachmentsCollectionRef = collection(courseDocRef, 'Attachments');
      const querySnapshot = await getDocs(attachmentsCollectionRef);

      const urls = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      setAtcUrls(urls);
    };

    fetchFiles();
  }, [courseId]);

  const handleDelete = async (fileId, storagePath) => {
    // Delete the file from storage
    const fileRef = ref(AtcMedia, storagePath);
    await deleteObject(fileRef);

    // Delete the file reference from Firestore
    const courseDocRef = doc(db, 'Courses', courseId);
    const fileDocRef = doc(courseDocRef, 'Attachments', fileId);
    await deleteDoc(fileDocRef);

    setAtcUrls((prevUrls) => prevUrls.filter((file) => file.id !== fileId));
  };

  return (
    <div className='mt-6 border bg-gray-100 rounded-md p-4'>
      <div className='font-medium flex items-center justify-between mb-3'>
        Course Attachments
        <button onClick={toggleEdit} className='flex items-center text-blue-600 hover:text-blue-800'>
          {isEditing ? 'Cancel' : (
            <>
              <Pencil className='h-4 w-4 mr-2' />
              Add a file
            </>
          )}
        </button>
      </div>

      {isEditing && (
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer bg-white"
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          <UploadCloud size={48} className="text-gray-500 mx-auto mb-4" />
          <p className="text-gray-600">Drag and drop some files here, or click to select files</p>
        </div>
      )}

      <div>
        {atcUrls.length > 0 && (
          <div className='space-y-2'>
            <ul className="list-disc pl-4 mt-2">
              {atcUrls.map(({ url, id, storagePath }, index) => (
                <li key={index} className='flex items-center p-3 w-full bg-blue-100 border border-blue-200 text-blue-700 rounded-md mb-2'>
                  <File className='h-4 w-4 mr-2 flex-shrink-0' />
                  <a
                    href={url}
                    download
                    className="text-blue-600 hover:text-blue-800 flex-grow break-all"
                  >
                    <p className='text-xs line-clamp-1'>{url}</p>
                  </a>
                  <button
                    onClick={() => handleDelete(id, storagePath)}
                    className="text-red-600 hover:text-red-800 ml-4"
                  >
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
