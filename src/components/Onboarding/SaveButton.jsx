import React from 'react';
import {Save, Check} from "lucide-react";
import {onboardingStore} from "../../stores/onboardingStore.js";

function SaveButton(itemId, onSave, variant = 'primary', size = 'md') {
    const {savingItems, setSaving} = onboardingStore();
    const isSaving = savingItems.has(itemId);

    const handleSave = async () => {
        setSaving(itemId, true);
        try {
            await onSave();
            // simulate a save operation
            await new Promise(resolve => setTimeout(resolve, 5000));
        } catch (error) {
            console.error("Error saving item:", error);
        } finally {
            setSaving(itemId, false);
        }
    }

    const baseClasses = "flex items-center space-x-2 font-medium rounded-lg transition-all transform hover:scale-105 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-950 disabled:transform-none disabled:opacity-50";

    const variantClasses = {
        primary: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500",
        secondary: "bg-gray-700 hover:bg-gray-600 text-white focus:ring-gray-500"
    };

    const sizeClasses = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-sm"
    };
    return (
        <button
            onClick={handleSave}
            disabled={isSaving}
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
        >
            {isSaving ? (
                <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                    <span>Saving...</span>
                </>
            ) : (
                <>
                    <Save className="h-4 w-4"/>
                    <span>Save</span>
                </>
            )}
        </button>
    );
}

export default SaveButton;