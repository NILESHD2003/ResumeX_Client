import React from "react";
import SectionHeader from "./SectionHeader";
import { onboardingStore } from "../../stores/onboardingStore";
import SaveButton from "./SaveButton";
import { BuildingOfficeIcon } from "@phosphor-icons/react";
import toast from "react-hot-toast";
import { addNewOrganizationDetail, patchOrganizationDetail, deleteOrganizationDetail } from "../../services/operations/organizationDetailsAPI";
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

function OrganizationDetails() {
    const {
        expandedSections,
        originalData,
        updateOriginalData,
        organizations,
        addOrganizations,
        updateOrganizations,
        organizationForm,
        updateOrganizationForm,
        organizationsEditingIndex,
        updateOrganizationsEditingIndex,
        addOrganization,
        updateAddOrganization,
        removeOrganizations
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
        content: organizationForm.description || "<p>Write your summary...</p>",
        onUpdate: ({ editor }) => {
            updateOrganizationForm({description: editor.getHTML()});
        },
    });

    const isExpanded = expandedSections.has("organizations");

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

                if (key === 'startDate' || key === 'endDate') {
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
        if (!organizationForm.name.trim()) {
            toast.error("Organization Name should not be empty.", {
                style: {
                    border: '1px solid orange',
                    backgroundColor: 'rgba(255, 165, 0, 0.1)',
                    color: 'orange'
                }
            });
            return;
        }
        try {
            if (organizationsEditingIndex === null) {
                console.log("Working")
                const filledData = getFilledFields(organizationForm);
                const response = await addNewOrganizationDetail(filledData);
                if (response && response._id) {
                    const newOrganization = {...filledData, _id: response._id}
                    await addOrganizations(newOrganization);
                    const updatedOrganization = onboardingStore.getState().organizations;
                    await updateOriginalData({organizations: updatedOrganization});
                    
                    // Clear tiptap content
                    editor.commands.setContent('<p>Write your summary...</p>');
                }          
            } else {
                const original = organizations[organizationsEditingIndex]
                const updatedFields = getChangedFields(organizationForm, original);
                console.log(updatedFields)
                if (Object.keys(updatedFields).length > 0) {
                    await patchOrganizationDetail(updatedFields, original._id);
                    updateOrganizations(organizationsEditingIndex, updatedFields);
                    const updatedOrganization = onboardingStore.getState().organizations;
                    await updateOriginalData({organizations: updatedOrganization});
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
        updateOrganizationForm({
            name: '',
            link: '',
            country: '',
            city: '',
            startDate: '',
            endDate: '',
            description: '',
            hide: false
        });
        updateOrganizationsEditingIndex(null);
        updateAddOrganization(false);
    }

    const handleEdit = async (index) => {
        updateOrganizationForm(originalData.organizations[index]);
        updateOrganizationsEditingIndex(index);
    }

    const handleAdd = () => {
        updateOrganizationForm({
            name: '',
            link: '',
            country: '',
            city: '',
            startDate: '',
            endDate: '',
            description: '',
            hide: false    
        });
        updateAddOrganization(true);
    };

    const handleCancel = () => {
        updateOrganizationForm({
            name: '',
            link: '',
            country: '',
            city: '',
            startDate: '',
            endDate: '',
            description: '',
            hide: false   
        });
        updateAddOrganization(false);
        updateOrganizationsEditingIndex(null);
    }

    const handleDelete = async (index) => {
        try {
            await deleteOrganizationDetail(organizations[index]._id);
            removeOrganizations(index);
        } catch (error) {
            
        }
    }

    React.useEffect(() => {
        if (!editor) return;

        const formContent = organizationForm.description || "<p>Write your summary...</p>";
        const editorContent = editor.getHTML();

        // Only set content if it's actually different
        if (formContent.trim() !== editorContent.trim()) {
            editor.commands.setContent(formContent);
        }
    }, [organizationForm.description, editor]);


    return (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden max-w-4xl">
            <SectionHeader 
                title="Organization"
                icon={<BuildingOfficeIcon/>}
                sectionId="organizations"
            />

            {isExpanded && (
                <>
                    {(organizations.length === 0 || organizationsEditingIndex !== null || addOrganization) && (
                        <OrganizationForm 
                            data={organizationForm}
                            editor={editor}
                            handleSave={handleSave}
                            handleChange={updateOrganizationForm}
                            organizationsEditingIndex={organizationsEditingIndex}
                            handleCancel={handleCancel}
                            addOrganization={addOrganization}
                        />
                    )}
            
                    {(organizations.length > 0 && organizationsEditingIndex === null && addOrganization === false) && (
                        <div className="p-6 border-t border-gray-800 space-y-6 w-full">
                            {organizations.map((organization, index) => (
                                <div key={index} className="border-b pb-2 border-gray-800"> 
                                    <div className="flex justify-between">
                                        <div onClick={() => handleEdit(index)} className="font-semibold hover:text-gray-400">
                                            <p>{organization.name}</p>
                                            <p>{organization.startDate && new Date(organization.startDate).toISOString().split("T")[0]} - {organization.endDate && organization.endDate} | {organization.city && organization.city}, {organization.country && organization.country}</p>
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

function OrganizationForm({data, editor, handleSave, handleChange, organizationsEditingIndex, addOrganization, handleCancel}) {
    return (
        <div className="p-6 border-t border-gray-800 space-y-6 w-full">
            <h2 className="text-xl font-semibold">
              {organizationsEditingIndex !== null ? 'Update Organization' : 'Add Organization'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Organization Name
                    </label>
                    <input 
                        type="text"
                        value={data.name ?? ''}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="XYX org"
                        onChange={(e) => handleChange({ name: e.target.value})}
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Organization Link
                    </label>
                    <input 
                        type="text"
                        value={data.link ?? ''}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="xyz.org"
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
                {(organizationsEditingIndex !== null || addOrganization) && (
                    <button className="px-3 py-1.5 text-sm md:px-4 md:py-2 md:text-sm bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 flex items-center space-x-2 font-medium rounded-lg transition-all transform hover:scale-105 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-950 disabled:transform-none disabled:opacity-50" 
                    onClick={() => {handleCancel()}}>Cancel</button>
                )}
                <SaveButton itemId="organizations" onSave={handleSave}/>
            </div>
        </div>
    )
}

export default OrganizationDetails;