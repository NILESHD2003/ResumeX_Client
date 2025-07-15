import React from 'react';
import SectionHeader from "./SectionHeader.jsx";
import { onboardingStore } from "../../stores/onboardingStore.js";
import SaveButton from "./SaveButton.jsx";
import { PenNibIcon } from "@phosphor-icons/react";
import toast from 'react-hot-toast';
import { Trash } from 'lucide-react';
import ImageCropperModal from './ImageCropperModal.jsx';
import { patchDeclarationDetail, patchDeclarationSignatureImage, deleteDeclarationSignatureImage } from '../../services/operations/declarationDetailsAPI.js';
 
function DeclarationDetails() {
    const {
        expandedSections,
        declaration,
        updateDeclaration,
        originalData,
        updateOriginalData,
        completedSections,
        markSectionComplete,
        removeSectionComplete
    } = onboardingStore();
    const [cropFile, setCropFile] = React.useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (!file || !file.type.startsWith("image/")) {
            toast.error("Invalid Image File", {
                style: {
                    border: '1px solid rgba(251, 44, 54, 0.5)',
                    backgroundColor: 'rgba(251, 44, 54, 0.1)',
                    color: '#fb2c36'
                }
            });
            return;
        }
        setCropFile(file);
    };

    const defaultDeclaration = {
        text: "",
        fullName: "",
        signature: null,
        place: "",
        date: "",
        hide: false
    };

    function isDeclarationEmpty(currentDeclaration) {
        return Object.entries(defaultDeclaration).every(([key, defaultValue]) => {
            const currentValue = currentDeclaration[key];

            if (key === "date") {
                const dateStr = currentValue ? new Date(currentValue).toISOString().split("T")[0] : "";
                return dateStr === "";
            }

            return (currentValue ?? "").toString().trim() === (defaultValue ?? "").toString().trim();
        });
    }

    const handleCroppedSave = async (blob) => {
        const formData = new FormData();
        formData.append("signature", blob);

        try {
            const res = await patchDeclarationSignatureImage(formData);
            if (res) {
                updateDeclaration({ signature: res });
                updateOriginalData({
                    declaration: { ...declaration, signature: res },
                });
                await markSectionComplete("declaration");
            }
        } catch (err) {
            toast.error("Failed to upload image", {
                style: {
                    border: '1px solid rgba(251, 44, 54, 0.5)',
                    backgroundColor: 'rgba(251, 44, 54, 0.1)',
                    color: '#fb2c36'
                }
            });
        } finally {
            setCropFile(null);
        }
    };

      const handleDeleteSignature = async () => {
        try {
            await deleteDeclarationSignatureImage();
            updateDeclaration({ signature: null });
            updateOriginalData({
                declaration: { ...declaration, signature: null },
            });
            const updatedOriginalData = onboardingStore.getState().originalData;
            if (isDeclarationEmpty(updatedOriginalData.declaration)) {
                await removeSectionComplete("declaration");
            }
        } catch (err) {
            toast.error("Failed to delete signature");
        }
    };

    function getChangedFields(newData, originalData) {
        return Object.fromEntries(
            Object.entries(newData).filter(([key, value]) => {
                const originalValue = originalData[key];

                if (key === 'date') {
                    const originalDate = originalValue
                        ? new Date(originalValue).toISOString().split('T')[0]
                        : '';
                    const newDate = value
                        ? new Date(value).toISOString().split('T')[0]
                        : '';
                    return originalDate !== newDate;
                }

                const normalizedOriginal = (originalValue ?? '').toString().trim();
                const normalizedNew = (value ?? '').toString().trim();
                return normalizedOriginal !== normalizedNew;
            })
        );
    }

    const handleSave = async () => {
        try {
            const prevDeclaration = originalData.declaration;
            const updatedPayload = getChangedFields(declaration, prevDeclaration);

            if (Object.keys(updatedPayload).length === 0) {
                toast("No Changes to Save", {
                    style: {
                        border: '1px solid #3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        color: '#3b82f6'
                    }
                });
                return;
            }

            await patchDeclarationDetail(updatedPayload);
            updateOriginalData({ declaration: declaration });
            const updatedOriginalData = onboardingStore.getState().originalData;
            if (isDeclarationEmpty(updatedOriginalData.declaration)) {
                await removeSectionComplete("declaration");
            } else {
                await markSectionComplete("declaration");
            }
        } catch (error) {
            toast.error("Failed to save declaration");
            console.error("Declaration save error:", error);
        }
    };


    const isExpanded = expandedSections.has("declaration");

    return (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden max-w-4xl">
            <SectionHeader
                title="Declaration"
                icon={<PenNibIcon />}
                sectionId="declaration"
            />

            {isExpanded && (
                <div className="p-6 border-t border-gray-800 space-y-6 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 md:col-span-2">
                            <label className="block text-sm font-medium text-gray-300 mb-2">Signature</label>
                            {declaration.signature ? (
                                <div className="flex items-center gap-4">
                                    <img
                                        src={declaration.signature}
                                        alt="Signature"
                                        className="h-30 border border-gray-700 rounded bg-white p-1"
                                    />
                                    <button
                                        className="px-2 py-1 text-sm bg-red-600 hover:bg-red-700 rounded text-white"
                                        onClick={handleDeleteSignature}
                                    >
                                        Delete
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        id="signature-upload"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                    <label htmlFor="signature-upload">
                                        <span className="inline-block cursor-pointer px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 rounded text-white">
                                        Upload Signature
                                        </span>
                                    </label>
                                </div>
                            )}
                        </div>
                        <div className='md:col-span-2'>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Text
                            </label>
                            <input
                                type="text"
                                value={declaration.text ?? ''}
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Declaration Text"
                                onChange={(e) => { updateDeclaration({ text: e.target.value }) }}
                            />
                        </div>
                        <div className='md:col-span-2'>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={declaration.fullName ?? ''}
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Full Name"
                                onChange={(e) => { updateDeclaration({ fullName: e.target.value }) }}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Place
                            </label>
                            <input
                                type="text"
                                value={declaration.place ?? ''}
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Place"
                                onChange={(e) => { updateDeclaration({ place: e.target.value }) }}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Date
                            </label>
                            <input
                                type="date"
                                value={declaration.date ? new Date(declaration.date).toISOString().split("T")[0] : ''}
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                onChange={(e) => { updateDeclaration({ date: e.target.value }) }}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <SaveButton itemId="declaration" onSave={handleSave} />
                    </div>
                </div>
            )}
            {cropFile && (
                <ImageCropperModal
                    file={cropFile}
                    onCancel={() => setCropFile(null)}
                    onSave={handleCroppedSave}
                />
            )}
        </div>
    )
}

export default DeclarationDetails;