import React from "react";
import SectionHeader from "./SectionHeader";
import { onboardingStore } from "../../stores/onboardingStore";
import SaveButton from "./SaveButton";
import { BooksIcon } from "@phosphor-icons/react";
import toast from "react-hot-toast";
import { addNewCourseDetail, patchCourseDetail, deleteCourseDetail } from "../../services/operations/courseDetailsAPI";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import MenuBar from "../shared/MenuBar";
import { Trash } from "lucide-react";

function CourseDetails() {
    const {
        expandedSections,
        originalData,
        updateOriginalData,
        courses,
        addCourses,
        updateCourses,
        courseForm,
        updateCourseForm,
        coursesEditingIndex,
        updateCoursesEditingIndex,
        addCourse,
        updateAddCourse,
        removeCourses,
        completedSections,
        markSectionComplete,
        removeSectionComplete
    } = onboardingStore();

    const editor = useEditor({
        extensions: [
            StarterKit.configure({ bulletList: false, orderedList: false }),
            Bold,
            Italic,
            Underline,
            TextAlign.configure({ types: ["heading", "paragraph"] }),
            BulletList,
            OrderedList,
            ListItem,
        ],
        content: courseForm.additionalInfo || "<p>Write your summary...</p>",
        onUpdate: ({ editor }) => {
            updateCourseForm({additionalInfo: editor.getHTML()});
        },
    });

    const isExpanded = expandedSections.has("courses");

    function getFilledFields(data) {
        return Object.fromEntries(
            Object.entries(data).filter(([key, value]) => {
            if (value === '' || value === null || value === undefined) return false;

            if (key === 'additionalInfo') {
                const text = value.replace(/<[^>]*>/g, '').trim(); // Strip HTML tags
                return text.length > 0; // Only keep if meaningful content exists
            }

            return true;
            })
        );
    }

    function getChangedFields(newData, originalData) {
        return Object.fromEntries(
            Object.entries(newData).filter(([key, value]) => {
                const originalValue = originalData[key];

                if (key === 'date' || key === 'expirationDate') {
                    const originalDate = originalValue
                        ? new Date(originalValue).toISOString().split('T')[0]
                        : '';
                    const newDate = value
                        ? new Date(value).toISOString().split('T')[0]
                        : '';
                    return originalDate !== newDate;
                }

                if (key === 'additionalInfo') {
                    const normalizedOriginal = (originalValue ?? '').toString().trim();
                    const normalizedNew = (value ?? '').toString().trim();
                    return normalizedOriginal !== normalizedNew;
                }

                const normalizedOriginal = (originalValue ?? '').toString().trim();
                const normalizedNew = (value ?? '').toString().trim();
                return normalizedOriginal !== normalizedNew;
            })
        );
    }

    const handleSave = async () => {
        if (!courseForm.title.trim()) {
            toast.error("Course Title should not be empty.", {
                style: {
                    border: '1px solid orange',
                    backgroundColor: 'rgba(255, 165, 0, 0.1)',
                    color: 'orange'
                }
            });
            return;
        }
        try {
            if (coursesEditingIndex === null) {
                console.log("Working")
                const filledData = getFilledFields(courseForm);
                const response = await addNewCourseDetail(filledData);
                if (response && response._id) {
                    const newCourse = {...filledData, _id: response._id}
                    await addCourses(newCourse);
                    const updatedCourse = onboardingStore.getState().courses;
                    await updateOriginalData({courses: updatedCourse});
                    await markSectionComplete("courses");
                }          
            } else {
                const original = courses[coursesEditingIndex]
                const updatedFields = getChangedFields(courseForm, original);
                console.log(updatedFields)
                if (Object.keys(updatedFields).length > 0) {
                    await patchCourseDetail(updatedFields, original._id);
                    updateCourses(coursesEditingIndex, updatedFields);
                    const updatedCourse = onboardingStore.getState().courses;
                    await updateOriginalData({courses: updatedCourse});
                    console.log(updatedFields)
                } else {
                    toast("No Changes to Save", {
                        style: {
                        border: '1px solid #3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        color: '#3b82f6'
                    }
                    })
                    return;
                }
            }
        } catch (error) {
            console.error("Error saving:", error);
        }
        updateCourseForm({
            title: '',
            link: '',
            license: '',
            issuer: '',
            date: '',
            expirationDate: '',
            additionalInfo: '',
            hide: false
        });
        updateCoursesEditingIndex(null);
        updateAddCourse(false);
    }

    const handleEdit = async (index) => {
        updateCourseForm(originalData.courses[index]);
        updateCoursesEditingIndex(index);
    }

    const handleAdd = () => {
        updateCourseForm({
            title: '',
            link: '',
            license: '',
            issuer: '',
            date: '',
            expirationDate: '',
            additionalInfo: '',
            hide: false    
        });
        updateAddCourse(true);
    };

    const handleCancel = () => {
        updateCourseForm({
            title: '',
            link: '',
            license: '',
            issuer: '',
            date: '',
            expirationDate: '',
            additionalInfo: '',
            hide: false   
        });
        updateAddCourse(false);
        updateCoursesEditingIndex(null);
    }

    const handleDelete = async (index) => {
        try {
            await deleteCourseDetail(courses[index]._id);
            removeCourses(index);
            const updatedCourses = onboardingStore.getState().courses;
            if (updatedCourses.length === 0 && completedSections.has("courses")) {
                await removeSectionComplete("courses");
            }
        } catch (error) {
            
        }
    }

    React.useEffect(() => {
        if (!editor) return;

        const formContent = courseForm.additionalInfo || "<p>Write your summary...</p>";
        const editorContent = editor.getHTML();

        // Only set content if it's actually different
        if (formContent.trim() !== editorContent.trim()) {
            editor.commands.setContent(formContent);
        }
    }, [courseForm.additionalInfo, editor]);


    return (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden max-w-4xl">
            <SectionHeader 
                title="Courses"
                icon={<BooksIcon/>}
                sectionId="courses"
            />

            {isExpanded && (
                <>
                    {(courses.length === 0 || coursesEditingIndex !== null || addCourse) && (
                        <CourseForm 
                            data={courseForm}
                            editor={editor}
                            handleSave={handleSave}
                            handleChange={updateCourseForm}
                            coursesEditingIndex={coursesEditingIndex}
                            handleCancel={handleCancel}
                            addCourse={addCourse}
                        />
                    )}
            
                    {(courses.length > 0 && coursesEditingIndex === null && addCourse === false) && (
                        <div className="p-6 border-t border-gray-800 space-y-6 w-full">
                            {courses.map((course, index) => (
                                <div key={index} className="border-b pb-2 border-gray-800"> 
                                    <div className="flex justify-between">
                                        <div onClick={() => handleEdit(index)} className="font-semibold hover:text-gray-400">
                                            <p>{course.title}, {course.issuer && course.issuer}</p>
                                            <p>{course.date && new Date(course.date).toISOString().split("T")[0]} - {course.expirationDate && course.expirationDate} | {course.license && course.license}</p>
                                        </div>
                                        <div>
                                            <button 
                                                type="button"
                                                onClick={() => {handleDelete(index)}}
                                            >
                                                <Trash className="h-5 w-5 text-[#0A66C2] hover:text-white"/>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="flex justify-center">
                                <button className="bg-gradient-to-r from-indigo-500 to-purple-500 h-10 w-40 rounded-xl hover:from-indigo-600 hover:to-purple-600 hover:scale-105 transition-all transform" 
                                onClick={handleAdd}>Add +</button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

function CourseForm({data, editor, handleSave, handleChange, coursesEditingIndex, addCourse, handleCancel}) {
    return (
        <div className="p-6 border-t border-gray-800 space-y-6 w-full">
            <h2 className="text-xl font-semibold">
              {coursesEditingIndex !== null ? 'Update Course' : 'Add Course'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Course
                    </label>
                    <input 
                        type="text"
                        value={data.title ?? ''}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Cloud Course"
                        onChange={(e) => handleChange({ title: e.target.value})}
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Link
                    </label>
                    <input 
                        type="text"
                        value={data.link ?? ''}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="issuer.com\course"
                        onChange={(e) => handleChange({ link: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        License
                    </label>
                    <input 
                        type="text"
                        value={data.license ?? ''}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="License"
                        onChange={(e) => handleChange({ license: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Issuer
                    </label>
                    <input 
                        type="text"
                        value={data.issuer ?? ''}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="123456789"
                        onChange={(e) => handleChange({ issuer: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Issue Date
                    </label>
                    <input
                        type="date"
                        value={data.date ? new Date(data.date).toISOString().split("T")[0] : ''}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        onChange={(e) => handleChange({ date: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        End Data
                    </label>
                    <input 
                        type="date"
                        value={data.expirationDate ? new Date(data.expirationDate).toISOString().split("T")[0] : ''}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        onChange={(e) => handleChange({ expirationDate: e.target.value})}
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Additional Info
                    </label>
                    <MenuBar editor={editor} />
                    <div className="relative tipTapWrapper border border-gray-700 rounded-md bg-gray-800 text-white min-h-[124px] max-h-[1274px] overflow-auto">
                        <EditorContent
                        editor={editor}
                        className="tiptap list-disc list-inside"
                        />
                    </div>
                </div>
            </div>
            <div className="flex justify-end gap-2">
                {(coursesEditingIndex !== null || addCourse) && (
                    <button className="px-3 py-1.5 text-sm md:px-4 md:py-2 md:text-sm bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 flex items-center space-x-2 font-medium rounded-lg transition-all transform hover:scale-105 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-950 disabled:transform-none disabled:opaissuer-50" 
                    onClick={() => {handleCancel()}}>Cancel</button>
                )}
                <SaveButton itemId="courses" onSave={handleSave}/>
            </div>
        </div>
    )
}

export default CourseDetails;