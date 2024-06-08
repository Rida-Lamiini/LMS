import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../../../config/Firbase';
import { TitleForm } from '../../../components/dashboard/courses/chapters/TitleForm';
import { DescriptionForm } from '../../../components/dashboard/courses/chapters/DescriptionForm';
import { AccessForm } from '../../../components/dashboard/courses/chapters/AccessForm';
import { VideoUpload } from '../../../components/dashboard/courses/chapters/VideoUpload';
import { ArrowLeftIcon, Eye, LayoutDashboard, Video, AlertCircle, Trash } from 'lucide-react';

export default function ChapterEdit() {
    const location = useLocation();
    const navigate = useNavigate();
    const chapterId = location.state ? location.state.chapterId : null;
    const courseId = location.state ? location.state.courseId : null;

    const [isPublished, setIsPublished] = useState(false);
    const [chapterData, setChapterData] = useState([])

    useEffect(() => {
        const checkPublishedStatus = async () => {
            if (courseId && chapterId) {
                const chapterDocRef = doc(db, 'Courses', courseId, 'chapters', chapterId);
                const chapterDoc = await getDoc(chapterDocRef);
                console.log(chapterDoc.data());

                if (chapterDoc.exists()) {
                    setIsPublished(chapterDoc.data().isPublished || false);
                    setChapterData(chapterDoc.data()) // Assuming 'isPublished' field in Firestore
                }
            }
        };

        checkPublishedStatus();
    }, [courseId, chapterId]);

    const handlePublish = async () => {
        if (courseId && chapterId) {
            const chapterDocRef = doc(db, 'Courses', courseId, 'chapters', chapterId);
            await updateDoc(chapterDocRef, {
                isPublished: true
            });
            setIsPublished(true);
            navigate(`/admin/${courseId}`, { state: { courseIdFrmChapter: courseId } });
        }
    };

    const handleUnpublish = async () => {
        if (courseId && chapterId) {
            const chapterDocRef = doc(db, 'Courses', courseId, 'chapters', chapterId);
            await updateDoc(chapterDocRef, {
                isPublished: false
            });
            setIsPublished(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this chapter?")) {
            if (courseId && chapterId) {
                const chapterDocRef = doc(db, 'Courses', courseId, 'chapters', chapterId);
                await deleteDoc(chapterDocRef);
                navigate(`/admin/${courseId}`, { state: { courseIdFrmChapter: courseId } });
            }
        }
    };

    const handleBack = async () => {
        navigate(`/admin/${courseId}`, { state: { courseIdFrmChapter: courseId } });
    };

    return (
        <div className="p-4">
            {!isPublished && (
                <div className="bg-yellow-200 border border-yellow-300 text-yellow-800 p-4 rounded-md mb-4 flex items-center">
                    <AlertCircle className="h-6 w-6 mr-2" />
                    <span>This chapter is not published yet.</span>
                </div>
            )}
            <div className="flex items-center justify-between mb-4">
                <button onClick={handleBack} className="flex items-center text-blue-500 hover:text-blue-700">
                    <ArrowLeftIcon className="h-4 w-4 mr-2" />
                    Back to course setup
                </button>
                <div className="flex items-center space-x-2">
                    {isPublished ? (
                        <button onClick={handleUnpublish} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">
                            Unpublish
                        </button>
                    ) : (
                        <button onClick={handlePublish} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Publish
                        </button>
                    )}
                    <button onClick={handleDelete} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center">
                        <Trash className="h-4 w-4" />
                        Delete
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                    <div>
                        <div className="flex items-center gap-x-2 mb-2">
                            <LayoutDashboard className="h-6 w-6" />
                            <h2 className="text-xl font-semibold">Customize your chapter</h2>
                        </div>
                        <TitleForm chapterId={chapterId} courseId={courseId} initialData={chapterData.title} />
                        <DescriptionForm chapterId={chapterId} courseId={courseId} initialData={chapterData.description} />
                    </div>
                    <div>
                        <div className="flex items-center gap-x-2 mb-2">
                            <Eye className="h-6 w-6" />
                            <h2 className="text-xl font-semibold">Access Setting</h2>
                        </div>
                        <AccessForm chapterId={chapterId} courseId={courseId} />
                    </div>
                </div>
                <div>
                    <div className="flex items-center gap-x-2 mb-2">
                        <Video className="h-6 w-6" />
                        <h2 className="text-xl font-semibold">Add a video</h2>
                    </div>
                    <VideoUpload chapterId={chapterId} courseId={courseId} />
                </div>
            </div>
        </div>
    );
}
