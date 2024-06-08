import { useEffect, useState } from 'react';
import { Pencil } from 'lucide-react';
import { doc, updateDoc, getDoc, collection, getDocs } from 'firebase/firestore'; // Import Firestore methods
import { db } from '../../../config/Firbase';
import { DropDown } from '../DropDown';

export function CategoryForm({ courseId, initialData }) {
    const [isEditing, setIsEditing] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const toggleEdit = () => setIsEditing(curr => !curr);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch course document to get the category reference
                const courseDoc = await getDoc(doc(db, 'Courses', courseId));
                const courseData = courseDoc.data();
                
                if (courseData && courseData.categoryRef) {
                    const categoryDoc = await getDoc(courseData.categoryRef);
                    if (categoryDoc.exists()) {
                        setSelectedCategory({ id: categoryDoc.id, ...categoryDoc.data() });
                    } else {
                        console.error('Category data not found');
                    }
                }

                // Fetch all categories for the dropdown
                const querySnapshot = await getDocs(collection(db, 'categories'));
                const fetchedCategories = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setCategories(fetchedCategories);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchData();
    }, [courseId]);

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
            const courseRef = doc(db, 'Courses', courseId); // Reference to the course document
            await updateDoc(courseRef, { categoryRef: doc(db, 'categories', selectedCategory.id) }); // Update the categoryRef field in Firestore

            await updateDoc(courseRef, { categoryId: selectedCategory.id }); // Update the title field in Firestore

            console.log('Category reference saved:', selectedCategory.id);
            toggleEdit();
        } catch (error) {
            console.error('Error saving category reference:', error);
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
