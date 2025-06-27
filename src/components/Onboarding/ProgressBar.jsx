import React from 'react';
import {CheckCircle} from "lucide-react";
import {onboardingStore} from "../../stores/onboardingStore.js";

function ProgressBar() {
    const completionPercentage = 69;
    return (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-white">Profile Completion</h3>
                    <p className="text-sm text-gray-400">Complete your profile to get better resume matches</p>
                </div>
                <div className="flex items-center space-x-2">
                    <CheckCircle
                        className={`h-5 w-5 ${completionPercentage === 100 ? 'text-green-400' : 'text-gray-600'}`}/>
                    <span className="text-lg font-bold text-white">{completionPercentage}%</span>
                </div>
            </div>

            <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
                    style={{width: `${completionPercentage}%`}}
                />
            </div>

            {completionPercentage === 100 && (
                <div className="mt-4 p-3 bg-green-600/20 border border-green-600/30 rounded-lg">
                    <p className="text-green-400 text-sm font-medium">
                        🎉 Profile complete! You're ready to generate amazing resumes.
                    </p>
                </div>
            )}
        </div>
    );
}

export default ProgressBar;