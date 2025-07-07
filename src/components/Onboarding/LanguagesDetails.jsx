import React from "react";
import SectionHeader from "./SectionHeader";
import { onboardingStore } from "../../stores/onboardingStore";
import SaveButton from "./SaveButton";
import { GlobeHemisphereWestIcon } from "@phosphor-icons/react";
import toast from "react-hot-toast";
import { addNewLanguageDetail, patchLanguageDetail, deleteLanguageDetail } from "../../services/operations/languageDetailsAPI";
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

function LanguagesDetails() {
    const {
        expandedSections,
        originalData,
        updateOriginalData,
        languages,
        addLanguages,
        updateLanguages,
        languageForm,
        updateLanguageForm,
        languagesEditingIndex,
        updateLanguagesEditingIndex,
        addLanguage,
        updateAddLanguage,
        removeLanguages
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
        content: languageForm.additionalInfo || "<p>Write your summary...</p>",
        onUpdate: ({ editor }) => {
            updateLanguageForm({additionalInfo: editor.getHTML()});
        },
    });

    const isExpanded = expandedSections.has("languages");

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

                if (key === 'additionalInfo') {
                    const originalText = (originalValue || '').replace(/<[^>]*>/g, '').trim();
                    const newText = (value || '').replace(/<[^>]*>/g, '').trim();
                    return originalText !== newText;
                }

                const normalizedOriginal = (originalValue ?? '').toString().trim();
                const normalizedNew = (value ?? '').toString().trim();
                return normalizedOriginal !== normalizedNew;
            })
        );
    }


    const handleSave = async () => {
        if (!languageForm.name.trim()) {
            toast.error("Language Name should not be empty.", {
                style: {
                    border: '1px solid orange',
                    backgroundColor: 'rgba(255, 165, 0, 0.1)',
                    color: 'orange'
                }
            });
            return;
        }
        try {
            if (languagesEditingIndex === null) {
                console.log("Working")
                const filledData = getFilledFields(languageForm);
                const response = await addNewLanguageDetail(filledData);
                if (response && response._id) {
                    const newLanguages = {...filledData, _id: response._id}
                    await addLanguages(newLanguages);
                    const updatedLanguages = onboardingStore.getState().languages;
                    await updateOriginalData({languages: updatedLanguages});
                    editor.commands.setContent('<p>Write your summary...</p>');
                }          
            } else {
                const original = languages[languagesEditingIndex]
                const updatedFields = getChangedFields(languageForm, original);
                console.log(updatedFields)
                if (Object.keys(updatedFields).length > 0) {
                    await patchLanguageDetail(updatedFields, original._id);
                    updateLanguages(languagesEditingIndex, updatedFields);
                    const updatedLanguages = onboardingStore.getState().languages;
                    await updateOriginalData({languages: updatedLanguages});
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
        updateLanguageForm({
            name: "",
            additionalInfo: "",
            level: "",
            hide: false,
        });
        updateLanguagesEditingIndex(null);
        updateAddLanguage(false);
    }

    const handleEdit = async (index) => {
        updateLanguageForm(originalData.languages[index]);
        updateLanguagesEditingIndex(index);
    }

    const handleAdd = async () => {
        updateLanguageForm({
            name: "",
            additionalInfo: "",
            level: "",
            hide: false, 
        });
        updateAddLanguage(true);
    };

    const handleCancel = async () => {
        updateLanguageForm({
            name: "",
            additionalInfo: "",
            level: "",
            hide: false,
        });
        updateAddLanguage(false);
        updateLanguagesEditingIndex(null);
    }

    const handleDelete = async (index) => {
        try {
            await deleteLanguageDetail(languages[index]._id);
            removeLanguages(index);
        } catch (error) {
            
        }
    }

    React.useEffect(() => {
        if (!editor) return;

        const formContent = languageForm.additionalInfo || "<p>Write your summary...</p>";
        const editorContent = editor.getHTML();

        // Only set content if it's actually different
        if (formContent.trim() !== editorContent.trim()) {
            editor.commands.setContent(formContent);
        }
    }, [languageForm.additionalInfo, editor]);

    return (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden max-w-4xl">
            <SectionHeader 
                title="Languages"
                icon={<GlobeHemisphereWestIcon/>}
                sectionId="languages"
            />

            {isExpanded && (
                <>
                    {(languages.length === 0 || languagesEditingIndex !== null || addLanguage) && (
                        <ProfessionalExpForm 
                            data={languageForm}
                            editor={editor}
                            handleSave={handleSave}
                            handleChange={updateLanguageForm}
                            languagesEditingIndex={languagesEditingIndex}
                            handleCancel={handleCancel}
                            addLanguage={addLanguage}
                        />
                    )}
            
                    {(languages.length > 0 && languagesEditingIndex === null && addLanguage === false) && (
                        <div className="p-6 border-t border-gray-800 space-y-6 w-full">
                            {languages.map((language, index) => (
                                <div key={index} className="border-b pb-2 border-gray-800"> 
                                    <div className="flex justify-between">
                                        <div onClick={() => handleEdit(index)} className="font-semibold hover:text-gray-400">
                                            <p>{language.name}, {language.level && language.level}</p>
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

function ProfessionalExpForm({data, editor, handleSave, handleChange, languagesEditingIndex, addLanguage, handleCancel}) {
    return (
        <div className="p-6 border-t border-gray-800 space-y-6 w-full">
            <h2 className="text-xl font-semibold">
              {languagesEditingIndex !== null ? 'Update Languages' : 'Add Languages'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Language Name
                    </label>
                    <input 
                        type="text"
                        value={data.name ?? ''}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Japanese"
                        onChange={(e) => handleChange({ name: e.target.value})}
                    />
                </div>
                <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Language Level
                    </label>
                    <select
                        value={data.level || ''}
                        onChange={(e) => handleChange({level: e.target.value})}
                        className="w-full mr-3 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                        <option value="">Language Level</option>
                        <option value="BASIC">Basic</option>
                        <option value="CONVERSATIONAL">Conversational</option>
                        <option value="PROFICIENT">Proficient</option>
                        <option value="FLUENT">Fluent</option>
                        <option value="NATIVE">Native</option>
                    </select>
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
                {(languagesEditingIndex !== null || addLanguage) && (
                    <button className="px-3 py-1.5 text-sm md:px-4 md:py-2 md:text-sm bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 flex items-center space-x-2 font-medium rounded-lg transition-all transform hover:scale-105 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-950 disabled:transform-none disabled:opacity-50" 
                    onClick={() => {handleCancel()}}>Cancel</button>
                )}
                <SaveButton itemId="languages" onSave={handleSave}/>
            </div>
        </div>
    )
}

export default LanguagesDetails;