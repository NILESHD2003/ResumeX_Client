import { create } from "zustand";
import { persist } from "zustand/middleware";

export const onboardingStore = create()(
    persist(
        (set, get) => ({
            personalDetails: {
                fullName: '',
                jobTitle: '',
                email: '',
                phone: '',
                location: '',
                personalInfo: '',
                dateOfBirth: '',
                nationality: '',
                passport_govt_id: '',
                maritalStatus: '',
                militaryService: '',
                drivingLicense: '',
                genderPronouns: '',
                visa: '',
                socialLinks: [
                    { platform: 'linkedin', url: '', link: '' },
                    { platform: 'github', url: '', link: '' },
                    { platform: 'twitter', url: '', link: '' },
                    { platform: 'youtube', url: '', link: '' },
                    { platform: 'dribbble', url: '', link: '' },
                    { platform: 'behance', url: '', link: '' },
                    { platform: 'stackoverflow', url: '', link: '' },
                    { platform: 'website', url: '', link: '' },
                ],
            },

            updatePersonalDetails: (details) => {
                set((state) => ({
                    personalDetails: {
                        ...state.personalDetails,
                        ...details
                    }
                }));
            },

            profilePicture: null,

            updateProfilePicture: (file) => {
                set({ profilePicture: file });
            },

            updateSocialLink: (platform, { url, link }) => {
                set((state) => ({
                    personalDetails: {
                        ...state.personalDetails,
                        socialLinks: state.personalDetails.socialLinks.map((item) =>
                            item.platform === platform ? { ...item, url, link } : item
                        )
                    }
                }));
            },

            expandedSections: new Set(),
            editingItems: new Set(),
            savingItems: new Set(),
            completedSections: new Set(),

            toggleSection: (sectionId) => {
                set((state) => {
                    const newExpanded = new Set(state.expandedSections);
                    newExpanded.has(sectionId)
                        ? newExpanded.delete(sectionId)
                        : newExpanded.add(sectionId);
                    return { expandedSections: newExpanded };
                });
            },

            startEditing: (itemId) => {
                set((state) => ({
                    editingItems: new Set([...state.editingItems, itemId])
                }));
            },

            stopEditing: (itemId) => {
                set((state) => ({
                    editingItems: new Set([...state.editingItems].filter((id) => id !== itemId))
                }));
            },

            markSectionComplete: (sectionId) => {
                set((state) => ({
                    completedSections: new Set([...state.completedSections, sectionId])
                }));
            }
        }),
        {
            name: "onboarding-storage",
            partialize: (state) => ({
                completedSections: Array.from(state.completedSections)
            }),
            onRehydrateStorage: () => (state) => {
                if (state) {
                    state.completedSections = new Set(state.completedSections);
                    state.expandedSections = new Set();
                    state.editingItems = new Set();
                    state.savingItems = new Set();
                }
            }
        }
    )
);
