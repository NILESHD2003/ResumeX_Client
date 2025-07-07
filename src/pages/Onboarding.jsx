import React, { useEffect } from 'react';
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

function Onboarding() {
    const {
        updateOriginalData
    } = onboardingStore();

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
                </div>
            </div>
        </div>
    );
}

export default Onboarding;