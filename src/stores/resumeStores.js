import { create } from "zustand";
import { persist } from "zustand/middleware";

export const resumeStore = create()(
    persist(
        (set, get) => ({
            resumes: [],
            
            setResumes: (newResumes) => {
                set({ resumes: newResumes })
            },

            addResume: (resume) => {
                set({ resumes: [...get().resumes, resume] })
            },

            editingResume: {},

            setEditingResume: (id) => {
                const resume = get().resumes.find((r) => r._id === id);
                if (resume) {
                    set({editingResume: resume});
                }
            },
            
        }),
        {
            name: "generated-resume-storage",
        }
    )
)