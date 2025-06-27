import React from 'react';
import { Plus } from 'lucide-react';

function EmptyState({icon, title, description, buttonText, onAdd}) {
    return (
        <div className="p-1 text-center md:p-8">
            <div className="bg-gray-800/50 border-2 border-dashed border-gray-700 rounded-xl p-8 hover:border-gray-600 transition-colors">
                <div className="flex justify-center mb-4">
                    <div className="text-gray-600">
                        {React.cloneElement(icon,{ className: "h-12 w-12" })}
                    </div>
                </div>
                <h3 className="text-lg font-medium text-gray-400 mb-2">{title}</h3>
                <p className="text-gray-500 mb-6 max-w-sm mx-auto">{description}</p>
                <button
                    onClick={onAdd}
                    className="flex items-center space-x-2 mx-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all transform hover:scale-105 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-950"
                >
                    <Plus className="h-5 w-5" />
                    <span>{buttonText}</span>
                </button>
            </div>
        </div>
    );
}

export default EmptyState;