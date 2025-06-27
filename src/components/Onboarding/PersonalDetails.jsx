import React from 'react';
import SectionHeader from "./SectionHeader.jsx";
import {onboardingStore} from "../../stores/onboardingStore.js";
import SaveButton from "./SaveButton.jsx";
import EmptyState from "./EmptyState.jsx";
import {CameraIcon, UserIcon, LinkedinLogoIcon, GithubLogoIcon, XLogoIcon, YoutubeLogoIcon, GlobeIcon, DribbbleLogoIcon, BehanceLogoIcon, StackOverflowLogoIcon, LinkIcon} from "@phosphor-icons/react";

function PersonalDetails() {
    const {
        personalDetails,
        updatePersonalDetails,
        expandedSections,
        handleSave,
        profilePicture,
        updateProfilePicture,
        updateSocialLink
    } = onboardingStore();
    const isExpanded = expandedSections.has('personal');

    const handleImageUpload = () => {
        // TODO: Handle profile picture upload later where make a call to the backend to upload the image and then save the URL in the store.

        // Use the updateProfilePicture method to save the uploaded image URL to the store
    }

    const [pronoun, setPronoun] = React.useState('Select your pronoun');
    const [maritalStatus, setMaritalStatus] = React.useState('Select your status');

    const socialPlatformsList = [
        { platform: "LinkedIn", icon: LinkedinLogoIcon, key: "linkedin" },
        { platform: "GitHub", icon: GithubLogoIcon, key: "github" },
        { platform: "X", icon: XLogoIcon, key: "x" },
        { platform: "YouTube", icon: YoutubeLogoIcon, key: "youtube" },
        { platform: "Dribbble", icon: DribbbleLogoIcon, key: "dribbble" },
        { platform: "Behance", icon: BehanceLogoIcon, key: "behance" },
        { platform: "StackOverflow", icon: StackOverflowLogoIcon, key: "stackoverflow" },
        { platform: "Website", icon: GlobeIcon, key: "website" },
    ];


    function SocialLinkInput({ platform, icon: Icon, value, onChange }) {
        const [isDialogOpen, setDialogOpen] = React.useState(false);
        const [tempLink, setTempLink] = React.useState(value.link || "");

        const openDialog = () => {
            setTempLink(value.link || "");
            setDialogOpen(true);
        };

        const saveLink = () => {
            onChange({ ...value, link: tempLink });
            setDialogOpen(false);
        };

        return (
            <div className="relative flex items-center space-x-3 min-w-0">
                {/* Left icon inside input */}
                <div className="absolute left-3 pointer-events-none">
                    <Icon className="h-5 w-5 text-[#0A66C2]" />
                </div>

                {/* Input field */}
                <input
                    type="text"
                    value={value.url || ""}
                    onChange={(e) => onChange({ ...value, url: e.target.value })}
                    placeholder={`Enter your ${platform} username or handle`}
                    className="pl-10 pr-10 flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />

                {/* Right clickable link icon */}
                <button
                    type="button"
                    onClick={openDialog}
                    className="absolute right-3 text-gray-400 hover:text-indigo-500"
                >
                    <LinkIcon className="h-5 w-5 mr-2" />
                </button>

                {/* Popup dialog */}
                {isDialogOpen && (
                    <div className="absolute z-10 top-full right-0 mt-2 w-64 bg-gray-900 border border-gray-700 rounded-lg p-4 shadow-lg">
                        <label className="block mb-1 text-sm text-gray-300">Paste Link</label>
                        <input
                            type="url"
                            value={tempLink}
                            onChange={(e) => setTempLink(e.target.value)}
                            placeholder="https://example.com/yourprofile"
                            className="w-full px-3 py-2 mb-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setDialogOpen(false)}
                                className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 text-white"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveLink}
                                className="px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

// Usage example in parent component:

    const socialPlatforms = [
        { platform: "LinkedIn", icon: LinkedinLogoIcon, key: "linkedin" },
        { platform: "GitHub", icon: GithubLogoIcon, key: "github" },
        { platform: "X", icon: XLogoIcon, key: "x" },
        { platform: "YouTube", icon: YoutubeLogoIcon, key: "youtube" },
        { platform: "Dribbble", icon: DribbbleLogoIcon, key: "dribbble" },
        { platform: "Behance", icon: BehanceLogoIcon, key: "behance" },
        { platform: "StackOverflow", icon: StackOverflowLogoIcon, key: "stackoverflow" },
        { platform: "Website", icon: GlobeIcon, key: "website" },
    ];

    const handleChangeLink = (key, newValue) => {
        updateSocialLink(key, newValue); // expects { url, link }
    };

    return (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden max-w-4xl">
            <SectionHeader
                title="Personal Details"
                icon={<UserIcon/>}
                sectionId="personal"
            />

            {isExpanded && (
                <div className="p-6 border-t border-gray-800 space-y-6">
                    {/* Profile Picture */}
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <div
                                className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                                {profilePicture ? (
                                    <img
                                        src={profilePicture}
                                        alt="Profile"
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                ) : (
                                    <UserIcon className="h-8 w-8 text-white"/>
                                )}
                            </div>
                            <button
                                className="absolute -bottom-1 -right-1 bg-indigo-600 hover:bg-indigo-700 rounded-full p-2 transition-colors"
                                onClick={handleImageUpload}>
                                <CameraIcon weight='duotone' className="h-4 w-4 text-white"/>
                            </button>
                        </div>
                        <div>
                            <h4 className="font-medium text-white">Profile Picture</h4>
                            <p className="text-sm text-gray-400">Upload a professional photo</p>
                        </div>
                    </div>

                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={personalDetails.fullName}
                                onChange={(e) => updatePersonalDetails({fullName: e.target.value})}
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="John Doe"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={personalDetails.email}
                                onChange={(e) => updatePersonalDetails({email: e.target.value})}
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="john@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Phone
                            </label>
                            <input
                                type="tel"
                                value={personalDetails.phone}
                                onChange={(e) => updatePersonalDetails({phone: e.target.value})}
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="+1 (555) 123-4567"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Location
                            </label>
                            <input
                                type="text"
                                value={personalDetails.location}
                                onChange={(e) => updatePersonalDetails({location: e.target.value})}
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="San Francisco, CA, USA"
                            />
                        </div>
                    </div>

                    {/*Job Title and Personal Info Text Area*/}
                    <div className='space-y-4'>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Job Title
                            </label>
                            <input
                                type="text"
                                value={personalDetails.jobTitle}
                                onChange={(e) => updatePersonalDetails({jobTitle: e.target.value})}
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Software Engineer"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Personal Info
                            </label>
                            <input
                                type="text"
                                value={personalDetails.personalInfo}
                                onChange={(e) => updatePersonalDetails({personalInfo: e.target.value})}
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="About Yourself"
                            />
                        </div>
                    </div>

                    {/* Additional Details */}
                    <div className="space-y-4">
                        <h4 className="font-medium text-gray-300">Additional Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Date of Birth
                                </label>
                                <input
                                    type="date"
                                    value={personalDetails.dateOfBirth}
                                    onChange={(e) => updatePersonalDetails({dateOfBirth: e.target.value})}
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Nationality
                                </label>
                                <input
                                    type="text"
                                    value={personalDetails.nationality}
                                    onChange={(e) => updatePersonalDetails({nationality: e.target.value})}
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Gender Pronoun
                                </label>
                                <select value={pronoun} onChange={(e)=>{setPronoun(e.target.value)}} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                                    <option key='' value='Select your pronoun'>Select your pronoun</option>
                                    <option key='he/him' value='He/Him'>He/Him</option>
                                    <option key='she/her' value='She/Her'>She/Her</option>
                                    <option key='they/them' value='They/ Them'>They/ Them</option>
                                    <option key='prefer not to say' value='Prefer Not to Say'>Prefer Not to Say</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Marital Status
                                </label>
                                <select value={maritalStatus} onChange={(e)=>{setMaritalStatus(e.target.value)}} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                                    <option key='' value='Select your status'>Select your pronoun</option>
                                    <option key='single' value='Single'>Single</option>
                                    <option key='married' value='Married'>Married</option>
                                    <option key='divorced' value='Divorced'>Divorced</option>
                                    <option key='widowed' value='Widowed'>Widowed</option>
                                    <option key='separated' value='Separated'>Separated</option>
                                    <option key='in a relationship / partnered' value='In a relationship / Partnered'>In a relationship / Partnered</option>
                                    <option key='prefer not to say' value='Prefer Not to Say'>Prefer Not to Say</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Passport/ Government ID
                                </label>
                                <input
                                    type="text"
                                    value={personalDetails.passport_govt_id}
                                    onChange={(e) => updatePersonalDetails({passport_govt_id: e.target.value})}
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Driving License
                                </label>
                                <input
                                    type="text"
                                    value={personalDetails.drivingLicense}
                                    onChange={(e) => updatePersonalDetails({drivingLicense: e.target.value})}
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Military Service
                                </label>
                                <input
                                    type="text"
                                    value={personalDetails.militaryService}
                                    onChange={(e) => updatePersonalDetails({militaryService: e.target.value})}
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Visa
                                </label>
                                <input
                                    type="text"
                                    value={personalDetails.visa}
                                    onChange={(e) => updatePersonalDetails({visa: e.target.value})}
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>

                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="space-y-4">
                        <h4 className="font-medium text-gray-300">Social Links</h4>

                        <div className="space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/*    <div className="flex items-center space-x-3">*/}
                            {/*        <div className="bg-[#0A66C2]/20 rounded-lg p-2">*/}
                            {/*            <LinkedinLogoIcon className="h-5 w-5 text-[#0A66C2]"/>*/}
                            {/*        </div>*/}
                            {/*        <input*/}
                            {/*            type="url"*/}
                            {/*            value={personalDetails.linkedin || ''}*/}
                            {/*            onChange={(e) => updatePersonalDetails({linkedin: e.target.value})}*/}
                            {/*            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"*/}
                            {/*            placeholder="https://linkedin.com/in/johndoe"*/}
                            {/*        />*/}
                            {/*    </div>*/}
                            {/*    <div className="flex items-center space-x-3">*/}
                            {/*        <div className="bg-[#0A66C2]/20 rounded-lg p-2">*/}
                            {/*            <GithubLogoIcon className="h-5 w-5 text-[#0A66C2]"/>*/}
                            {/*        </div>*/}
                            {/*        <input*/}
                            {/*            type="url"*/}
                            {/*            value={personalDetails.github || ''}*/}
                            {/*            onChange={(e) => updatePersonalDetails({github: e.target.value})}*/}
                            {/*            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"*/}
                            {/*            placeholder="https://github.com/johndoe"*/}
                            {/*        />*/}
                            {/*    </div>*/}
                            {/*    <div className="flex items-center space-x-3">*/}
                            {/*        <div className="bg-[#0A66C2]/20 rounded-lg p-2">*/}
                            {/*            <XLogoIcon className="h-5 w-5 text-[#0A66C2]"/>*/}
                            {/*        </div>*/}
                            {/*        <input*/}
                            {/*            type="url"*/}
                            {/*            value={personalDetails.x || ''}*/}
                            {/*            onChange={(e) => updatePersonalDetails({x: e.target.value})}*/}
                            {/*            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"*/}
                            {/*            placeholder="https://x.com/johndoe"*/}
                            {/*        />*/}
                            {/*    </div>*/}
                            {/*    <div className="flex items-center space-x-3">*/}
                            {/*        <div className="bg-[#0A66C2]/20 rounded-lg p-2">*/}
                            {/*            <YoutubeLogoIcon className="h-5 w-5 text-[#0A66C2]"/>*/}
                            {/*        </div>*/}
                            {/*        <input*/}
                            {/*            type="url"*/}
                            {/*            value={personalDetails.youtube || ''}*/}
                            {/*            onChange={(e) => updatePersonalDetails({youtube: e.target.value})}*/}
                            {/*            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"*/}
                            {/*            placeholder="https://www.youtube.com/johndoe"*/}
                            {/*        />*/}
                            {/*    </div>*/}
                            {/*    <div className="flex items-center space-x-3">*/}
                            {/*        <div className="bg-[#0A66C2]/20 rounded-lg p-2">*/}
                            {/*            <DribbbleLogoIcon className="h-5 w-5 text-[#0A66C2]"/>*/}
                            {/*        </div>*/}
                            {/*        <input*/}
                            {/*            type="url"*/}
                            {/*            value={personalDetails.socialLinks['dribble'] || ''}*/}
                            {/*            onChange={(e) => updatePersonalDetails({: e.target.value})}*/}
                            {/*            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"*/}
                            {/*            placeholder="https://dribbble.com/johndoe"*/}
                            {/*        />*/}
                            {/*    </div>*/}
                            {/*    <div className="flex items-center space-x-3">*/}
                            {/*        <div className="bg-[#0A66C2]/20 rounded-lg p-2">*/}
                            {/*            <BehanceLogoIcon className="h-5 w-5 text-[#0A66C2]"/>*/}
                            {/*        </div>*/}
                            {/*        <input*/}
                            {/*            type="url"*/}
                            {/*            value={personalDetails.linkedin || ''}*/}
                            {/*            onChange={(e) => updatePersonalDetails({linkedin: e.target.value})}*/}
                            {/*            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"*/}
                            {/*            placeholder="https://linkedin.com/in/johndoe"*/}
                            {/*        />*/}
                            {/*    </div>*/}
                            {/*    <div className="flex items-center space-x-3">*/}
                            {/*        <div className="bg-[#0A66C2]/20 rounded-lg p-2">*/}
                            {/*            <StackOverflowLogoIcon className="h-5 w-5 text-[#0A66C2]"/>*/}
                            {/*        </div>*/}
                            {/*        <input*/}
                            {/*            type="url"*/}
                            {/*            value={personalDetails.linkedin || ''}*/}
                            {/*            onChange={(e) => updatePersonalDetails({linkedin: e.target.value})}*/}
                            {/*            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"*/}
                            {/*            placeholder="https://linkedin.com/in/johndoe"*/}
                            {/*        />*/}
                            {/*    </div>*/}
                            {/*    <div className="flex items-center space-x-3">*/}
                            {/*        <div className="bg-[#0A66C2]/20 rounded-lg p-2">*/}
                            {/*            <GlobeIcon className="h-5 w-5 text-[#0A66C2]"/>*/}
                            {/*        </div>*/}
                            {/*        <input*/}
                            {/*            type="url"*/}
                            {/*            value={personalDetails.linkedin || ''}*/}
                            {/*            onChange={(e) => updatePersonalDetails({linkedin: e.target.value})}*/}
                            {/*            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"*/}
                            {/*            placeholder="https://linkedin.com/in/johndoe"*/}
                            {/*        />*/}
                            {/*    </div>*/}
                            {socialPlatformsList.map(({ platform, icon, key }) => (
                                <SocialLinkInput
                                    key={key}
                                    platform={platform}
                                    icon={icon}
                                    value={personalDetails.socialLinks.find((sl) => sl.platform === key) || { url: "", link: "" }}
                                    onChange={(val) => handleChangeLink(key, val)}
                                />
                            ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <SaveButton itemId="personal" onSave={handleSave}/>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PersonalDetails;