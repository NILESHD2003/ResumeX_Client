import React, { useEffect, useState } from 'react';
import ProgressBar from "../components/Onboarding/ProgressBar.jsx";
import PersonalDetails from "../components/Onboarding/PersonalDetails.jsx";
import { Toaster } from 'react-hot-toast';
import { getProfileDetails } from '../services/operations/profileDetailsAPI.js';
import { onboardingStore } from '../stores/onboardingStore.js';
import ProfileSummary from '../components/Onboarding/ProfileSummary.jsx';
import EducationDetails from '../components/Onboarding/EducationDetails.jsx';
import ProfessionalExperiences from '../components/Onboarding/ProfessionalExperiences.jsx';
import SkillDetails from '../components/Onboarding/SkillsDetails.jsx';
import LanguagesDetails from '../components/Onboarding/LanguagesDetails.jsx';
import CertificationDetails from '../components/Onboarding/CertificationDetails.jsx';
import ProjectDetails from '../components/Onboarding/ProjectDetails.jsx';
import AwardDetails from '../components/Onboarding/AwardDetails.jsx';
import CourseDetails from '../components/Onboarding/CourseDetails.jsx';
import OrganizationDetails from '../components/Onboarding/OrganizationDetails.jsx';
import PublicationDetails from '../components/Onboarding/PublicationDetails.jsx';
import ReferencesDetails from '../components/Onboarding/ReferencesDetails.jsx';
import DeclarationDetails from '../components/Onboarding/DeclarationDetail.jsx';
import OnboardingPreview from '../components/Onboarding/OnboardingPreview.jsx';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Onboarding() {
    const {
        updateOriginalData,
        completedSections
    } = onboardingStore();
    const [showPreview, setShowPreview] = useState(false);

    const navigate = useNavigate();
    useEffect(() => {
        const OriginalData = async () => {
            const data = await getProfileDetails();
            updateOriginalData(data);
        };
        OriginalData();
    }, [])
    return (
        <div className='min-h-screen bg-gray-950 pt-24 pb-12 overflow-hidden'>
            {/*Background Elements*/}
            <Toaster 
                 position='bottom-right'
                reverseOrder={false}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/10 to-transparent z-0"></div>
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 md:top-1/4 md:-left-64 w-56 h-56 md:w-96 md:h-96 bg-indigo-500/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 md:bottom-1/3 md:-right-64 w-56 h-56 md:w-96 md:h-96 bg-purple-500/5 rounded-full blur-3xl"></div>

            <div className="container mx-auto my-2 px-4 md:px-6 max-w-4xl relative z-10">
                {/* Header */}
                <div className="mb-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                            Build Your Professional Profile
                        </h1>
                        <p className="text-lg text-gray-400 max-w-2xl mx-auto sm:text-xl">
                            Create a comprehensive profile that will be used to generate tailored resumes for each job application
                        </p>
                    </div>
                </div>

                {/* Show Preview Button */}
                <div className="text-right mb-4">
                    <button
                        onClick={() => setShowPreview(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition"
                    >
                        Show Preview
                    </button>
                </div>

                {/*  Progress Bar  */}
                <ProgressBar></ProgressBar>

                {/*  Data Sections  */}
                <div className='space-y-6'>
                    <PersonalDetails></PersonalDetails>
                    <ProfileSummary></ProfileSummary>
                    <EducationDetails></EducationDetails>
                    <ProfessionalExperiences></ProfessionalExperiences>
                    <SkillDetails></SkillDetails>
                    <LanguagesDetails></LanguagesDetails>
                    <CertificationDetails></CertificationDetails>
                    <ProjectDetails></ProjectDetails>
                    <AwardDetails></AwardDetails>
                    <CourseDetails></CourseDetails>
                    <OrganizationDetails></OrganizationDetails>
                    <PublicationDetails></PublicationDetails>
                    <ReferencesDetails></ReferencesDetails>
                    <DeclarationDetails></DeclarationDetails>
                </div>
                <div className="mt-10 flex justify-center">
                    {completedSections.size === 0 ? (
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="bg-gray-700 hover:bg-gray-800 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition"
                        >
                            Skip
                        </button>
                    ) : (
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition"
                        >
                            Complete
                        </button>
                    )}
                </div>
            </div>
            {showPreview && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="relative w-full max-w-[90vw] md:max-w-[210mm] max-h-[95vh] overflow-auto bg-white shadow-2xl rounded-xl scrollbar-hide">
                    <button
                        onClick={() => setShowPreview(false)}
                        className="absolute top-4 right-4 z-10 text-gray-700 hover:text-red-500"
                    >
                        <X size={24} />
                    </button>
                    <div className="p-6 md:p-10">
                        <OnboardingPreview />
                    </div>
                </div>
            </div>
            )}
        </div>
    );
}

export default Onboarding;