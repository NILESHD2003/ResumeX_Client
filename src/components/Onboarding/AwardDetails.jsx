import React from "react";
import SectionHeader from "./SectionHeader";
import { onboardingStore } from "../../stores/onboardingStore";
import SaveButton from "./SaveButton";
import { TrophyIcon } from "@phosphor-icons/react";
import toast from "react-hot-toast";
import { addNewAwardDetail, patchAwardDetail, deleteAwardDetail } from "../../services/operations/awardDetailsAPI";
import { Trash } from "lucide-react";

function AwardDetails() {
    const {
        expandedSections,
        originalData,
        updateOriginalData,
        awards,
        addAwards,
        updateAwards,
        awardForm,
        updateAwardForm,
        awardsEditingIndex,
        updateAwardsEditingIndex,
        addAward,
        updateAddAward,
        removeAwards,
        completedSections,
        markSectionComplete,
        removeSectionComplete
    } = onboardingStore();

    const isExpanded = expandedSections.has("awards");

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

                if (key === 'date') {
                    const originalDate = originalValue
                        ? new Date(originalValue).toISOString().split('T')[0]
                        : '';
                    const newDate = value
                        ? new Date(value).toISOString().split('T')[0]
                        : '';
                    return originalDate !== newDate;
                }

                const normalizedOriginal = (originalValue ?? '').toString().trim();
                const normalizedNew = (value ?? '').toString().trim();
                return normalizedOriginal !== normalizedNew;
            })
        );
    }

    const handleSave = async () => {
        if (!awardForm.title.trim()) {
            toast.error("Award Title should not be empty.", {
                style: {
                    border: '1px solid orange',
                    backgroundColor: 'rgba(255, 165, 0, 0.1)',
                    color: 'orange'
                }
            });
            return;
        }
        try {
            if (awardsEditingIndex === null) {
                console.log("Working")
                const filledData = getFilledFields(awardForm);
                const response = await addNewAwardDetail(filledData);
                if (response && response._id) {
                    const newAward = {...filledData, _id: response._id}
                    await addAwards(newAward);
                    const updatedAward = onboardingStore.getState().awards;
                    await updateOriginalData({awards: updatedAward});
                    await markSectionComplete("awards");
                }          
            } else {
                const original = awards[awardsEditingIndex]
                const updatedFields = getChangedFields(awardForm, original);
                console.log(updatedFields)
                if (Object.keys(updatedFields).length > 0) {
                    await patchAwardDetail(updatedFields, original._id);
                    updateAwards(awardsEditingIndex, updatedFields);
                    const updatedAward = onboardingStore.getState().awards;
                    await updateOriginalData({awards: updatedAward});
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
        updateAwardForm({
            title: "",
            link: "",
            issuer: "",
            date: "",
            hide: false,
        });
        updateAwardsEditingIndex(null);
        updateAddAward(false);
    }

    const handleEdit = async (index) => {
        updateAwardForm(originalData.awards[index]);
        updateAwardsEditingIndex(index);
    }

    const handleAdd = () => {
        updateAwardForm({
            title: "",
            link: "",
            issuer: "",
            date: "",
            hide: false,
        });
        updateAddAward(true);
    };

    const handleCancel = () => {
        updateAwardForm({
            title: "",
            link: "",
            issuer: "",
            date: "",
            hide: false,
        });
        updateAddAward(false);
        updateAwardsEditingIndex(null);
    }

    const handleDelete = async (index) => {
        try {
            await deleteAwardDetail(awards[index]._id);
            removeAwards(index);
            const updatedAward = onboardingStore.getState().awards;
            if (updatedAward.length === 0 && completedSections.has("awards")) {
                await removeSectionComplete("awards");
            }
        } catch (error) {
            
        }
    }

    return (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden max-w-4xl">
            <SectionHeader 
                title="Awards"
                icon={<TrophyIcon/>}
                sectionId="awards"
            />

            {isExpanded && (
                <>
                    {(awards.length === 0 || awardsEditingIndex !== null || addAward) && (
                        <AwardForm
                            data={awardForm}
                            handleSave={handleSave}
                            handleChange={updateAwardForm}
                            awardsEditingIndex={awardsEditingIndex}
                            handleCancel={handleCancel}
                            addAward={addAward}
                        />
                    )}
            
                    {(awards.length > 0 && awardsEditingIndex === null && addAward === false) && (
                        <div className="p-6 border-t border-gray-800 space-y-6 w-full">
                            {awards.map((award, index) => (
                                <div key={index} className="border-b pb-2 border-gray-800"> 
                                    <div className="flex justify-between">
                                        <div onClick={() => handleEdit(index)} className="font-semibold hover:text-gray-400">
                                            <p>{award.title}, {award.issuer && award.issuer}</p>
                                            <p>{award.date && new Date(award.date).toISOString().split("T")[0]}</p>
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

function AwardForm({data, handleSave, handleChange, awardsEditingIndex, addAward, handleCancel}) {
    return (
        <div className="p-6 border-t border-gray-800 space-y-6 w-full">
            <h2 className="text-xl font-semibold">
              {awardsEditingIndex !== null ? 'Update Award' : 'Add Award'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Award Title
                    </label>
                    <input 
                        type="text"
                        value={data.title ?? ''}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Award Title"
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
                        placeholder="Award Link"
                        onChange={(e) => handleChange({ link: e.target.value})}
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
                        Award Date
                    </label>
                    <input
                        type="date"
                        value={data.date ? new Date(data.date).toISOString().split("T")[0] : ''}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        onChange={(e) => handleChange({ date: e.target.value})}
                    />
                </div>
            </div>
            <div className="flex justify-end gap-2">
                {(awardsEditingIndex !== null || addAward) && (
                    <button className="px-3 py-1.5 text-sm md:px-4 md:py-2 md:text-sm bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 flex items-center space-x-2 font-medium rounded-lg transition-all transform hover:scale-105 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-950 disabled:transform-none disabled:opaissuer-50" 
                    onClick={() => {handleCancel()}}>Cancel</button>
                )}
                <SaveButton itemId="awards" onSave={handleSave}/>
            </div>
        </div>
    )
}

export default AwardDetails;