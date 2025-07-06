import React from "react";
import SectionHeader from "./SectionHeader";
import { onboardingStore } from "../../stores/onboardingStore";
import SaveButton from "./SaveButton";
import { StudentIcon } from "@phosphor-icons/react";
import toast from "react-hot-toast";
import { addNewEducationDetails, patchEducationDetail, deleteEducationDetail } from "../../services/operations/educationDetailsAPI";
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

function EducationDetails() {
    const {
        expandedSections,
        educationDetails,
        addEducationDetail,
        updateEducationDetail,
        educationForm,
        updateEducationForm,
        educationEditingIndex,
        updateEducationEditingIndex,
        addEducation,
        updateAddEducation,
        originalData,
        updateOriginalData,
        removeEducationDetail
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
        content: educationForm.description || "<p>Write your summary...</p>",
        onUpdate: ({ editor }) => {
            updateEducationForm({description: editor.getHTML()});
        },
    });

    const isExpanded = expandedSections.has("educationDetails");

    function getFilledFields(data) {
        return Object.fromEntries(
            Object.entries(data).filter(([key, value]) => {
            if (value === '' || value === null || value === undefined) return false;

            if (key === 'description') {
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
            if (key === 'startDate' || key === 'endDate') {
                const originalDate = originalData[key]
                ? new Date(originalData[key]).toISOString().split('T')[0]
                : '';
                const newDate = value
                ? new Date(value).toISOString().split('T')[0]
                : '';
                return originalDate !== newDate;
            }

            if (key === 'description') {
                return (originalData[key] || '').trim() !== (value || '').trim();
            }

            return originalData[key] !== value;
            })
        );
    }



    const handleSave = async () => {
        if (!educationForm.degree.trim()) {
            toast.error("Degree should not be empty.", {
                style: {
                    border: '1px solid orange',
                    backgroundColor: 'rgba(255, 165, 0, 0.1)',
                    color: 'orange'
                }
            });
            return;
        }
        try {
            if (educationEditingIndex === null) {
                console.log("Working")
                const filledData = getFilledFields(educationForm);
                const response = await addNewEducationDetails(filledData);
                if (response && response._id) {
                    const newEducation = {...filledData, _id: response._id}
                    await addEducationDetail(newEducation);
                    const updatedEducation = onboardingStore.getState().educationDetails;
                    await updateOriginalData({educationDetails: updatedEducation});
                    
                    // Clear tiptap content
                    editor.commands.setContent('<p>Write your summary...</p>');
                }          
            } else {
                const original = educationDetails[educationEditingIndex]
                const updatedFields = getChangedFields(educationForm, original);
                console.log(updatedFields)
                if (Object.keys(updatedFields).length > 0) {
                    await patchEducationDetail(updatedFields, original._id);
                    updateEducationDetail(educationEditingIndex, updatedFields);
                    const updatedEducation = onboardingStore.getState().educationDetails;
                    await updateOriginalData({educationDetails: updatedEducation});
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
        updateEducationForm({
            degree: '',
            grade: '',
            school: '',
            link: '',
            country: '',
            city: '',
            startDate: '',
            endDate: '',
            description: '',
            hide: false,    
        });
        updateEducationEditingIndex(null);
        updateAddEducation(false);
    }

    const handleEdit = async (index) => {
        updateEducationForm(originalData.educationDetails[index]);
        updateEducationEditingIndex(index);
    }

    const handleAdd = () => {
        updateEducationForm({
            degree: '',
            grade: '',
            school: '',
            link: '',
            country: '',
            city: '',
            startDate: '',
            endDate: '',
            description: '',
            hide: false,    
        });
        updateAddEducation(true);
    };

    const handleCancel = () => {
        updateEducationForm({
            degree: '',
            grade: '',
            school: '',
            link: '',
            country: '',
            city: '',
            startDate: '',
            endDate: '',
            description: '',
            hide: false,    
        });
        updateAddEducation(false);
        updateEducationEditingIndex(null);
    }

    const handleDelete = async (index) => {
        try {
            await deleteEducationDetail(educationDetails[index]._id);
            removeEducationDetail(index);
        } catch (error) {
            
        }
    }

    return (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden max-w-4xl">
            <SectionHeader 
                title="Education Details"
                icon={<StudentIcon/>}
                sectionId="educationDetails"
            />

            {isExpanded && (
                <>
                    {(educationDetails.length === 0 || educationEditingIndex !== null || addEducation) && (
                        <EducationForm 
                            data={educationForm}
                            editor={editor}
                            handleSave={handleSave}
                            handleChange={updateEducationForm}
                            educationEditingIndex={educationEditingIndex}
                            handleCancel={handleCancel}
                            addEducation={addEducation}
                        />
                    )}
            
                    {(educationDetails.length > 0 && educationEditingIndex === null && addEducation === false) && (
                        <div className="p-6 border-t border-gray-800 space-y-6 w-full">
                            {educationDetails.map((edu, index) => (
                                <div key={index} className="border-b pb-2 border-gray-800"> 
                                    <div className="flex justify-between">
                                        <div onClick={() => handleEdit(index)} className="font-semibold hover:text-gray-400">
                                            <p>{edu.degree}, {edu.school && edu.school}</p>
                                            <p>{edu.startDate && new Date(edu.startDate).toISOString().split("T")[0]} - {edu.endDate && edu.endDate} | {edu.city && edu.city}, {edu.country && edu.country}</p>
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

function EducationForm({data, editor, handleSave, handleChange, educationEditingIndex, addEducation, handleCancel}) {
    return (
        <div className="p-6 border-t border-gray-800 space-y-6 w-full">
            <h2 className="text-xl font-semibold">
              {educationEditingIndex !== null ? 'Update Education' : 'Add Education'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Degree
                    </label>
                    <input 
                        type="text"
                        value={data.degree ?? ''}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="B.Tech"
                        onChange={(e) => handleChange({ degree: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Grade/Percentage/CGPA
                    </label>
                    <input 
                        type="text"
                        value={data.grade ?? ''}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="3.0/4.0"
                        onChange={(e) => handleChange({ grade: e.target.value})}

                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Institution/School
                    </label>
                    <input 
                        type="text"
                        value={data.school ?? ''}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="X.Y.Z College of Technology"
                        onChange={(e) => handleChange({ school: e.target.value})}
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
                        placeholder="XYZCollegeofTechnology.edu"
                        onChange={(e) => handleChange({ link: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Country
                    </label>
                    <input 
                        type="text"
                        value={data.country ?? ''}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="California"
                        onChange={(e) => handleChange({ country: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        City
                    </label>
                    <input 
                        type="text"
                        value={data.city ?? ''}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="San Francisco"
                        onChange={(e) => handleChange({ city: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Start Date
                    </label>
                    <input
                        type="date"
                        value={data.startDate ? new Date(data.startDate).toISOString().split("T")[0] : ''}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        onChange={(e) => handleChange({ startDate: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        End Data
                    </label>
                    <input 
                        type="date"
                        value={data.endDate ? new Date(data.endDate).toISOString().split("T")[0] : ''}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        onChange={(e) => handleChange({ endDate: e.target.value})}
                    />
                </div>
                <div className="md:col-span-2">
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
                {(educationEditingIndex !== null || addEducation) && (
                    <button className="px-3 py-1.5 text-sm md:px-4 md:py-2 md:text-sm bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 flex items-center space-x-2 font-medium rounded-lg transition-all transform hover:scale-105 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-950 disabled:transform-none disabled:opacity-50" 
                    onClick={() => {handleCancel()}}>Cancel</button>
                )}
                <SaveButton itemId="educationDetails" onSave={handleSave}/>
            </div>
        </div>
    )
}

export default EducationDetails;