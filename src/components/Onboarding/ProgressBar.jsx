import React, { useEffect, useState, useRef } from 'react';
import { CheckCircle } from "lucide-react";
import {onboardingStore} from "../../stores/onboardingStore.js";

function ProgressBar() {
    const {
        completedSections,
    } = onboardingStore();

    const TOTAL_SECTIONS = 14;
    const completionPercentage = Math.round((completedSections.size / TOTAL_SECTIONS) * 100);
    const ref = useRef(null);
    const [stuck, setStuck] = useState(false);

    const radius = 30;
    const stroke = 8;
    const normalizedRadius = radius - stroke * 0.5;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (completionPercentage / 100) * circumference;

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setStuck(!entry.isIntersecting);
            },
            { threshold: 1.0 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) observer.unobserve(ref.current);
        };
    }, []);

    return (
        <>
            <div ref={ref} className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-8">
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

            {/* === Floating Circle-Style (Only on Small Screens) === */}
            {stuck && (
                <div className="fixed bottom-4 right-4 z-50 bg-gray-900/90 border border-gray-800 rounded-full shadow-xl p-3 scale-75 sm:scale-90 md:scale-100">
                    <svg height={radius * 2} width={radius * 2}>
                        {/* Define gradient */}
                        <defs>
                            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#6366f1" /> {/* Indigo-500 */}
                            <stop offset="100%" stopColor="#a855f7" /> {/* Purple-500 */}
                            </linearGradient>
                        </defs>
                        <circle
                            stroke="url(#progressGradient)" // indigo-500
                            fill="transparent"
                            strokeWidth={stroke}
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            r={normalizedRadius}
                            cx={radius}
                            cy={radius}
                            className="transition-all duration-500"
                        />
                        <text
                            x="50%"
                            y="50%"
                            dominantBaseline="middle"
                            textAnchor="middle"
                            fill="#ffffff"
                            fontSize="16"
                            fontWeight="bold"
                        >
                            {completionPercentage}%
                        </text>
                    </svg>
                </div>
            )}
        </>
    );
}

export default ProgressBar;