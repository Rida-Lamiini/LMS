import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { getDownloadURL, ref, uploadBytes, deleteObject } from 'firebase/storage';
import { v4 } from 'uuid';
import { Pencil, UploadCloud, Trash2 } from 'lucide-react';
import { db, AtcMedia } from '../../../../config/Firbase'; // Adjust the import path as needed
import { doc, setDoc, getDocs, collection, deleteDoc } from 'firebase/firestore';
import ReactPlayer from 'react-player';

export function VideoUpload({ courseId, chapterId }) {
    const [videoUrl, setVideoUrl] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((curr) => !curr);

    const onDrop = async (acceptedFiles) => {
        if (videoUrl) {
            alert('Only one video can be uploaded. Please delete the existing video before adding a new one.');
            return;
        }

        const file = acceptedFiles[0];
        const fileId = v4();
        const videoRef = ref(AtcMedia, `chapter/videos_${courseId}_${chapterId}/${fileId}`);
        await uploadBytes(videoRef, file);
        const downloadURL = await getDownloadURL(videoRef);

        const fileData = {
            url: downloadURL,
            storagePath: videoRef.fullPath,
        };

        // Save file reference in Firestore under the chapter's Videos subcollection
        const chapterDocRef = doc(db, 'Courses', courseId, 'chapters', chapterId);
        const videosCollectionRef = collection(chapterDocRef, 'Videos');
        const fileDocRef = doc(videosCollectionRef, fileId);
        await setDoc(fileDocRef, fileData);

        setVideoUrl(downloadURL);
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    useEffect(() => {
        const fetchVideos = async () => {
            const chapterDocRef = doc(db, 'Courses', courseId, 'chapters', chapterId);
            const videosCollectionRef = collection(chapterDocRef, 'Videos');
            const querySnapshot = await getDocs(videosCollectionRef);

            if (!querySnapshot.empty) {
                const videoDoc = querySnapshot.docs[0];
                const { url } = videoDoc.data();
                setVideoUrl(url);
            }
        };

        fetchVideos();
    }, [courseId, chapterId]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this video?')) {
            // Delete the file from storage
            const fileRef = ref(AtcMedia, videoUrl);
            await deleteObject(fileRef);

            // Delete the file reference from Firestore
            const chapterDocRef = doc(db, 'Courses', courseId, 'chapters', chapterId);
            const videosCollectionRef = collection(chapterDocRef, 'Videos');
            const querySnapshot = await getDocs(videosCollectionRef);

            if (!querySnapshot.empty) {
                const fileDoc = querySnapshot.docs[0];
                await deleteDoc(fileDoc.ref);
            }

            setVideoUrl(null);
        }
    };

    return (
        <div className='mt-6 border bg-slate-100 rounded-md p-4'>
            <div className='font-medium flex items-center justify-between mb-3'>
                Chapter Videos
                <button onClick={toggleEdit} className='flex items-center'>
                    {isEditing ? 'Cancel' : (
                        <>
                            <Pencil className='h-4 w-4 mr-2' />
                            Add/Edit Video
                        </>
                    )}
                </button>
            </div>

            {isEditing && (
                <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer"
                    {...getRootProps()}
                >
                    <input {...getInputProps()} />
                    <UploadCloud size={48} className="text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-600">Drag and drop a video here, or click to select a video</p>
                </div>
            )}

            {videoUrl && (
                <div className='flex items-center justify-between '>
                    <div className='flex-1'>
                        <ReactPlayer url={videoUrl} controls width="100%" />
                    </div>
                    
                </div>
            )}
        </div>
    );
}
