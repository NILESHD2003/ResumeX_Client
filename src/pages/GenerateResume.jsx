import React, {useState} from 'react';
import {Link2, FileText, Check, Clock, ArrowLeft, Edit} from 'lucide-react';


const GenerateResume = () => {
    const [inputType, setInputType] = useState('description');
    const [inputValue, setInputValue] = useState('');
    const [agreed, setAgreed] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [progressSteps, setProgressSteps] = useState([]);
    const [isComplete, setIsComplete] = useState(false);
    const [error, setError] = useState(true);

    const mockProgressSteps = [
        {id: '0', label: 'Job Description Analyzed', status: 'pending'},
        {id: '1', label: 'Skills Mapped', status: 'pending'},
        {id: '2', label: 'Experience Matched', status: 'pending'},
        {id: '3', label: 'Resume Structure Optimized', status: 'pending'},
        {id: '4', label: 'ATS Compatibility Verified', status: 'pending'},
        {id: '5', label: 'Final Review Complete', status: 'pending'}
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!inputValue.trim() || !agreed) return;

        setIsGenerating(true);
        setProgressSteps([]);

        // Simulate progress updates
        simulateProgress();
    };

    const simulateProgress = () => {
        let currentStep = 0;
        setProgressSteps([]); // Reset steps at the start
        const interval = setInterval(() => {
            if (currentStep < mockProgressSteps.length) {
                const timestamp = new Date().toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });

                setProgressSteps(prev => {
                    // Mark all previous steps as completed, add the current one
                    const updated = mockProgressSteps.slice(0, currentStep + 1).map((step, idx) => ({
                        ...step,
                        status: 'completed',
                        timestamp: idx === currentStep ? timestamp : prev[idx]?.timestamp || timestamp,
                        showDetails: prev[idx]?.showDetails !== undefined ? prev[idx].showDetails : true // default open
                    }));
                    return updated;
                });

                currentStep++;
            } else {
                clearInterval(interval);
                setIsComplete(true);
            }
        }, 1500 + Math.random() * 1000); // Random delay between 1.5-2.5 seconds
    };

    const resetForm = () => {
        setIsGenerating(false);
        setProgressSteps([]);
        setIsComplete(false);
        setInputValue('');
        setAgreed(false);
        setError(false);
    };

    if (isGenerating) {
        return (
            <div className="min-h-screen bg-gray-950 pt-24 pb-12">
                <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                    {/* Warning message about refreshing */}
                    <div className="mb-4 flex items-center justify-center">
                        <div className="flex items-center gap-2 px-4 py-2 bg-yellow-100 border border-yellow-300 rounded-lg shadow-sm">
                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-yellow-500">
                                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01" />
                            </svg>
                            <span className="text-yellow-800 font-medium text-sm">
                                Please <b>do not refresh</b> or reload this page while your resume is being generated.
                            </span>
                        </div>
                    </div>

                    {/* Header */}
                    <div className="mb-8">
                        {/*<button*/}
                        {/*    onClick={resetForm}*/}
                        {/*    className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-4"*/}
                        {/*>*/}
                        {/*    <ArrowLeft className="h-4 w-4"/>*/}
                        {/*    <span>Back to Form</span>*/}
                        {/*</button>*/}
                        <h1 className="text-2xl md:text-3xl font-bold mb-2">Generating Your Resume</h1>
                        <p className="text-gray-400">Please wait while we create your tailored resume...</p>
                    </div>

                    {/* Progress Timeline */}
                    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 md:p-8">
                        <div className="space-y-6">
                            {progressSteps.map((step) => (
                                <div key={step.id}
                                     className="flex items-start space-x-4 animate-in slide-in-from-left duration-500">
                                    {/* Status Icon */}
                                    <div
                                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                                            step.status === 'completed'
                                                ? 'bg-green-600 text-white'
                                                : step.status === 'in-progress'
                                                    ? 'bg-indigo-600 text-white animate-pulse'
                                                    : 'bg-gray-700 text-gray-400'
                                        }`}>
                                        {step.status === 'completed' ? (
                                            <Check className="h-4 w-4"/>
                                        ) : (
                                            <Clock className="h-4 w-4"/>
                                        )}
                                    </div>

                                    {/* Step Content */}
                                    <div className="flex-1 min-w-0">
                                        <div
                                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                            <h3 className={`font-medium ${
                                                step.status === 'completed' ? 'text-white' : 'text-gray-400'
                                            }`}>
                                                {step.label}
                                            </h3>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-sm text-gray-500">{step.timestamp}</span>
                                                {/* Dropdown button for additional details */}
                                                <button
                                                    type="button"
                                                    className="ml-1 p-1 rounded hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                    aria-label={step.showDetails ? 'Hide additional details' : 'Show additional details'}
                                                    onClick={() => setProgressSteps(prev => prev.map(s => s.id === step.id ? { ...s, showDetails: !s.showDetails } : s))}
                                                >
                                                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gray-400">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={step.showDetails !== false ? 'M19 15l-7-7-7 7' : 'M19 9l-7 7-7-7'} />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                        {/* Show additional details by default, allow user to close */}
                                        {(step.showDetails !== false) && (
                                            <div className="mt-2 p-3 bg-gray-800 rounded text-gray-300 text-sm border border-gray-700 animate-fade-in">
                                                Additional details for <span className="font-semibold">{step.label}</span> go here.
                                            </div>
                                        )}
                                    </div>

                                    {/* Connection Line */}
                                    {/*{index < progressSteps.length - 1 && (*/}
                                    {/*    <div className="absolute left-[2rem] mt-8 w-px h-6 bg-gray-700"></div>*/}
                                    {/*)}*/}
                                </div>
                            ))}

                            {/* Loading indicator for next step */}
                            {progressSteps.length < mockProgressSteps.length && progressSteps.length > 0 && (
                                <div className="flex items-start space-x-4 opacity-50">
                                    <div
                                        className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center animate-pulse">
                                        <Clock className="h-4 w-4 text-gray-400"/>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-500">
                                            {mockProgressSteps[progressSteps.length]?.label}
                                        </h3>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Completion CTA */}
                        {isComplete && !error && (
                            <div className="mt-8 pt-6 border-t border-gray-800">
                                <div className="text-center">
                                    <div className="bg-green-600/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                        <Check className="h-8 w-8 text-green-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">Resume Generated Successfully!</h3>
                                    <p className="text-gray-400 mb-6">Your tailored resume is ready for review and editing.</p>

                                    <button className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-3 px-8 rounded-lg transition-all transform hover:scale-105 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-950">
                                        <div className="flex items-center justify-center space-x-2">
                                            <Edit className="h-5 w-5" />
                                            <span>Open in Resume Editor</span>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        )}
                        {/* Error CTA */}
                        {isComplete && error && (
                            <div className="mt-8 pt-6 border-t border-gray-800">
                                <div className="text-center">
                                    <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                        <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <circle cx="12" cy="12" r="10" strokeWidth="2" className="text-red-200" fill="#fee2e2" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 9l-6 6m0-6l6 6" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2 text-red-700">Something Went Wrong</h3>
                                    <p className="text-gray-400 mb-2">Don't worry, your credits are not lost.</p>
                                    <p className="text-gray-400 mb-6">Please try again or report this issue.</p>
                                    <button className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium py-3 px-8 rounded-lg transition-all transform hover:scale-105 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-950">
                                        <div className="flex items-center justify-center space-x-2">
                                            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M3 12l18-7-7 18-2-7-7-4z" />
                                            </svg>
                                            <span>Report Error</span>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 pt-24 pb-12">
            <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold mb-2">Generate Tailored Resume</h1>
                    <p className="text-gray-400">Create a resume optimized for your target job in minutes</p>
                </div>

                {/* Main Form */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-6 md:p-8">
                        {/* Toggle Switch */}
                        <div className="mb-6">
                            <div className="flex bg-gray-800 p-1 rounded-lg w-full sm:w-fit">
                                <button
                                    type="button"
                                    onClick={() => setInputType('description')}
                                    className={`flex-1 sm:flex-none px-4 py-3 rounded-md text-sm font-medium transition-all ${
                                        inputType === 'description'
                                            ? 'bg-indigo-600 text-white shadow-sm'
                                            : 'text-gray-400 hover:text-white hover:bg-gray-700'
                                    }`}
                                >
                                    <div className="flex items-center justify-center space-x-2">
                                        <FileText className="h-4 w-4"/>
                                        <span>Paste Job Description</span>
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setInputType('link')}
                                    className={`flex-1 sm:flex-none px-4 py-3 rounded-md text-sm font-medium transition-all ${
                                        inputType === 'link'
                                            ? 'bg-indigo-600 text-white shadow-sm'
                                            : 'text-gray-400 hover:text-white hover:bg-gray-700'
                                    }`}
                                >
                                    <div className="flex items-center justify-center space-x-2">
                                        <Link2 className="h-4 w-4"/>
                                        <span>Paste Job Link</span>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Input Field */}
                        <div className="mb-6">
              <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={
                      inputType === 'description'
                          ? 'Paste full job description here…'
                          : 'Paste job post link here…'
                  }
                  rows={inputType === 'description' ? 12 : 4}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  required
              />
                        </div>

                        {/* Agreement Checkbox */}
                        <div className="mb-8">
                            <label className="flex items-start space-x-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={agreed}
                                    onChange={(e) => setAgreed(e.target.checked)}
                                    className="mt-1 h-4 w-4 rounded border-gray-600 bg-gray-800 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-gray-950"
                                    required
                                />
                                <span className="text-sm text-gray-300 leading-relaxed">
                  I agree to the processing and storage of this job data for resume generation.
                  My personal information will not be shared with AI models.
                </span>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={!inputValue.trim() || !agreed}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-medium py-4 px-6 rounded-lg transition-all transform hover:scale-105 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-950 disabled:transform-none"
                        >
                            <div className="flex items-center justify-center space-x-2">
                                <FileText className="h-5 w-5"/>
                                <span className="text-lg">Generate Resume (2 credits)</span>
                            </div>
                        </button>
                    </form>

                    {/* Info Footer */}
                    <div className="bg-gray-800/50 px-6 md:px-8 py-4 border-t border-gray-800">
                        <div
                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-gray-400">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                <span>7 credits remaining</span>
                            </div>
                            <div className="flex items-center space-x-4">
                                <span>• Secure processing</span>
                                <span>• ATS optimized</span>
                                <span>• Professional formatting</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tips Section */}
                <div className="mt-8 bg-gray-900/30 border border-gray-800 rounded-xl p-6">
                    <h3 className="font-semibold mb-3 text-indigo-400">💡 Tips for Best Results</h3>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li>• Include the complete job description with requirements and qualifications</li>
                        <li>• Make sure the job posting includes specific skills and technologies</li>
                        <li>• For job links, ensure they're publicly accessible and not behind login walls</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default GenerateResume;





