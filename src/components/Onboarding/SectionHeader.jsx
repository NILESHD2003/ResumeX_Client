import React from 'react';
import {onboardingStore} from "../../stores/onboardingStore.js";
import {Check, ChevronDown, ChevronUp} from "lucide-react";

function SectionHeader({title, icon, sectionId, count}) {
    const {expandedSections, completedSections, toggleSection} = onboardingStore();
    const isExpanded = expandedSections.has(sectionId);
    const isCompleted = completedSections.has(sectionId);
    return (
        <button
            onClick={() => toggleSection(sectionId)}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-800/50 transition-colors group"
        >
            <div className="flex items-center space-x-3">
                <div className="text-indigo-400 group-hover:text-indigo-300 transition-colors">
                    {icon}
                </div>
                <h3 className="text-lg font-semibold text-white group-hover:text-gray-100 transition-colors">
                    {title}
                </h3>
                {count !== undefined && count > 0 && (
                    <span className="bg-indigo-600/20 text-indigo-400 px-2 py-1 rounded-full text-xs font-medium">
            {count}
          </span>
                )}
                {isCompleted && (
                    <div className="bg-green-600/20 rounded-full p-1">
                        <Check className="h-4 w-4 text-green-400"/>
                    </div>
                )}
            </div>
            <div className="flex items-center space-x-2">
                {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-gray-400 group-hover:text-gray-300 transition-colors"/>
                ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400 group-hover:text-gray-300 transition-colors"/>
                )}
            </div>
        </button>
    );
}

export default SectionHeader;