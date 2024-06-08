import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../config/Firbase'; // Adjust the import path as needed
import { TitleForm } from '../../../components/dashboard/courses/TitleForm';
import { TextForm } from '../../../components/dashboard/courses/TextForm';
import { UploadImage } from '../../../components/dashboard/courses/UploadImage';
import { CategoryForm } from '../../../components/dashboard/courses/CategoryForm';
import { PriceForm } from '../../../components/dashboard/courses/PriceForm';
import { UploadAttachments } from '../../../components/dashboard/courses/UploadAttachments';
import { ChaptersForm } from '../../../components/dashboard/courses/ChaptersForm';
import { LayoutDashboard, ListChecks, CircleDollarSign, File, Trash, ArrowLeftIcon, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';

export function CourseEdit() {
    const location = useLocation();
    const navigate = useNavigate();
    const courseId = location.state?.courseId || location.state?.courseIdFrmChapter;

    const [initialData, setInitialData] = useState({});
    const [isPublished, setIsPublished] = useState(false);

    useEffect(() => {
        const fetchInitialData = async () => {
            if (courseId) {
                try {
                    const docRef = doc(db, 'Courses', courseId);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        console.log(data);
                        setInitialData(data);
                        setIsPublished(data.isPublished || false);
                    } else {
                        toast.error('No such document!');
                    }
                } catch (error) {
                    console.error('Error fetching document:', error);
                }
            }
        };

        fetchInitialData();
    }, [courseId]);

    const handlePublish = async () => {
        if (courseId) {
            const courseDocRef = doc(db, 'Courses', courseId);
            await updateDoc(courseDocRef, { isPublished: true });
            setIsPublished(true);
            toast.success('Course published successfully!');
        }
    };

    const handleUnpublish = async () => {
        if (courseId) {
            const courseDocRef = doc(db, 'Courses', courseId);
            await updateDoc(courseDocRef, { isPublished: false });
            setIsPublished(false);
            toast.success('Course unpublished successfully!');
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this course?")) {
            if (courseId) {
                const courseDocRef = doc(db, 'Courses', courseId);
                await deleteDoc(courseDocRef);
                navigate(`/admin`);
                toast.success('Course deleted successfully!');
            }
        }
    };

    const handleBack = () => {
        navigate(`/admin`);
    };

    return (
        <div className="p-6">
            {!isPublished && (
                <div className="bg-yellow-200 border border-yellow-300 text-yellow-800 p-4 rounded-md mb-4 flex items-center">
                    <AlertCircle className="h-6 w-6 mr-2" />
                    <span>This course is not published yet.</span>
                </div>
            )}
            <div className="flex items-center justify-between">
                <div className="w-full">
                    <div className='flex items-center cursor-pointer' onClick={handleBack}>
                        <ArrowLeftIcon className='h-4 w-4 mr-2' />
                        Back to course setup
                    </div>
                    <div className='flex items-center justify-between w-full'>
                        <div className="flex flex-col gap-y-2">
                            <h1 className='text-2xl font-medium'>Course Setup</h1>
                            <span className='text-sm text-slate-700'>Complete all fields</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center">
                    {!isPublished ? (
                        <button
                            onClick={handlePublish}
                            className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
                        >
                            Publish
                        </button>
                    ) : (
                        <button
                            onClick={handleUnpublish}
                            className="mr-2 bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded transition duration-300"
                        >
                            Unpublish
                        </button>
                    )}
                    <button
                        onClick={handleDelete}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300 flex items-center"
                    >
                        <Trash className="mr-1" />
                        Delete
                    </button>
                </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-16'>
                <div>
                    <div className='flex items-center gap-x-2'>
                        <LayoutDashboard />
                        <h2 className='text-xl'>Customize your course</h2>
                    </div>
                    <TitleForm
                        initialData={initialData.Title}
                        courseId={courseId}
                    />
                    <TextForm
                        initialData={initialData.description}
                        courseId={courseId}
                    />
                    <UploadImage
                        initialData={initialData.imageUrl}
                        courseId={courseId}
                    />
                    <CategoryForm
                        initialData={initialData.categoryRef}
                        courseId={courseId}
                    />
                </div>
                <div className="space-y-6">
                    <div>
                        <div className='flex items-center gap-x-2'>
                            <ListChecks />
                            <h2 className='text-xl'>Course chapters</h2>
                        </div>
                        <ChaptersForm
                            courseId={courseId}
                        />
                    </div>
                    <div>
                        <div className='flex items-center gap-x-2'>
                            <CircleDollarSign />
                            <h2 className="text-xl">Sell your course</h2>
                        </div>
                        <PriceForm
                            initialData={initialData.price}
                            courseId={courseId}
                        />
                    </div>
                    <div>
                        <div className='flex items-center gap-x-2'>
                            <File />
                            <h2 className="text-xl">Resources & Attachments</h2>
                        </div>
                        <UploadAttachments
                            courseId={courseId}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
