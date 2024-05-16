import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { LayoutDashboard , ListChecks ,CircleDollarSign,File } from 'lucide-react';
import { TitleForm } from '../../../components/TitleForm';
import { TextForm } from '../../../components/TextForm';
import { UploadImage } from '../../../components/UploadImage';
import { CategoryForm } from '../../../components/CategoryForm';
import { PriceForm } from '../../../components/PriceForm';
import { UploadAttachments } from '../../../components/UploadAttachments';

export function CourseEdit() {
    const { id } = useParams();
    const location = useLocation();
    const { course, courseId } = location.state;

    // Calculate the number of filled fields
    const filledFields = Object.values(course).filter(value => value !== '').length;

    // Calculate the total number of fields
    const totalFields = Object.keys(course).length;

    return (
        <div className="p-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-y-2">
                    <h1 className='text-2xl font-medium'>
                        Course Setup
                    </h1>
                    <span className='text-sm text-slate-700'>
                        Complete all fields ({filledFields - 1} / {totalFields})
                    </span>
                </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-16'>
                <div>
                    <div className='flex items-center gap-x-2'>
                        <LayoutDashboard />
                        <h2 className='text-xl'>Customize your course</h2>
                    </div>
                    <TitleForm
                        initialData={course.title}
                        courseId={courseId}
                    />
                    <TextForm
                        initialData={course.description}
                        courseId={courseId}
                    />
                    <UploadImage
                        courseId={courseId}
                    />
                    <CategoryForm
                        courseId={courseId}
                    />
                </div>
                <div className="space-y-6">
                    <div>
                        <div className='flex items-center gap-x-2'>

                            <ListChecks/>
                            <h2 className='text-xl'>
                                Course chapters
                            </h2>
                        </div>
                        <div>
                            TODO: Chapters
                        </div>
                    </div>
                    <div className=''>
                        <div className='flex items-center gap-x-2'>
                            <CircleDollarSign/>
                            <h2 className="text-xl">
                                Sell your course
                            </h2>
                        </div>
                        
                            <PriceForm
                                initialData={course.price}
                                courseId={courseId}
                            />
                        

                    </div>
                    <div>
                    <div className='flex items-center gap-x-2'>
                            <File/>
                            <h2 className="text-xl">
                                Ressources & Attachments
                            </h2>
                        </div>
                        <UploadAttachments/>
                    </div>

                </div>
            </div>
        </div>
    )
}
