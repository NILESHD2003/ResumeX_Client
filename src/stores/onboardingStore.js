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

            languages: [],

            addLanguages: (newEntry) => {
                set((state) => ({
                    languages: [
                    ...state.languages,
                    ...(Array.isArray(newEntry) ? newEntry : [newEntry])
                    ],
                }));
            },

            updateLanguages: (index, updatedData) => {
                set((state) => {
                    const updatedList = [...state.languages];
                    if (index >= 0 && index < updatedList.length) {
                        updatedList[index] = { ...updatedList[index], ...updatedData };
                    }
                    return { languages: updatedList };
                });
            },

            removeLanguages: (index) => {
                set((state) => {
                    const updatedList = [...state.languages];
                    if (index >= 0 && index < updatedList.length) {
                        updatedList.splice(index, 1); // Remove the item at the specified index
                    }
                    return { languages: updatedList };
                });
            },

            languageForm: {
                name: "",
                additionalInfo: "",
                level: "",
                hide: false,
            },

            languagesEditingIndex: null,

            updateLanguagesEditingIndex: (index) => {
                set({languagesEditingIndex: index})
            },

            addLanguage: false,

            updateAddLanguage: (index) => {
                set({addLanguage: index})
            },

            updateLanguageForm: (details) => {
                set((state) => ({
                    languageForm: {
                        ...state.languageForm,
                        ...details
                    }
                }));
            },

            certificates: [],

            addCertificates: (newEntry) => {
                set((state) => ({
                    certificates: [
                    ...state.certificates,
                    ...(Array.isArray(newEntry) ? newEntry : [newEntry])
                    ],
                }));
            },

            updateCertificates: (index, updatedData) => {
                set((state) => {
                    const updatedList = [...state.certificates];
                    if (index >= 0 && index < updatedList.length) {
                        updatedList[index] = { ...updatedList[index], ...updatedData };
                    }
                    return { certificates: updatedList };
                });
            },

            removeCertificates: (index) => {
                set((state) => {
                    const updatedList = [...state.certificates];
                    if (index >= 0 && index < updatedList.length) {
                        updatedList.splice(index, 1); // Remove the item at the specified index
                    }
                    return { certificates: updatedList };
                });
            },

            certificateForm: {
                title: '',
                link: '',
                license: '',
                issuer: '',
                date: '',
                expirationDate: '',
                additionalInfo: '',
                hide: false
            },

            certificatesEditingIndex: null,

            updateCertificatesEditingIndex: (index) => {
                set({certificatesEditingIndex: index})
            },

            addCertificate: false,

            updateAddCertificate: (index) => {
                set({addCertificate: index})
            },

            updateCertificateForm: (details) => {
                set((state) => ({
                    certificateForm: {
                        ...state.certificateForm,
                        ...details
                    }
                }));
            },

            projects: [],

            addProjects: (newEntry) => {
                set((state) => ({
                    projects: [
                    ...state.projects,
                    ...(Array.isArray(newEntry) ? newEntry : [newEntry])
                    ],
                }));
            },

            updateProjects: (index, updatedData) => {
                set((state) => {
                    const updatedList = [...state.projects];
                    if (index >= 0 && index < updatedList.length) {
                        updatedList[index] = { ...updatedList[index], ...updatedData };
                    }
                    return { projects: updatedList };
                });
            },

            removeProjects: (index) => {
                set((state) => {
                    const updatedList = [...state.projects];
                    if (index >= 0 && index < updatedList.length) {
                        updatedList.splice(index, 1); // Remove the item at the specified index
                    }
                    return { projects: updatedList };
                });
            },

            projectForm: {
                title: '',
                subtitle: '',
                description: '',
                startDate: '',
                endDate: '',
                links: [],
                hide: false,
            },

            projectsEditingIndex: null,

            updateProjectsEditingIndex: (index) => {
                set({projectsEditingIndex: index})
            },

            addProject: false,

            updateAddProject: (index) => {
                set({addProject: index})
            },

            updateProjectForm: (details) => {
                set((state) => ({
                    projectForm: {
                        ...state.projectForm,
                        ...details
                    }
                }));
            },

            awards: [],

            addAwards: (newEntry) => {
                set((state) => ({
                    awards: [
                    ...state.awards,
                    ...(Array.isArray(newEntry) ? newEntry : [newEntry])
                    ],
                }));
            },

            updateAwards: (index, updatedData) => {
                set((state) => {
                    const updatedList = [...state.awards];
                    if (index >= 0 && index < updatedList.length) {
                        updatedList[index] = { ...updatedList[index], ...updatedData };
                    }
                    return { awards: updatedList };
                });
            },

            removeAwards: (index) => {
                set((state) => {
                    const updatedList = [...state.awards];
                    if (index >= 0 && index < updatedList.length) {
                        updatedList.splice(index, 1); // Remove the item at the specified index
                    }
                    return { awards: updatedList };
                });
            },

            awardForm: {
                title: "",
                link: "",
                issuer: "",
                date: "",
                hide: false,
            },

            awardsEditingIndex: null,

            updateAwardsEditingIndex: (index) => {
                set({awardsEditingIndex: index})
            },

            addAward: false,

            updateAddAward: (index) => {
                set({addAward: index})
            },

            updateAwardForm: (details) => {
                set((state) => ({
                    awardForm: {
                        ...state.awardForm,
                        ...details
                    }
                }));
            },

            courses: [],

            addCourses: (newEntry) => {
                set((state) => ({
                    courses: [
                    ...state.courses,
                    ...(Array.isArray(newEntry) ? newEntry : [newEntry])
                    ],
                }));
            },

            updateCourses: (index, updatedData) => {
                set((state) => {
                    const updatedList = [...state.courses];
                    if (index >= 0 && index < updatedList.length) {
                        updatedList[index] = { ...updatedList[index], ...updatedData };
                    }
                    return { courses: updatedList };
                });
            },

            removeCourses: (index) => {
                set((state) => {
                    const updatedList = [...state.courses];
                    if (index >= 0 && index < updatedList.length) {
                        updatedList.splice(index, 1); // Remove the item at the specified index
                    }
                    return { courses: updatedList };
                });
            },

            courseForm: {
                title: '',
                link: '',
                license: '',
                issuer: '',
                date: '',
                expirationDate: '',
                additionalInfo: '',
                hide: false
            },

            coursesEditingIndex: null,

            updateCoursesEditingIndex: (index) => {
                set({coursesEditingIndex: index})
            },

            addCourse: false,

            updateAddCourse: (index) => {
                set({addCourse: index})
            },

            updateCourseForm: (details) => {
                set((state) => ({
                    courseForm: {
                        ...state.courseForm,
                        ...details
                    }
                }));
            },

            organizations: [],

            addOrganizations: (newEntry) => {
                set((state) => ({
                    organizations: [
                    ...state.organizations,
                    ...(Array.isArray(newEntry) ? newEntry : [newEntry])
                    ],
                }));
            },

            updateOrganizations: (index, updatedData) => {
                set((state) => {
                    const updatedList = [...state.organizations];
                    if (index >= 0 && index < updatedList.length) {
                        updatedList[index] = { ...updatedList[index], ...updatedData };
                    }
                    return { organizations: updatedList };
                });
            },

            removeOrganizations: (index) => {
                set((state) => {
                    const updatedList = [...state.organizations];
                    if (index >= 0 && index < updatedList.length) {
                        updatedList.splice(index, 1); // Remove the item at the specified index
                    }
                    return { organizations: updatedList };
                });
            },

            organizationForm: {
                name: '',
                link: '',
                country: '',
                city: '',
                startDate: '',
                endDate: '',
                description: '',
                hide: false
            },

            organizationsEditingIndex: null,

            updateOrganizationsEditingIndex: (index) => {
                set({organizationsEditingIndex: index})
            },

            addOrganization: false,

            updateAddOrganization: (index) => {
                set({addOrganization: index})
            },

            updateOrganizationForm: (details) => {
                set((state) => ({
                    organizationForm: {
                        ...state.organizationForm,
                        ...details
                    }
                }));
            },

            publications: [],

            addPublications: (newEntry) => {
                set((state) => ({
                    publications: [
                    ...state.publications,
                    ...(Array.isArray(newEntry) ? newEntry : [newEntry])
                    ],
                }));
            },

            updatePublications: (index, updatedData) => {
                set((state) => {
                    const updatedList = [...state.publications];
                    if (index >= 0 && index < updatedList.length) {
                        updatedList[index] = { ...updatedList[index], ...updatedData };
                    }
                    return { publications: updatedList };
                });
            },

            removePublications: (index) => {
                set((state) => {
                    const updatedList = [...state.publications];
                    if (index >= 0 && index < updatedList.length) {
                        updatedList.splice(index, 1); // Remove the item at the specified index
                    }
                    return { publications: updatedList };
                });
            },

            publicationForm: {
                title: "",
                link: "",
                publisher: "",
                date: "",
                description: "",
                hide: false,
            },

            publicationsEditingIndex: null,

            updatePublicationsEditingIndex: (index) => {
                set({publicationsEditingIndex: index})
            },

            addPublication: false,

            updateAddPublication: (index) => {
                set({addPublication: index})
            },

            updatePublicationForm: (details) => {
                set((state) => ({
                    publicationForm: {
                        ...state.publicationForm,
                        ...details
                    }
                }));
            },

            references: [],

            addReferences: (newEntry) => {
                set((state) => ({
                    references: [
                    ...state.references,
                    ...(Array.isArray(newEntry) ? newEntry : [newEntry])
                    ],
                }));
            },

            updateReferences: (index, updatedData) => {
                set((state) => {
                    const updatedList = [...state.references];
                    if (index >= 0 && index < updatedList.length) {
                        updatedList[index] = { ...updatedList[index], ...updatedData };
                    }
                    return { references: updatedList };
                });
            },

            removeReferences: (index) => {
                set((state) => {
                    const updatedList = [...state.references];
                    if (index >= 0 && index < updatedList.length) {
                        updatedList.splice(index, 1); // Remove the item at the specified index
                    }
                    return { references: updatedList };
                });
            },

            referenceForm: {
                name: "",
                link: "",
                jobTitle: "",
                organization: "",
                email: "",
                phone: "",
                hide: false,
            },

            referencesEditingIndex: null,

            updateReferencesEditingIndex: (index) => {
                set({referencesEditingIndex: index})
            },

            addReference: false,

            updateAddReference: (index) => {
                set({addReference: index})
            },

            updateReferenceForm: (details) => {
                set((state) => ({
                    referenceForm: {
                        ...state.referenceForm,
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
                professionalExperience: [],
                skills: [],
                languages: [],
                certificates: [],
                projects: [],
                awards: [],
                courses: [],
                organizations: [],
                publications: [],
                references: [],
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
                languages: state.languages,
                languageForm: state.languageForm,
                languagesEditingIndex: state.languagesEditingIndex,
                addLanguage: state.addLanguage,
                certificates: state.certificates,
                certificateForm: state.certificateForm,
                certificatesEditingIndex: state.certificatesEditingIndex,
                addCertificate: state.addCertificate,
                projects: state.projects,
                projectForm: state.projectForm,
                projectsEditingIndex: state.projectsEditingIndex,
                addProject: state.addProject,
                awards: state.awards,
                awardForm: state.awardForm,
                awardsEditingIndex: state.awardsEditingIndex,
                addAward: state.addAward,
                courses: state.courses,
                courseForm: state.courseForm,
                coursesEditingIndex: state.coursesEditingIndex,
                addCourse: state.addCourse,
                organizations: state.organizations,
                organizationForm: state.organizationForm,
                organizationsEditingIndex: state.organizationsEditingIndex,
                addOrganization: state.addOrganization,
                publications: state.publications,
                publicationForm: state.publicationForm,
                publicationsEditingIndex: state.publicationsEditingIndex,
                addPublication: state.addPublication,
                references: state.references,
                referenceForm: state.referenceForm,
                referencesEditingIndex: state.referencesEditingIndex,
                addReference: state.addReference,
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
