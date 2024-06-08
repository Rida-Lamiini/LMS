import React from 'react';

import { DndContext } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import Chapter from './Chapter';

export function ChaptersList({ chapters , courseId}) {
  return (
    <ul className=' '>
      <SortableContext items={chapters} strategy={verticalListSortingStrategy} >
        {chapters.map(chapter => (
        // <li key={chapter.id}>{chapter.title}</li>
          <Chapter courseId={courseId} isPublished={chapter.isPublished} id={chapter.id} title={chapter.title} free ={chapter.isFree} key={chapter.id} />
      ))}
      </SortableContext>
      
    </ul>
  );
}
