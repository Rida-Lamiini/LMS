import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { Grip, Pencil } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from 'react-tooltip'; // Assuming you're using a tooltip library

const Chapter = ({ id, title, free, isPublished, courseId }) => {
  console.log(isPublished);
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const navigate = useNavigate();

  const onEdit = () => {
    navigate(`/admin/chapters/${id}`, { state: { chapterId: id, courseId: courseId } });
  };

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="gap-x-2 bg-white shadow-md border border-gray-300 text-gray-700 rounded-md mb-4 text-sm transition-all duration-300"
    >
      <div className="flex items-center px-4 py-3 border-r border-gray-300 hover:bg-gray-100 rounded-l-md">
        <div {...listeners} {...attributes} className="mr-3 h-5 w-5 cursor-move">
          <Grip className="text-gray-600" aria-label="Drag chapter" />
        </div>
        <span className="flex-grow">{title}</span>
        <div className="ml-auto pr-2 flex items-center gap-x-2">
          {free && <div className="text-green-500 font-semibold">Free</div>}
          <div
            className={`px-3 py-1 text-white rounded-full text-xs font-semibold ${isPublished ? 'bg-blue-600' : 'bg-gray-500'}`}
          >
            {isPublished ? "Published" : "Draft"}
          </div>
          <div
            className="h-4 w-4 cursor-pointer hover:text-blue-600 transition-colors"
            onClick={onEdit}
            aria-label="Edit chapter"
          >
            <Pencil className="h-full w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chapter;
