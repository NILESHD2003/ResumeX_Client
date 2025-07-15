import { create } from "zustand";
import { persist } from "zustand/middleware";

export const jobIdStore = create()(
    persist(
        (set, get) => ({
            jobID: null,
            
            setJobID: (id) => set({ jobID: id }),

            clearJobID: () => set({ jobID: null }),
        }),
        {
            name: "job-id-storage",
        }
    )
)