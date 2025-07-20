import React from "react";
import SectionHeader from "./SectionHeader";
import { onboardingStore } from "../../stores/onboardingStore";
import SaveButton from "./SaveButton";
import { FolderOpenIcon } from "@phosphor-icons/react";
import toast from "react-hot-toast";
import { addNewProjectDetail, patchProjectDetail, deleteProjectDetail } from "../../services/operations/projectDetailsAPI";
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

function ProjectDetails() {
    const {
        expandedSections,
        originalData,
        updateOriginalData,
        projects,
        addProjects,
        updateProjects,
        projectForm,
        updateProjectForm,
        projectsEditingIndex,
        updateProjectsEditingIndex,
        addProject,
        updateAddProject,
        removeProjects,
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
        content: projectForm.description || "<p>Write your summary...</p>",
        onUpdate: ({ editor }) => {
            updateProjectForm({description: editor.getHTML()});
        },
    });

    const isExpanded = expandedSections.has("projects");

    const linkInputRefs = React.useRef([]);

    const addLinkField = () => {
        updateProjectForm({
            links: [...(projectForm.links || []), { url: '', platform: '' }]
        });

        setTimeout(() => {
            const lastIndex = (projectForm.links?.length || 0);
            linkInputRefs.current[lastIndex]?.focus();
        }, 0);
    };


    const updateLink = (index, field, value) => {
        const updatedLinks = [...(projectForm.links || [])];
        updatedLinks[index][field] = value;
        updateProjectForm({ links: updatedLinks });
    };

    const deleteLink = (index) => {
        const updatedLinks = (projectForm.links || []).filter((_, i) => i !== index);
        updateProjectForm({ links: updatedLinks });
    };


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

    function isValidURL(str) {
        try {
            new URL(str);
            return true;
        } catch (_) {
            return false;
        }
    }

    const handleSave = async () => {
        if (!projectForm.title.trim()) {
            toast.error("Project Title should not be empty.", {
                style: {
                    border: '1px solid orange',
                    backgroundColor: 'rgba(255, 165, 0, 0.1)',
                    color: 'orange'
                }
            });
            return;
        }
        for (let i = 0; i < (projectForm.links || []).length; i++) {
            const { platform, url } = projectForm.links[i];

            if (!platform || !url) {
                toast.error(`Link ${i + 1} is incomplete. Both platform and URL are required.`, {
                style: {
                    border: '1px solid orange',
                    backgroundColor: 'rgba(255, 165, 0, 0.1)',
                    color: 'orange',
                },
                });
                return;
            }

            if (!isValidURL(url)) {
                toast.error(`Link ${i + 1} has an invalid URL.`, {
                style: {
                    border: '1px solid red',
                    backgroundColor: 'rgba(255, 0, 0, 0.1)',
                    color: 'red',
                },
                });
                return;
            }
        }

        try {
            if (projectsEditingIndex === null) {
                console.log("Working")
                const filledData = getFilledFields(projectForm);
                const response = await addNewProjectDetail(filledData);
                if (response && response._id) {
                    const newProject = {...filledData, _id: response._id}
                    await addProjects(newProject);
                    const updatedProject = onboardingStore.getState().projects;
                    await updateOriginalData({projects: updatedProject});
                    await markSectionComplete("projects");
                }          
            } else {
                const original = projects[projectsEditingIndex]
                const updatedFields = getChangedFields(projectForm, original);
                console.log(updatedFields)
                if (Object.keys(updatedFields).length > 0) {
                    await patchProjectDetail(updatedFields, original._id);
                    updateProjects(projectsEditingIndex, updatedFields);
                    const updatedProject = onboardingStore.getState().projects;
                    await updateOriginalData({projects: updatedProject});
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
        updateProjectForm({
            title: '',
            subtitle: '',
            description: '',
            startDate: '',
            endDate: '',
            links: [],
            hide: false,
        });
        updateProjectsEditingIndex(null);
        updateAddProject(false);
    }

    const handleEdit = async (index) => {
        updateProjectForm(originalData.projects[index]);
        updateProjectsEditingIndex(index);
    }

    const handleAdd = () => {
        updateProjectForm({
            title: '',
            subtitle: '',
            description: '',
            startDate: '',
            endDate: '',
            links: [],
            hide: false,    
        });
        updateAddProject(true);
    };

    const handleCancel = () => {
        updateProjectForm({
            title: '',
            subtitle: '',
            description: '',
            startDate: '',
            endDate: '',
            links: [],
            hide: false,   
        });
        updateAddProject(false);
        updateProjectsEditingIndex(null);
    }

    const handleDelete = async (index) => {
        try {
            await deleteProjectDetail(projects[index]._id);
            removeProjects(index);
            const updatedProjects = onboardingStore.getState().projects;
            if (updatedProjects.length === 0 && completedSections.has("projects")) {
                await removeSectionComplete("projects");
            }
        } catch (error) {
            
        }
    }

    React.useEffect(() => {
        if (!editor) return;

        const formContent = projectForm.description || "<p>Write your summary...</p>";
        const editorContent = editor.getHTML();

        // Only set content if it's actually different
        if (formContent.trim() !== editorContent.trim()) {
            editor.commands.setContent(formContent);
        }
    }, [projectForm.description, editor]);


    return (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden max-w-4xl">
            <SectionHeader 
                title="Projects"
                icon={<FolderOpenIcon/>}
                sectionId="projects"
            />

            {isExpanded && (
                <>
                    {(projects.length === 0 || projectsEditingIndex !== null || addProject) && (
                        <ProjectForm 
                            data={projectForm}
                            editor={editor}
                            handleSave={handleSave}
                            handleChange={updateProjectForm}
                            projectsEditingIndex={projectsEditingIndex}
                            handleCancel={handleCancel}
                            addProject={addProject}
                            addLinkField={addLinkField}
                            updateLink={updateLink}
                            deleteLink={deleteLink}
                            linkInputRefs={linkInputRefs}
                        />
                    )}
            
                    {(projects.length > 0 && projectsEditingIndex === null && addProject === false) && (
                        <div className="p-6 border-t border-gray-800 space-y-6 w-full">
                            {projects.map((project, index) => (
                                <div key={index} className="border-b pb-2 border-gray-800"> 
                                    <div className="flex justify-between">
                                        <div onClick={() => handleEdit(index)} className="font-semibold hover:text-gray-400">
                                            <p>{project.title}, {project.subtitle && project.subtitle}</p>
                                            <p>{project.startDate && new Date(project.startDate).toISOString().split("T")[0]} - {project.endDate && project.endDate}</p>
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

function ProjectForm({data, editor, handleSave, handleChange, projectsEditingIndex, addProject, handleCancel, addLinkField, updateLink, deleteLink, linkInputRefs}) {
    return (
        <div className="p-6 border-t border-gray-800 space-y-6 w-full">
            <h2 className="text-xl font-semibold">
              {projectsEditingIndex !== null ? 'Update Project' : 'Add Project'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Project Title
                    </label>
                    <input 
                        type="text"
                        value={data.title ?? ''}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Title"
                        onChange={(e) => handleChange({ title: e.target.value})}
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Subtitle
                    </label>
                    <input 
                        type="text"
                        value={data.subtitle ?? ''}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Subtitle"
                        onChange={(e) => handleChange({ subtitle: e.target.value})}
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
                        End Date
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
                        Project Links
                    </label>
                    {(data.links || []).map((link, index) => (
                        <div key={index} className="grid grid-cols-5 gap-4 mb-2">
                            <select
                            value={link.platform}
                            onChange={(e) => updateLink(index, "platform", e.target.value)}
                            className="w-full col-span-1 mr-3 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                <option value="">Platform</option>
                                <option value="GITHUB">Github</option>
                                <option value="WEBSITE">Website</option>
                                <option value="PLAY_STORE"> Store</option>
                                <option value="APP_STORE">App Store</option>
                                <option value="OTHER">Other</option>
                            </select>
                            <div className="relative w-full col-span-4">
                                <input
                                    ref={(el) => (linkInputRefs.current[index] = el)}
                                    type="text"
                                    value={link.url}
                                    onChange={(e) => updateLink(index, "url", e.target.value)}
                                    placeholder="https://..."
                                    className="w-full pr-10 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                                <Trash
                                    className="h-5 w-5 text-[#0A66C2] hover:text-white absolute top-1/2 -translate-y-1/2 right-3 cursor-pointer"
                                    onClick={() => deleteLink(index)}
                                />
                            </div>
                        </div>
                    ))}
                    <div className="mt-2">
                        <button
                            type="button"
                            onClick={addLinkField}
                            className="w-full px-3 py-2 border justify-center border-gray-600 hover:border-indigo-500 hover:text-white rounded-lg transition flex items-center gap-2"
                        >
                            + Add Link
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex justify-end gap-2">
                {(projectsEditingIndex !== null || addProject) && (
                    <button className="px-3 py-1.5 text-sm md:px-4 md:py-2 md:text-sm bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 flex items-center space-x-2 font-medium rounded-lg transition-all transform hover:scale-105 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-950 disabled:transform-none disabled:opaissuer-50" 
                    onClick={() => {handleCancel()}}>Cancel</button>
                )}
                <SaveButton itemId="projects" onSave={handleSave}/>
            </div>
        </div>
    )
}

export default ProjectDetails;