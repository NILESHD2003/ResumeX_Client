import React from "react";
import SectionHeader from "./SectionHeader";
import { onboardingStore } from "../../stores/onboardingStore";
import SaveButton from "./SaveButton";
import { GraphIcon } from "@phosphor-icons/react";
import toast from "react-hot-toast";
import { addNewReferenceDetail, patchReferenceDetail, deleteReferenceDetail } from "../../services/operations/referenceDetailsAPI";
import { Trash } from "lucide-react";

function ReferencesDetails() {
    const {
        expandedSections,
        originalData,
        updateOriginalData,
        references,
        addReferences,
        updateReferences,
        referenceForm,
        updateReferenceForm,
        referencesEditingIndex,
        updateReferencesEditingIndex,
        addReference,
        updateAddReference,
        removeReferences,
        completedSections,
        markSectionComplete,
        removeSectionComplete
    } = onboardingStore();

    const isExpanded = expandedSections.has("references");

    function getFilledFields(data) {
        return Object.fromEntries(
            Object.entries(data).filter(([key, value]) => {
            if (value === '' || value === null || value === undefined) return false;

            return true;
            })
        );
    }

    function getChangedFields(newData, originalData) {
        return Object.fromEntries(
            Object.entries(newData).filter(([key, value]) => {
                const originalValue = originalData[key];

                const normalizedOriginal = (originalValue ?? '').toString().trim();
                const normalizedNew = (value ?? '').toString().trim();
                return normalizedOriginal !== normalizedNew;
            })
        );
    }

    const handleSave = async () => {
        if (!referenceForm.name.trim()) {
            toast.error("Reference Name should not be empty.", {
                style: {
                    border: '1px solid orange',
                    backgroundColor: 'rgba(255, 165, 0, 0.1)',
                    color: 'orange'
                }
            });
            return;
        }
        try {
            if (referencesEditingIndex === null) {
                console.log("Working")
                const filledData = getFilledFields(referenceForm);
                const response = await addNewReferenceDetail(filledData);
                if (response && response._id) {
                    const newReference = {...filledData, _id: response._id}
                    await addReferences(newReference);
                    const updatedReference = onboardingStore.getState().references;
                    await updateOriginalData({references: updatedReference});
                    await markSectionComplete("references");
                }          
            } else {
                const original = references[referencesEditingIndex]
                const updatedFields = getChangedFields(referenceForm, original);
                console.log(updatedFields)
                if (Object.keys(updatedFields).length > 0) {
                    await patchReferenceDetail(updatedFields, original._id);
                    updateReferences(referencesEditingIndex, updatedFields);
                    const updatedReference = onboardingStore.getState().references;
                    await updateOriginalData({references: updatedReference});
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
        updateReferenceForm({
            name: "",
            link: "",
            jobTitle: "",
            organization: "",
            email: "",
            phone: "",
            hide: false,
        });
        updateReferencesEditingIndex(null);
        updateAddReference(false);
    }

    const handleEdit = async (index) => {
        updateReferenceForm(originalData.references[index]);
        updateReferencesEditingIndex(index);
    }

    const handleAdd = () => {
        updateReferenceForm({
            name: "",
            link: "",
            jobTitle: "",
            organization: "",
            email: "",
            phone: "",
            hide: false,    
        });
        updateAddReference(true);
    };

    const handleCancel = () => {
        updateReferenceForm({
            name: "",
            link: "",
            jobTitle: "",
            organization: "",
            email: "",
            phone: "",
            hide: false,   
        });
        updateAddReference(false);
        updateReferencesEditingIndex(null);
    }

    const handleDelete = async (index) => {
        try {
            await deleteReferenceDetail(references[index]._id);
            removeReferences(index);
            const updatedReferences = onboardingStore.getState().references;
            if (updatedReferences.length === 0 && completedSections.has("references")) {
                await removeSectionComplete("references");
            }
        } catch (error) {
            
        }
    }

    return (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden max-w-4xl">
            <SectionHeader 
                title="References"
                icon={<GraphIcon/>}
                sectionId="references"
            />

            {isExpanded && (
                <>
                    {(references.length === 0 || referencesEditingIndex !== null || addReference) && (
                        <ReferenceForm 
                            data={referenceForm}
                            handleSave={handleSave}
                            handleChange={updateReferenceForm}
                            referencesEditingIndex={referencesEditingIndex}
                            handleCancel={handleCancel}
                            addReference={addReference}
                        />
                    )}
            
                    {(references.length > 0 && referencesEditingIndex === null && addReference === false) && (
                        <div className="p-6 border-t border-gray-800 space-y-6 w-full">
                            {references.map((reference, index) => (
                                <div key={index} className="border-b pb-2 border-gray-800"> 
                                    <div className="flex justify-between">
                                        <div onClick={() => handleEdit(index)} className="font-semibold hover:text-gray-400">
                                            <p>{reference.name}</p>
                                            <p>{reference.organization && reference.organization}, {reference.jobTitle && reference.jobTitle}</p>
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

function ReferenceForm({data, handleSave, handleChange, referencesEditingIndex, addReference, handleCancel}) {
    return (
        <div className="p-6 border-t border-gray-800 space-y-6 w-full">
            <h2 className="text-xl font-semibold">
              {referencesEditingIndex !== null ? 'Update Reference' : 'Add Reference'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Reference Name
                    </label>
                    <input 
                        type="text"
                        value={data.name ?? ''}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Reference Name"
                        onChange={(e) => handleChange({ name: e.target.value})}
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Reference Link
                    </label>
                    <input 
                        type="text"
                        value={data.link ?? ''}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Reference Link"
                        onChange={(e) => handleChange({ link: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Job Title
                    </label>
                    <input 
                        type="text"
                        value={data.jobTitle ?? ''}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="xyz position"
                        onChange={(e) => handleChange({ jobTitle: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Organization
                    </label>
                    <input 
                        type="text"
                        value={data.organization ?? ''}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="XYZ org"
                        onChange={(e) => handleChange({ organization: e.target.value})}
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email
                    </label>
                    <input 
                        type="text"
                        value={data.email ?? ''}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="xyz@mail.com"
                        onChange={(e) => handleChange({ email: e.target.value})}
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Phone No.
                    </label>
                    <input 
                        type="text"
                        value={data.phone ?? ''}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="+91 1234567890"
                        onChange={(e) => handleChange({ phone: e.target.value})}
                    />
                </div>
            </div>
            <div className="flex justify-end gap-2">
                {(referencesEditingIndex !== null || addReference) && (
                    <button className="px-3 py-1.5 text-sm md:px-4 md:py-2 md:text-sm bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 flex items-center space-x-2 font-medium rounded-lg transition-all transform hover:scale-105 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-950 disabled:transform-none disabled:opaissuer-50" 
                    onClick={() => {handleCancel()}}>Cancel</button>
                )}
                <SaveButton itemId="references" onSave={handleSave}/>
            </div>
        </div>
    )
}

export default ReferencesDetails;