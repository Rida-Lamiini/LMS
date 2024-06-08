import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, doc, writeBatch } from 'firebase/firestore';
import { db } from '../../../config/Firbase'; // Adjust the import path based on your project structure
import { PlusCircle } from 'lucide-react';
import { ChaptersList } from '../../dashboard/courses/ChaptersList';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

export function ChaptersForm({ courseId }) {
  const [isCreating, setIsCreating] = useState(false);
  const [chapterTitle, setChapterTitle] = useState('');
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getTaskPos = (id) => chapters.findIndex((task) => task.id === id);

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const originalPos = getTaskPos(active.id);
    const newPos = getTaskPos(over.id);

    const updatedChapters = arrayMove(chapters, originalPos, newPos).map((item, index) => ({
      ...item,
      position: index + 1, // Update position based on new index
    }));

    setChapters(updatedChapters);

    // Update positions in the database
    try {
      const batch = writeBatch(db);
      updatedChapters.forEach((chapter, index) => {
        const chapterDocRef = doc(db, 'Courses', courseId, 'chapters', chapter.id);
        batch.update(chapterDocRef, { position: index + 1 });
      });
      await batch.commit();
      console.log('Chapter positions updated successfully');
    } catch (error) {
      console.error('Error updating chapter positions:', error);
    }
  };

  const toggleCreating = () => setIsCreating((curr) => !curr);
  const handleChange = (e) => setChapterTitle(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (chapterTitle.trim()) {
      try {
        console.log('Creating chapter...');
        const chaptersCollectionRef = collection(doc(db, 'Courses', courseId), 'chapters');

        // Get all chapters to determine the last position
        const querySnapshot = await getDocs(chaptersCollectionRef);
        const fetchedChapters = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const lastPosition = fetchedChapters.length > 0
          ? Math.max(...fetchedChapters.map((chapter) => chapter.position || 0))
          : 0;

        await addDoc(chaptersCollectionRef, {
          title: chapterTitle,
          description: '',
          videoUrl: '',
          published: false,
          isFree: false,
          position: lastPosition + 1, // Set the new chapter's position
        });
        setChapterTitle('');
        setIsCreating(false);
        fetchChapters(); // Refetch chapters after creating a new one
        console.log('Chapter created successfully');
      } catch (error) {
        console.error('Error creating chapter:', error);
      }
    }
  };

  const fetchChapters = async () => {
    try {
      console.log('Fetching chapters for courseId:', courseId);
      setLoading(true);
      const chaptersCollectionRef = collection(doc(db, 'Courses', courseId), 'chapters');
      const querySnapshot = await getDocs(chaptersCollectionRef);

      const fetchedChapters = querySnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .sort((a, b) => a.position - b.position); // Sort chapters by position

      console.log('Fetched chapters:', fetchedChapters);
      setChapters(fetchedChapters);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching chapters:', error);
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChapters();
  }, [courseId]);

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course Chapters
        <button onClick={toggleCreating} className="flex items-center">
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a chapter
            </>
          )}
        </button>
      </div>

      {!isCreating && (
        <div className="text-sm mt-2">
          {loading ? (
            <p>Loading chapters...</p>
          ) : error ? (
            <p>Error fetching chapters: {error.message}</p>
          ) : chapters.length > 0 ? (
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={chapters.map((chapter) => chapter.id)} strategy={verticalListSortingStrategy}>
                <ChaptersList chapters={chapters} courseId={courseId} />
              </SortableContext>
            </DndContext>
          ) : (
            <p>No chapters found for this course.</p>
          )}
        </div>
      )}

      {isCreating && (
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <input
            className="w-full p-2 border border-gray-300 rounded"
            value={chapterTitle}
            onChange={handleChange}
            placeholder="Enter chapter title"
          />
          <div className="flex items-center gap-x-2">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Create
            </button>
          </div>
        </form>
      )}

      {!isCreating && (
        <p className="text-xs text-gray-500 mt-4">
          Drag and drop to reorder the chapters
        </p>
      )}
    </div>
  );
}
