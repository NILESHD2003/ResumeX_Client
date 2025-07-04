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
                    // { platform: 'linkedin', url: '', link: '' },
                    // { platform: 'github', url: '', link: '' },
                    // { platform: 'twitter', url: '', link: '' },
                    // { platform: 'youtube', url: '', link: '' },
                    // { platform: 'dribbble', url: '', link: '' },
                    // { platform: 'behance', url: '', link: '' },
                    // { platform: 'stackoverflow', url: '', link: '' },
                    // { platform: 'website', url: '', link: '' },
                ],
            },

            originalPersonalDetails: {
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
                    // { platform: 'linkedin', url: '', link: '' },
                    // { platform: 'github', url: '', link: '' },
                    // { platform: 'twitter', url: '', link: '' },
                    // { platform: 'youtube', url: '', link: '' },
                    // { platform: 'dribbble', url: '', link: '' },
                    // { platform: 'behance', url: '', link: '' },
                    // { platform: 'stackoverflow', url: '', link: '' },
                    // { platform: 'website', url: '', link: '' },
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

            updateOriginalPersonalDetails: (details) => {
                set((state) => ({
                    originalPersonalDetails: {
                        ...state.originalPersonalDetails,
                        ...details
                    }
                }));
            },

            profilePicture: null,

            updateProfilePicture: (file) => {
                set({ profilePicture: file });
            },

            visibleSocialLinks: {},

            showSocialLinks: (platformKey) => {
                set((state) => {
                    const existingLink = state.personalDetails.socialLinks.find(
                        (link) => link.platform === platformKey
                    );

                    // If platform already exists, just update visibility
                    const updatedSocialLinks = existingLink
                        ? state.personalDetails.socialLinks
                        : [...state.personalDetails.socialLinks, { platform: platformKey, url: '', link: '' }];

                    return {
                        visibleSocialLinks: {
                            ...state.visibleSocialLinks,
                            [platformKey]: true
                        },
                        personalDetails: {
                            ...state.personalDetails,
                            socialLinks: updatedSocialLinks,
                        }
                }
            });
            },

            hideSocialLinks: (platformKey) => {
                set((state) => {
                    const updatedLinks = state.personalDetails.socialLinks.filter(
                        (item) => item.platform !== platformKey
                    );

                    
                    
                    return {
                        visibleSocialLinks: {
                            ...state.visibleSocialLinks,
                            [platformKey]: false
                        },
                        personalDetails: {
                            ...state.personalDetails,
                            socialLinks: updatedLinks
                        },
                    }
                });
            },

            visibleAdditionalDetails: {},

            showAdditionalDetails: (fieldKey) => {
                set((state) => ({
                    visibleAdditionalDetails: {
                        ...state.visibleAdditionalDetails,
                        [fieldKey]: true
                    }
                }))
            },

            hideAdditionalDetails: (fieldKey) => {
                set((state) => ({
                    visibleAdditionalDetails: {
                        ...state.visibleAdditionalDetails,
                        [fieldKey]: false
                    },
                    personalDetails: {
                        ...state.personalDetails,
                        [fieldKey]: ''
                    }
                }))
            },

            updateSocialLink: (platform, { url, link }) => {
                set((state) => {
                    const updatedLinks = state.personalDetails.socialLinks.map((item) =>
                        item.platform === platform ? { ...item, url, link } : item
                    );
                    
                    return {
                        personalDetails: {
                            ...state.personalDetails,
                            socialLinks: updatedLinks
                        },
                    }
                });
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

            setSaving: (itemId, isSaving) => {
                set((state) => {
                    const updatedSet = new Set(state.savingItems);
                    if (isSaving) {
                        updatedSet.add(itemId);
                    } else {
                        updatedSet.delete(itemId);
                    }
                    return { savingItems: updatedSet };
                });
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
                personalDetails: state.personalDetails,
                originalPersonalDetails: state.originalPersonalDetails,
                completedSections: Array.from(state.completedSections),
                visibleSocialLinks: state.visibleSocialLinks,
                visibleAdditionalDetails: state.visibleAdditionalDetails,
            }),
            onRehydrateStorage: () => (state) => {
                if (state) {
                    state.completedSections = new Set(state.completedSections);
                    state.expandedSections = new Set();
                    state.editingItems = new Set();
                    state.savingItems = new Set();
                    state.visibleSocialLinks = state.visibleSocialLinks || {};
                    state.visibleAdditionalDetails = state.visibleAdditionalDetails || {};
                }
            }
        }
    )
);
