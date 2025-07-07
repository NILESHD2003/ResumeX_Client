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
                genderPronoun: '',
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
            
            profileSummary: "",

            updateProfileSummary: (summary) => {
                set({ profileSummary: summary });
            },

            educationDetails: [],

            addEducationDetail: (newEntry) => {
                set((state) => ({
                    educationDetails: [
                    ...state.educationDetails,
                    ...(Array.isArray(newEntry) ? newEntry : [newEntry])
                    ],
                }));
            },

            updateEducationDetail: (index, updatedData) => {
                set((state) => {
                    const updatedList = [...state.educationDetails];
                    if (index >= 0 && index < updatedList.length) {
                        updatedList[index] = { ...updatedList[index], ...updatedData };
                    }
                    return { educationDetails: updatedList };
                });
            },

            removeEducationDetail: (index) => {
                set((state) => {
                    const updatedList = [...state.educationDetails];
                    if (index >= 0 && index < updatedList.length) {
                        updatedList.splice(index, 1); // Remove the item at the specified index
                    }
                    return { educationDetails: updatedList };
                });
            },

            educationForm: {
                degree: '',
                grade: '',
                school: '',
                link: '',
                country: '',
                city: '',
                startDate: '',
                endDate: '',
                description: '',
                hide: false
            },

            educationEditingIndex: null,

            updateEducationEditingIndex: (index) => {
                set({educationEditingIndex: index})
            },

            addEducation: false,

            updateAddEducation: (index) => {
                set({addEducation: index})
            },

            updateEducationForm: (details) => {
                set((state) => ({
                    educationForm: {
                        ...state.educationForm,
                        ...details
                    }
                }));
            },

            professionalExperience: [],

            addProfessionalExps: (newEntry) => {
                set((state) => ({
                    professionalExperience: [
                    ...state.professionalExperience,
                    ...(Array.isArray(newEntry) ? newEntry : [newEntry])
                    ],
                }));
            },

            updateProfessionalExps: (index, updatedData) => {
                set((state) => {
                    const updatedList = [...state.professionalExperience];
                    if (index >= 0 && index < updatedList.length) {
                        updatedList[index] = { ...updatedList[index], ...updatedData };
                    }
                    return { professionalExperience: updatedList };
                });
            },

            removeProfessionalExps: (index) => {
                set((state) => {
                    const updatedList = [...state.professionalExperience];
                    if (index >= 0 && index < updatedList.length) {
                        updatedList.splice(index, 1); // Remove the item at the specified index
                    }
                    return { professionalExperience: updatedList };
                });
            },

            professionalExpForm: {
                jobTitle: '',
                employer: '',
                link: '',
                country: '',
                city: '',
                startDate: '',
                endDate: '',
                description: '',
                hide: false
            },

            professionalExpEditingIndex: null,

            updateProfessionalExpEditingIndex: (index) => {
                set({professionalExpEditingIndex: index})
            },

            addProfessionalExp: false,

            updateAddProfessionalExp: (index) => {
                set({addProfessionalExp: index})
            },

            updateProfessionalExpForm: (details) => {
                set((state) => ({
                    professionalExpForm: {
                        ...state.professionalExpForm,
                        ...details
                    }
                }));
            },

            skills: [],

            addSkills: (newEntry) => {
                set((state) => ({
                    skills: [
                    ...state.skills,
                    ...(Array.isArray(newEntry) ? newEntry : [newEntry])
                    ],
                }));
            },

            updateSkills: (index, updatedData) => {
                set((state) => {
                    const updatedList = [...state.skills];
                    if (index >= 0 && index < updatedList.length) {
                        updatedList[index] = { ...updatedList[index], ...updatedData };
                    }
                    return { skills: updatedList };
                });
            },

            removeSkills: (index) => {
                set((state) => {
                    const updatedList = [...state.skills];
                    if (index >= 0 && index < updatedList.length) {
                        updatedList.splice(index, 1); // Remove the item at the specified index
                    }
                    return { skills: updatedList };
                });
            },

            skillForm: {
                name: "",
                subSkills: [],
                level: "",
                hide: false,
            },

            skillsEditingIndex: null,

            updateSkillsEditingIndex: (index) => {
                set({skillsEditingIndex: index})
            },

            addSkill: false,

            updateAddSkill: (index) => {
                set({addSkill: index})
            },

            updateSkillForm: (details) => {
                set((state) => ({
                    skillForm: {
                        ...state.skillForm,
                        ...details
                    }
                }));
            },

            originalData: {
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
                    genderPronoun: '',
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
                profileSummary: "",
                educationDetails: [],
                professionalExperience: []
            },

            updatePersonalDetails: (details) => {
                set((state) => ({
                    personalDetails: {
                        ...state.personalDetails,
                        ...details,
                        socialLinks: (details.socialLinks || []).map((item) => ({
                            ...item,
                            link: item.link || '',  // ensure 'link' always exists
                        })),
                    }
                }));
            },

            updateOriginalData: (details) => {
                set((state) => ({
                    originalData: {
                        ...state.originalData,
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

            setEditing: (itemId, isEditing) => {
                set((state) => {
                    const updatedSet = new Set(state.editingItems);
                    if (isEditing) {
                        updatedSet.add(itemId);
                    } else {
                        updatedSet.delete(itemId);
                    }
                    return { editingItems: updatedSet };
                });
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
                profileSummary: state.profileSummary,
                originalData: state.originalData,
                educationDetails: state.educationDetails,
                educationForm: state.educationForm,
                educationEditingIndex: state.educationEditingIndex,
                addEducation: state.addEducation,
                professionalExperience: state.professionalExperience,
                professionalExpForm: state.professionalExpForm,
                professionalExpEditingIndex: state.professionalExpEditingIndex,
                addProfessionalExp: state.addProfessionalExp,
                skills: state.skills,
                skillForm: state.skillForm,
                skillsEditingIndex: state.skillsEditingIndex,
                addSkill: state.addSkill,
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
