import { authEndpoints } from "../apis";
import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { useMagicLinkStore } from "../../stores/authStore";
import { onboardingStore } from "../../stores/onboardingStore";
import { getProfileDetails } from "./profileDetailsAPI";

const {
    SEND_MAGIC_LINK_API,
    SIGNUP_API,
    LOGIN_API,
} = authEndpoints;

export async function sendMagicLink(email, navigate) {
        console.log("Statement")
        try {
            const response = await apiConnector("POST", SEND_MAGIC_LINK_API, {
                "email": email,
            })
            if (response.data.success) {
                await useMagicLinkStore.getState().setMagicLink(response.data.data);
                console.log(response.data.data)     
                navigate('/create-account')
            }
        } catch (error) {
            console.log("SEND MAGIC LINK ERROR...", error)
            const errorMessage = error?.response?.data?.message || "Something went wrong"
            toast.error(errorMessage, {
                style: {
                    border: '1px solid rgba(251, 44, 54, 0.5)',
                    backgroundColor: 'rgba(251, 44, 54, 0.1)',
                    color: '#fb2c36'
                }
            });
        }
}

export async function signUp(username, password, confirmPassword, navigate, magicLink) {
    console.log("Signing up");
    const API_LINK = `${SIGNUP_API + "/" + magicLink}`;
    try {
        const response = await apiConnector("POST", API_LINK, {
            "password": password,
            "confirmPassword": confirmPassword,
            "name": username
        })
        if (response.data.success) {
            toast.success("Account created successfully! Redirecting to login...", {
                duration: 5000,
                style: {
                    border: '1px solid rgba(47, 200, 122, 0.5)',
                    backgroundColor: 'rgba(47, 200, 122, 0.1)', // Light background version
                    color: '#2fc87a'
                }
            });

            setTimeout(() => {
                navigate('/login');
            }, 5000);
        } else {
            throw new Error(response.data.message)
        }
    } catch (error) {
        console.log("Error Signing Up...", error)
        const errorMessage = error?.response?.data?.message || "Something went wrong"
        toast.error(errorMessage, {
            style: {
                border: '1px solid rgba(251, 44, 54, 0.5)',
                backgroundColor: 'rgba(251, 44, 54, 0.1)',
                color: '#fb2c36'
            }
        });
    }
}

export async function login(email, password, navigate) {
    console.log("Loggin in")
    try {
        const response = await apiConnector("POST", LOGIN_API, {
            "email": email,
            "password": password
        })
        if (response.data.success) {
            console.log("Successfully logged in");
            const token = response.data.token;
            const expiry = Date.now() + 7 * 24 * 60 * 60 * 1000;
            localStorage.setItem('authToken', JSON.stringify({ token, expiry }));
            await profileSetup();
            toast.success("Logging In...", {
            duration: 5000,
            style: {
                border: '1px solid rgba(47, 200, 122, 0.5)',
                backgroundColor: 'rgba(47, 200, 122, 0.1)', // Light background version
                color: '#2fc87a'
            }
        });

        setTimeout(() => {
            navigate('/onboarding');
        }, 5000);
        } else {
            console.log("error")
            throw new Error(response.data.message)
        }
    } catch (error) {
        console.log("Error logging in", error)
        const errorMessage = error?.response?.data?.message || "Something went wrong"
        toast.error(errorMessage, {
            style: {
                border: '1px solid rgba(251, 44, 54, 0.5)',
                backgroundColor: 'rgba(251, 44, 54, 0.1)',
                color: '#fb2c36'
            }
        });
    }
}

async function profileSetup() {
    const updatePersonalDetails = onboardingStore.getState().updatePersonalDetails;
    const updateProfilePicture = onboardingStore.getState().updateProfilePicture;
    const updateProfileSummary = onboardingStore.getState().updateProfileSummary;
    const addEducationDetails = onboardingStore.getState().addEducationDetail;
    const addProfessionalExps = onboardingStore.getState().addProfessionalExps;
    const addSkills = onboardingStore.getState().addSkills;
    const addLanguages = onboardingStore.getState().addLanguages;
    const addCertificates = onboardingStore.getState().addCertificates;
    const addProjects = onboardingStore.getState().addProjects;
    const addAwards = onboardingStore.getState().addAwards;
    const addCourses = onboardingStore.getState().addCourses;
    const addOrganizations = onboardingStore.getState().addOrganizations;
    const addReferences = onboardingStore.getState().addReferences;
    const updateDeclaration = onboardingStore.getState().updateDeclaration;
    const markSectionComplete = onboardingStore.getState().markSectionComplete;
    const updateOriginalData = onboardingStore.getState().updateOriginalData;
    const addPublications = onboardingStore.getState().addPublications;
    const clearListData = onboardingStore.getState().clearListData;

    try {
        const data = await getProfileDetails();
        if (data) {
            updateOriginalData(data);
            clearListData();
        }
        if (data.personalDetails) {
            updatePersonalDetails(data.personalDetails);
            markSectionComplete("personal");
        }
        if (data.profilePicture) {
            updateProfilePicture(data.profilePicture);
        }
        if (data.profileSummary) {
            updateProfileSummary(data.profileSummary);
            markSectionComplete("profileSummary");
        }
        if (data.educationDetails) {
            addEducationDetails(data.educationDetails);
            if (data.educationDetails.length > 0) {
                markSectionComplete("educationDetails");
            }
        }
        if (data.professionalExperience) {
            addProfessionalExps(data.professionalExperience);
            if (data.professionalExperience.length > 0) {
                markSectionComplete("professionalExperience");
            }
        }
        if (data.skills) {
            addSkills(data.skills);
            if (data.skills.length > 0) {
                markSectionComplete("skills");
            }
        }
        if (data.languages) {
            addLanguages(data.languages);
            if (data.languages.length > 0) {
                markSectionComplete("languages");
            }
        }
        if (data.certificates) {
            addCertificates(data.certificates);
            if (data.certificates.length > 0) {
                markSectionComplete("certificates");
            }
        }
        if (data.projects) {
            addProjects(data.projects);
            if (data.projects.length > 0) {
                markSectionComplete("projects");
            }
        }
        if (data.awards) {
            addAwards(data.awards);
            if (data.awards.length > 0) {
                markSectionComplete("awards");
            }
        }
        if (data.courses) {
            addCourses(data.courses);
            if (data.courses.length > 0) {
                markSectionComplete("courses");
            }
        }
        if (data.publications) {
            addPublications(data.publications);
            if (data.publications.length > 0) {
                markSectionComplete("publications");
            }
        }
        if (data.organizations) {
            addOrganizations(data.organizations);
            if (data.organizations.length > 0) {
                markSectionComplete("organizations");
            }
        }
        if (data.references) {
            addReferences(data.references);
            if (data.references.length > 0) {
                markSectionComplete("references");
            }
        }
        if (data.declaration) {
            updateDeclaration(data.declaration);
            if (data.declaration.signature || data.declaration.text || data.declaration.fullName || data.declaration.date || data.declaration.place) {
                markSectionComplete("declaration");
            }
        }
    } catch (error) {
        console.log("Error occured", error);
    }
}