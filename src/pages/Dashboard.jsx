import React, { useEffect } from 'react';
import {Plus, FileText, Calendar, Eye, ChevronDown, Download, Edit, ShareIcon, Coins} from "lucide-react";
import {Link} from "react-router-dom";
import { getUserAllGeneratedResumes } from '../services/operations/resumeDataAPI';
import { resumeStore } from '../stores/resumeStores';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

function Dashboard() {
    const [activeTab, setActiveTab] = React.useState('all');
    const [openDropdown, setOpenDropdown] = React.useState(null);

    const {
        resumes,
        setResumes,
        setEditingResume
    } = resumeStore();

    const navigate = useNavigate();

    // const documents = [{
    //     id: '1', title: 'Resume for Google SDE Role', type: 'Resume', date: '2025-01-15', time: '2:30 PM'
    // }, {
    //     id: '2',
    //     title: 'Cover Letter for Microsoft PM Position',
    //     type: 'Cover Letter',
    //     date: '2025-01-14',
    //     time: '4:15 PM'
    // }, {
    //     id: '3', title: 'Resume for Amazon Frontend Developer', type: 'Resume', date: '2025-01-13', time: '10:45 AM'
    // }, {
    //     id: '4',
    //     title: 'Cover Letter for Netflix Data Scientist',
    //     type: 'Cover Letter',
    //     date: '2025-01-12',
    //     time: '3:20 PM'
    // }, {
    //     id: '5', title: 'Resume for Apple iOS Developer', type: 'Resume', date: '2025-01-11', time: '11:30 AM'
    // }, {
    //     id: '6',
    //     title: 'Cover Letter for Facebook UX Designer',
    //     type: 'Cover Letter',
    //     date: '2024-01-17',
    //     time: '4:30 PM'
    // }];

    const generateDocumentList = (resumes) => {
        const now = new Date();
        const formattedDate = now.toISOString().split('T')[0];
        const formattedTime = now.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });

        return resumes.map((resume, index) => ({
            id: resume._id,
            title: `Software Engineer ${index + 1}`,
            type: 'Resume',
            date: formattedDate,
            time: formattedTime
        }));
    };

    const documents = generateDocumentList(resumes);

    const loadDocumnents = async () => {
        try {
            const data = await getUserAllGeneratedResumes();
            console.log(data);
            await setResumes(data);
        } catch (error) {
            console.log("Error Occured", error);
            toast.error("Unknown Error occured.", {
                style: {
                    border: '1px solid rgba(251, 44, 54, 0.5)',
                    backgroundColor: 'rgba(251, 44, 54, 0.1)',
                    color: '#fb2c36'
                }
            })
        }
    }

    useEffect(() => {
        loadDocumnents();
    }, [])

    documents.sort((a, b) => new Date(b.date) - new Date(a.date) || new Date(b.time) - new Date(a.time));

    const filteredDocuments = documents.filter(doc => {
        if (activeTab === 'all') return true;
        if (activeTab === 'resume') return doc.type === 'Resume';
        if (activeTab === 'cover-letter') return doc.type === 'Cover Letter';
        return true;
    });

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
        });
    };

    const handleDropdownToggle = (docId) => {
        setOpenDropdown(openDropdown === docId ? null : docId);
    };

    const handleAction = async (action, docId, docTitle) => {
        console.log(`${action} action for document ${docId}: ${docTitle}`);
        setOpenDropdown(null);

        // Handle different actions
        switch (action) {
            case 'preview':
                // Open preview modal or navigate to preview page
                break;
            case 'download':
                // Trigger PDF download
                break;
            case 'edit':
                // Navigate to editor
                await setEditingResume(docId);
                navigate('/resume-editor');
                break;
        }
    };

    return (
    <div className='min-h-screen bg-gray-950 pt-24 pb-12'>
        <Toaster 
            position='bottom-right'
            reverseOrder={false}
        />
        <div className='container mx-auto px-4 md:px-6'>
            {/*  Header  */}
            <header className='mb-8 flex flex-col justify-between gap-2 md:flex-row'>
                <div>
                    <h1 className='text-3xl md:text-4xl font-bold mb-2'>Dashboard</h1>
                    <p className='text-gray-400'>Manage your resumes and cover letters</p>
                </div>
                <div className='flex-col items-center space-x-2 bg-gray-800 px-4 py-2 rounded-md w-fit'>
                    <Coins className='h-4 w-4 text-yellow-400 inline-block'></Coins>
                    <span className='font-medium text-lg'>7/10 Credits Left</span>
                    <div className='text-sm'>Resets in X hours</div>
                </div>
            </header>

            {/*  Action Buttons  */}
            <div className='grid md:grid-cols-2 gap-4 mb-12'>
                <Link to='/generate/resume'
                      className='group bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl p-6 transition-all transform hover:scale-103 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-950'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <h3 className='text-xl font-semibold mb-2'>Generate New Resume</h3>
                            <p className='text-indigo-100 opacity-90'>
                                Create a tailored resume for your next job application.
                            </p>
                        </div>
                        <div className='bg-white/20 rounded-full p-3 group-hover:bg-white/30 transition-colors'>
                            <Plus className='h-6 w-6'></Plus>
                        </div>
                    </div>
                </Link>

                <Link to='/generate/cover-letter'
                      className='group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl p-6 transition-all transform hover:scale-103 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-950'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <h3 className='text-xl font-semibold mb-2'>Generate New Cover Letter</h3>
                            <p className='text-indigo-100 opacity-90'>
                                Write a compelling cover letter that stands out.
                            </p>
                        </div>
                        <div className='bg-white/20 rounded-full p-3 group-hover:bg-white/30 transition-colors'>
                            <Plus className='h-6 w-6'></Plus>
                        </div>
                    </div>
                </Link>
            </div>

            {/*  History Section  */}
            <div className='bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden'>
                <div className='p-6 border-b border-gray-800'>
                    <h2 className='text-2xl font-bold mb-4'>
                        <span className='sm:hidden'>History</span><span className='hidden sm:block'>Resume and Cover Letter History</span>
                    </h2>

                    {/*  Tabs Section for Filtration */}
                    <div className="w-full">
                        <div className="sm:hidden">
                            <select
                                value={activeTab}
                                onChange={(e) => setActiveTab(e.target.value)}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                <option value="all">All Documents</option>
                                <option value="resume">Resumes</option>
                                <option value="cover-letter">Cover Letters</option>
                            </select>
                        </div>
                        <div className='hidden sm:flex space-x-1 bg-gray-800 p-1 rounded-lg w-fit'>
                            <button
                                onClick={() => setActiveTab('all')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'all' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
                            >
                                All Documents
                            </button>
                            <button
                                onClick={() => setActiveTab('resume')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'resume' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
                            >
                                Resumes
                            </button>
                            <button
                                onClick={() => setActiveTab('cover-letter')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'cover-letter' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
                            >
                                Cover Letters
                            </button>
                        </div>
                    </div>
                </div>

                {/*  Documents List */}
                <div className="divide-y divide-gray-800">
                    {filteredDocuments.length > 0 ? (filteredDocuments.map((doc) => (
                        <div key={doc.id} className="p-4 sm:p-6 hover:bg-gray-800/50 transition-colors">
                            {/* Mobile Layout */}
                            <div className="sm:hidden space-y-3">
                                <div className="flex items-start space-x-3">
                                    <div
                                        className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${doc.type === 'Resume' ? 'bg-indigo-600/20 text-indigo-400' : 'bg-purple-600/20 text-purple-400'}`}>
                                        <FileText className="h-5 w-5"/>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-white mb-1 text-sm leading-tight">
                                            {doc.title}
                                        </h3>
                                        <div
                                            className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
                          <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${doc.type === 'Resume' ? 'bg-indigo-600/20 text-indigo-400' : 'bg-purple-600/20 text-purple-400'}`}>
                            {doc.type}
                          </span>
                                            <span>{formatDate(doc.date)}</span>
                                            <span>{doc.time}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <div className="relative flex-1">
                                        <button
                                            onClick={() => handleDropdownToggle(doc.id)}
                                            className="flex items-center justify-center space-x-2 w-full px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-sm"
                                        >
                                            <Eye className="h-4 w-4"/>
                                            <span>Actions</span>
                                            <ChevronDown
                                                className={`h-4 w-4 transition-transform ${openDropdown === doc.id ? 'rotate-180' : ''}`}/>
                                        </button>

                                        {openDropdown === doc.id && (<div
                                            className="absolute left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-10">
                                            <div className="py-1">
                                                <button
                                                    onClick={() => handleAction('preview', doc.id, doc.title)}
                                                    className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                                                >
                                                    <Eye className="h-4 w-4"/>
                                                    <span>Preview</span>
                                                </button>

                                                <button
                                                    onClick={() => handleAction('download', doc.id, doc.title)}
                                                    className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                                                >
                                                    <Download className="h-4 w-4"/>
                                                    <span>Download PDF</span>
                                                </button>

                                                <button
                                                    onClick={() => handleAction('edit', doc.id, doc.title)}
                                                    className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                                                >
                                                    <Edit className="h-4 w-4"/>
                                                    <span>Open in Editor</span>
                                                </button>

                                                <button
                                                    onClick={() => handleAction('edit', doc.id, doc.title)}
                                                    className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                                                >
                                                    <ShareIcon className="h-4 w-4"/>
                                                    <span>Share Link</span>
                                                </button>
                                            </div>
                                        </div>)}
                                    </div>

                                    <button
                                        onClick={() => handleAction('download', doc.id, doc.title)}
                                        className="flex items-center justify-center px-3 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                                    >
                                        <Download className="h-4 w-4"/>
                                    </button>
                                </div>
                            </div>

                            {/* Desktop Layout */}
                            <div className="hidden sm:flex sm:items-center justify-between gap-4">
                                <div className="flex items-start space-x-4 flex-1 min-w-0">
                                    <div
                                        className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${doc.type === 'Resume' ? 'bg-indigo-600/20 text-indigo-400' : 'bg-purple-600/20 text-purple-400'}`}>
                                        <FileText className="h-5 w-5"/>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-medium text-white mb-1 truncate">
                                            {doc.title}
                                        </h3>
                                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${doc.type === 'Resume' ? 'bg-indigo-600/20 text-indigo-400' : 'bg-purple-600/20 text-purple-400'}`}>
                            {doc.type}
                          </span>
                                            <div className="flex items-center space-x-1">
                                                <Calendar className="h-4 w-4"/>
                                                <span>{formatDate(doc.date)} at {doc.time}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3 flex-shrink-0">
                                    <div className="relative">
                                        <button
                                            onClick={() => handleDropdownToggle(doc.id)}
                                            className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                                        >
                                            <Eye className="h-4 w-4"/>
                                            <span>Actions</span>
                                            <ChevronDown
                                                className={`h-4 w-4 transition-transform ${openDropdown === doc.id ? 'rotate-180' : ''}`}/>
                                        </button>

                                        {openDropdown === doc.id && (<div
                                            className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-10">
                                            <div className="py-1">
                                                <button
                                                    onClick={() => handleAction('preview', doc.id, doc.title)}
                                                    className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                                                >
                                                    <Eye className="h-4 w-4"/>
                                                    <span>Preview</span>
                                                </button>

                                                <button
                                                    onClick={() => handleAction('download', doc.id, doc.title)}
                                                    className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                                                >
                                                    <Download className="h-4 w-4"/>
                                                    <span>Download PDF</span>
                                                </button>

                                                <button
                                                    onClick={() => handleAction('edit', doc.id, doc.title)}
                                                    className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                                                >
                                                    <Edit className="h-4 w-4"/>
                                                    <span>Open in Editor</span>
                                                </button>

                                                <button
                                                    onClick={() => handleAction('edit', doc.id, doc.title)}
                                                    className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                                                >
                                                    <ShareIcon className="h-4 w-4"/>
                                                    <span>Share Link</span>
                                                </button>
                                            </div>
                                        </div>)}
                                    </div>

                                    <button
                                        onClick={() => handleAction('download', doc.id, doc.title)}
                                        className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                                    >
                                        <Download className="h-4 w-4"/>
                                        <span>Download</span>
                                    </button>
                                </div>
                            </div>
                        </div>))) : (<div className="p-12 text-center">
                        <FileText className="h-12 w-12 text-gray-600 mx-auto mb-4"/>
                        <h3 className="text-lg font-medium text-gray-400 mb-2">No documents found</h3>
                        <p className="text-gray-500 text-sm sm:text-base">
                            {activeTab === 'all' ? "You haven't generated any documents yet. Create your first resume or cover letter!" : `No ${activeTab === 'resume' ? 'resumes' : 'cover letters'} found.`}
                        </p>
                    </div>)}
                </div>
            </div>
        </div>

        {/* Click outside to close the dropdown */}
        {openDropdown && (<div
            className="fixed inset-0 z-0"
            onClick={() => setOpenDropdown(null)}
        />)}
    </div>);
}

export default Dashboard;
