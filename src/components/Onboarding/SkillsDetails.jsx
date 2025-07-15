import React, { useState } from "react";
import SectionHeader from "./SectionHeader";
import { onboardingStore } from "../../stores/onboardingStore";
import SaveButton from "./SaveButton";
import { PuzzlePieceIcon } from "@phosphor-icons/react";
import toast from "react-hot-toast";
import { addNewSkillDetail, patchSkillDetail, deleteSkillDetail } from "../../services/operations/skillsDetailsAPI";
import { Trash, X } from "lucide-react";

function SkillDetails() {
    const {
        expandedSections,
        originalData,
        updateOriginalData,
        skills,
        addSkills,
        updateSkills,
        skillForm,
        updateSkillForm,
        skillsEditingIndex,
        updateSkillsEditingIndex,
        addSkill,
        updateAddSkill,
        removeSkills,
        completedSections,
        markSectionComplete,
        removeSectionComplete
    } = onboardingStore();

    const isExpanded = expandedSections.has("skills");

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

                // Handle arrays of primitives (deep compare)
                if (Array.isArray(value) && Array.isArray(originalValue)) {
                    return JSON.stringify(value) !== JSON.stringify(originalValue);
                }

                // Normalize null, undefined, and empty strings
                const normalizedOriginal = (originalValue ?? '').toString().trim();
                const normalizedNew = (value ?? '').toString().trim();

                return normalizedOriginal !== normalizedNew;
            })
        );
    }

    const handleSave = async () => {
        if (!skillForm.name.trim()) {
            toast.error("Skill Name should not be empty.", {
                style: {
                    border: '1px solid orange',
                    backgroundColor: 'rgba(255, 165, 0, 0.1)',
                    color: 'orange'
                }
            });
            return;
        }
        try {
            if (skillsEditingIndex === null) {
                console.log("Working")
                const filledData = getFilledFields(skillForm);
                const response = await addNewSkillDetail(filledData);
                if (response && response._id) {
                    const newSkills = {...filledData, _id: response._id}
                    await addSkills(newSkills);
                    const updatedSkills = onboardingStore.getState().skills;
                    await updateOriginalData({skills: updatedSkills});
                    await markSectionComplete("skills");
                }          
            } else {
                const original = skills[skillsEditingIndex]
                const updatedFields = getChangedFields(skillForm, original);
                console.log(updatedFields)
                if (Object.keys(updatedFields).length > 0) {
                    await patchSkillDetail(updatedFields, original._id);
                    updateSkills(skillsEditingIndex, updatedFields);
                    const updatedSkills = onboardingStore.getState().skills;
                    await updateOriginalData({skills: updatedSkills});
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
        updateSkillForm({
            name: "",
            subSkills: [],
            level: "",
            hide: false,
        });
        updateSkillsEditingIndex(null);
        updateAddSkill(false);
    }

    const handleEdit = async (index) => {
        updateSkillForm(originalData.skills[index]);
        updateSkillsEditingIndex(index);
    }

    const handleAdd = () => {
        updateSkillForm({
            name: "",
            subSkills: [],
            level: "",
            hide: false, 
        });
        updateAddSkill(true);
    };

    const handleCancel = () => {
        updateSkillForm({
            name: "",
            subSkills: [],
            level: "",
            hide: false,
        });
        updateAddSkill(false);
        updateSkillsEditingIndex(null);
    }

    const handleDelete = async (index) => {
        try {
            await deleteSkillDetail(skills[index]._id);
            removeSkills(index);
            const updatedSkills = onboardingStore.getState().skills;
            if (updatedSkills.length === 0 && completedSections.has("skills")) {
                await removeSectionComplete("skills");
            }
        } catch (error) {
            
        }
    }

    return (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden max-w-4xl">
            <SectionHeader 
                title="Skills"
                icon={<PuzzlePieceIcon/>}
                sectionId="skills"
            />

            {isExpanded && (
                <>
                    {(skills.length === 0 || skillsEditingIndex !== null || addSkill) && (
                        <SkillForm 
                            data={skillForm}
                            handleSave={handleSave}
                            handleChange={updateSkillForm}
                            skillsEditingIndex={skillsEditingIndex}
                            handleCancel={handleCancel}
                            addSkill={addSkill}
                        />
                    )}
            
                    {(skills.length > 0 && skillsEditingIndex === null && addSkill === false) && (
                        <div className="p-6 border-t border-gray-800 space-y-6 w-full">
                            {skills.map((skill, index) => (
                                <div key={index} className="border-b pb-2 border-gray-800"> 
                                    <div className="flex justify-between">
                                        <div onClick={() => handleEdit(index)} className="font-semibold hover:text-gray-400">
                                            <p>{skill.name}, {skill.level && skill.level}</p>
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

function SkillForm({data, handleSave, handleChange, skillsEditingIndex, addSkill, handleCancel}) {
    const [subSkillInput, setSubSkillInput] = useState("");

    const handleSubSkillKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const newSkill = subSkillInput.trim();
            if (newSkill && !data.subSkills.includes(newSkill)) {
                handleChange({ subSkills: [...data.subSkills, newSkill] });
                setSubSkillInput("");
            }
        }
    };

    const removeSubSkill = (skillToRemove) => {
        handleChange({
            subSkills: data.subSkills.filter(skill => skill !== skillToRemove),
        });
    };

    return (
        <div className="p-6 border-t border-gray-800 space-y-6 w-full">
            <h2 className="text-xl font-semibold">
              {skillsEditingIndex !== null ? 'Update Skills' : 'Add Skills'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Skill Name
                    </label>
                    <input 
                        type="text"
                        value={data.name ?? ''}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Technical"
                        onChange={(e) => handleChange({ name: e.target.value})}
                    />
                </div>
                <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Skill Level
                    </label>
                    <select
                        value={data.level || ''}
                        onChange={(e) => handleChange({level: e.target.value})}
                        className="w-full mr-3 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                        <option key="" value="">Skill level</option>
                        <option key="BEGINEER" value="BEGINEER">Begineer</option>
                        <option key="AMATUER" value="AMATUER">Amatuer</option>
                        <option key="COMPETENT" value="COMPETENT">Competent</option>
                        <option key="PROFICIENT" value="PROFICIENT">Proficient</option>
                        <option key="EXPERT" value="EXPERT">Expert</option>
                    </select>
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Sub-Skills
                    </label>
                    <input
                        type="text"
                        value={subSkillInput}
                        onChange={(e) => setSubSkillInput(e.target.value)}
                        onKeyDown={handleSubSkillKeyDown}
                        placeholder="Press Enter to add sub-skill"
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <div className="flex flex-wrap gap-2 mt-2">
                        {data.subSkills?.map((skill, idx) => (
                            <span
                                key={idx}
                                className="flex items-center bg-indigo-600 text-white rounded-full px-3 py-1 text-sm"
                            >
                                {skill}
                                <X
                                    className="ml-2 h-4 w-4 cursor-pointer hover:text-gray-200"
                                    onClick={() => removeSubSkill(skill)}
                                />
                            </span>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex justify-end gap-2">
                {(skillsEditingIndex !== null || addSkill) && (
                    <button className="px-3 py-1.5 text-sm md:px-4 md:py-2 md:text-sm bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 flex items-center space-x-2 font-medium rounded-lg transition-all transform hover:scale-105 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-950 disabled:transform-none disabled:opacity-50" 
                    onClick={() => {handleCancel()}}>Cancel</button>
                )}
                <SaveButton itemId="skills" onSave={handleSave}/>
            </div>
        </div>
    )
}

export default SkillDetails;