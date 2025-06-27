import React from 'react';
import {Save} from "lucide-react";
import useOnboardingStore from "../stores/onBoardingStore.js";

function SaveButton(itemId, onSave, variant = 'primary') {
    const isSaving = useOnboardingStore((state) => state.isSaving.has(itemId));
    return (
        <button onClick={onSave} disabled={isSaving}
                className={`flex items-center space-x-2 px-4 py-2 text-sm rounded-lg transition-all transform hover:scale-105 ${
                    variant === 'primary'
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-indigo-600/50 disabled:to-purple-600/50 text-white'
                        : 'bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 text-white'
                }`}>{isSaving ? (
            <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                <span>Saving...</span>
            </>
        ) : (
            <>
                <Save className="h-4 w-4"/>
                <span>Save</span>
            </>
        )}</button>
    );
}

export default SaveButton;