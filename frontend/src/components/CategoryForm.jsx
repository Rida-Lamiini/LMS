import { useEffect, useState } from 'react';
import { Pencil } from 'lucide-react';
import axios from 'axios';
import { DropDown } from './DropDown';

export function CategoryForm({ courseId }) { // Destructure props here
    const [isEditing, setIsEditing] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const toggleEdit = () => setIsEditing(curr => !curr);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/categories');
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchData();
    }, []);

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedCategory) {
            console.error('Please select a category.');
            return;
        }

        try {
            const response = await axios.put(`http://localhost:8080/courses/${courseId}/update-category/${selectedCategory.id}`);

            console.log('Category saved:', response.data);
            toggleEdit();
        } catch (error) {
            console.error('Error saving category:', error);
        }
    };

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course category
                <button onClick={toggleEdit} className="flex items-center">
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit category
                        </>
                    )}
                </button>
            </div>
            {!isEditing && (
                <p className="text-sm mt-2">
                    {selectedCategory ? selectedCategory.name : "No category"}
                </p>
            )}
            {isEditing && (
                <form onSubmit={handleSubmit}>
                    <DropDown
                        buttonLabel="Categories"
                        items={categories}
                        onItemSelected={handleCategorySelect}
                    />
                    <div className="flex items-center gap-x-2">
                        <button type="submit">Save</button>
                    </div>
                </form>
            )}
        </div>
    );
}
