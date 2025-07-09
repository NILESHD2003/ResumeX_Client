import React from "react";
import SectionHeader from "./SectionHeader";
import { onboardingStore } from "../../stores/onboardingStore";
import SaveButton from "./SaveButton";
import { NewspaperIcon } from "@phosphor-icons/react";
import toast from "react-hot-toast";
import { addNewPublicationDetail, patchPublicationDetail, deletePublicationDetail } from "../../services/operations/publicationDetailsAPI";
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

function PublicationDetails() {
    const {
        expandedSections,
        originalData,
        updateOriginalData,
        publications,
        addPublications,
        updatePublications,
        publicationForm,
        updatePublicationForm,
        publicationsEditingIndex,
        updatePublicationsEditingIndex,
        addPublication,
        updateAddPublication,
        removePublications
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
        content: publicationForm.description || "<p>Write your summary...</p>",
        onUpdate: ({ editor }) => {
            updatePublicationForm({description: editor.getHTML()});
        },
    });

    const isExpanded = expandedSections.has("publications");

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

                if (key === 'description') {
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
        if (!publicationForm.title.trim()) {
            toast.error("Publication should not be empty.", {
                style: {
                    border: '1px solid orange',
                    backgroundColor: 'rgba(255, 165, 0, 0.1)',
                    color: 'orange'
                }
            });
            return;
        }
        try {
            if (publicationsEditingIndex === null) {
                console.log("Working")
                const filledData = getFilledFields(publicationForm);
                const response = await addNewPublicationDetail(filledData);
                if (response && response._id) {
                    const newPublication = {...filledData, _id: response._id}
                    await addPublications(newPublication);
                    const updatedPublication = onboardingStore.getState().publications;
                    await updateOriginalData({publications: updatedPublication});
                    
                    // Clear tiptap content
                    editor.commands.setContent('<p>Write your summary...</p>');
                }          
            } else {
                const original = publications[publicationsEditingIndex]
                const updatedFields = getChangedFields(publicationForm, original);
                console.log(updatedFields)
                if (Object.keys(updatedFields).length > 0) {
                    await patchPublicationDetail(updatedFields, original._id);
                    updatePublications(publicationsEditingIndex, updatedFields);
                    const updatedPublication = onboardingStore.getState().publications;
                    await updateOriginalData({publications: updatedPublication});
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
        updatePublicationForm({
            title: "",
            link: "",
            publisher: "",
            date: "",
            description: "",
            hide: false,
        });
        updatePublicationsEditingIndex(null);
        updateAddPublication(false);
    }

    const handleEdit = async (index) => {
        updatePublicationForm(originalData.publications[index]);
        updatePublicationsEditingIndex(index);
    }

    const handleAdd = () => {
        updatePublicationForm({
            title: "",
            link: "",
            publisher: "",
            date: "",
            description: "",
            hide: false,
        });
        updateAddPublication(true);
    };

    const handleCancel = () => {
        updatePublicationForm({
            title: "",
            link: "",
            publisher: "",
            date: "",
            description: "",
            hide: false,   
        });
        updateAddPublication(false);
        updatePublicationsEditingIndex(null);
    }

    const handleDelete = async (index) => {
        try {
            await deletePublicationDetail(publications[index]._id);
            removePublications(index);
        } catch (error) {
            
        }
    }

    React.useEffect(() => {
        if (!editor) return;

        const formContent = publicationForm.description || "<p>Write your summary...</p>";
        const editorContent = editor.getHTML();

        // Only set content if it's actually different
        if (formContent.trim() !== editorContent.trim()) {
            editor.commands.setContent(formContent);
        }
    }, [publicationForm.description, editor]);


    return (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden max-w-4xl">
            <SectionHeader 
                title="Publications"
                icon={<NewspaperIcon/>}
                sectionId="publications"
            />

            {isExpanded && (
                <>
                    {(publications.length === 0 || publicationsEditingIndex !== null || addPublication) && (
                        <PublicationForm 
                            data={publicationForm}
                            editor={editor}
                            handleSave={handleSave}
                            handleChange={updatePublicationForm}
                            publicationsEditingIndex={publicationsEditingIndex}
                            handleCancel={handleCancel}
                            addPublication={addPublication}
                        />
                    )}
            
                    {(publications.length > 0 && publicationsEditingIndex === null && addPublication === false) && (
                        <div className="p-6 border-t border-gray-800 space-y-6 w-full">
                            {publications.map((publication, index) => (
                                <div key={index} className="border-b pb-2 border-gray-800"> 
                                    <div className="flex justify-between">
                                        <div onClick={() => handleEdit(index)} className="font-semibold hover:text-gray-400">
                                            <p>{publication.title}, {publication.publisher && publication.publisher}</p>
                                            <p>{publication.date && new Date(publication.date).toISOString().split("T")[0]}</p>
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

function PublicationForm({data, editor, handleSave, handleChange, publicationsEditingIndex, addPublication, handleCancel}) {
    return (
        <div className="p-6 border-t border-gray-800 space-y-6 w-full">
            <h2 className="text-xl font-semibold">
              {publicationsEditingIndex !== null ? 'Update Publication' : 'Add Publication'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Publication
                    </label>
                    <input 
                        type="text"
                        value={data.title ?? ''}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Publication Title"
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
                        placeholder="publisher.com\publication"
                        onChange={(e) => handleChange({ link: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Publisher
                    </label>
                    <input 
                        type="text"
                        value={data.publisher ?? ''}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Publisher Name"
                        onChange={(e) => handleChange({ publisher: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Publication Date
                    </label>
                    <input
                        type="date"
                        value={data.date ? new Date(data.date).toISOString().split("T")[0] : ''}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        onChange={(e) => handleChange({ date: e.target.value})}
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Description
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
                {(publicationsEditingIndex !== null || addPublication) && (
                    <button className="px-3 py-1.5 text-sm md:px-4 md:py-2 md:text-sm bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 flex items-center space-x-2 font-medium rounded-lg transition-all transform hover:scale-105 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-950 disabled:transform-none disabled:opaissuer-50" 
                    onClick={() => {handleCancel()}}>Cancel</button>
                )}
                <SaveButton itemId="publications" onSave={handleSave}/>
            </div>
        </div>
    )
}

export default PublicationDetails;