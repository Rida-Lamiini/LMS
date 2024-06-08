import React, { useState } from 'react';
import { ArtTrack, Business, Category, MapsHomeWorkTwoTone, MilitaryTech, Science } from '@mui/icons-material';

const categoryIcons = {
  "Science": <Science />, 
  "Mathematics": <MapsHomeWorkTwoTone />, 
  "Business": <Business />, 
  "Art": <ArtTrack/>,
  "Technology": <MilitaryTech/>
};

export default function Categories({ items, onCategoryClick }) {
  const [activeCategoryId, setActiveCategoryId] = useState(null);

  const handleClick = (categoryId) => {
    setActiveCategoryId(categoryId);
    console.log(categoryId);
    onCategoryClick(categoryId);
  };

  return (
    <div>
      <div className='flex items-center gap-x-2 overflow-x-auto'>
        {items.map((category, index) => (
          <button 
            key={category.id} 
            className={`flex items-center gap-x-2 py-2 px-3 text-sm border border-slate-200 rounded-full transition 
            ${activeCategoryId === category.id ? 'border-sky-700 bg-sky-700 text-white' : 'border-slate-200 hover:border-sky-700 hover:bg-slate-50'}`}
            onClick={() => handleClick(category.id)}
          >
            {categoryIcons[category.name] || <Category />} 
            <span>{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
