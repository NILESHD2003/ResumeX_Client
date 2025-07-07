import React from "react";
import SectionHeader from "./SectionHeader";
import { onboardingStore } from "../../stores/onboardingStore";
import SaveButton from "./SaveButton";
import { CertificateIcon } from "@phosphor-icons/react";
import toast from "react-hot-toast";
import { addNewCertificateDetail, patchCertificateDetail, deleteCertificateDetail } from "../../services/operations/certificateDetailsAPI";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import MenuBar from "../shared/MenuBar";
import { Trash } from "lucide-react";

function CertificationDetails() {
    const {
        expandedSections,
        originalData,
        updateOriginalData,
        certificates,
        addCertificates,
        updateCertificates,
        certificateForm,
        updateCertificateForm,
        certificatesEditingIndex,
        updateCertificatesEditingIndex,
        addCertificate,
        updateAddCertificate,
        removeCertificates
    } = onboardingStore();

    const editor = useEditor({
        extensions: [
            StarterKit.configure({ bulletList: false, orderedList: false }),
            Bold,
            Italic,
            Underline,
            TextAlign.configure({ types: ["heading", "paragraph"] }),
            BulletList,
            OrderedList,
            ListItem,
        ],
        content: certificateForm.additionalInfo || "<p>Write your summary...</p>",
        onUpdate: ({ editor }) => {
            updateCertificateForm({additionalInfo: editor.getHTML()});
        },
    });

    const isExpanded = expandedSections.has("certificates");

    function getFilledFields(data) {
        return Object.fromEntries(
            Object.entries(data).filter(([key, value]) => {
            if (value === '' || value === null || value === undefined) return false;

            if (key === 'additionalInfo') {
                const text = value.replace(/<[^>]*>/g, '').trim(); // Strip HTML tags
                return text.length > 0; // Only keep if meaningful content exists
            }

            return true;
            })
        );
    }

    function getChangedFields(newData, originalData) {
        return Object.fromEntries(
            Object.entries(newData).filter(([key, value]) => {
                const originalValue = originalData[key];

                if (key === 'date' || key === 'expirationDate') {
                    const originalDate = originalValue
                        ? new Date(originalValue).toISOString().split('T')[0]
                        : '';
                    const newDate = value
                        ? new Date(value).toISOString().split('T')[0]
                        : '';
                    return originalDate !== newDate;
                }

                if (key === 'additionalInfo') {
                    const normalizedOriginal = (originalValue ?? '').toString().trim();
                    const normalizedNew = (value ?? '').toString().trim();
                    return normalizedOriginal !== normalizedNew;
                }

                const normalizedOriginal = (originalValue ?? '').toString().trim();
                const normalizedNew = (value ?? '').toString().trim();
                return normalizedOriginal !== normalizedNew;
            })
        );
    }

    const handleSave = async () => {
        if (!certificateForm.title.trim()) {
            toast.error("Certification should not be empty.", {
                style: {
                    border: '1px solid orange',
                    backgroundColor: 'rgba(255, 165, 0, 0.1)',
                    color: 'orange'
                }
            });
            return;
        }
        try {
            if (certificatesEditingIndex === null) {
                console.log("Working")
                const filledData = getFilledFields(certificateForm);
                const response = await addNewCertificateDetail(filledData);
                if (response && response._id) {
                    const newCertificate = {...filledData, _id: response._id}
                    await addCertificates(newCertificate);
                    const updatedCertificate = onboardingStore.getState().certificates;
                    await updateOriginalData({certificates: updatedCertificate});
                    
                    // Clear tiptap content
                    editor.commands.setContent('<p>Write your summary...</p>');
                }          
            } else {
                const original = certificates[certificatesEditingIndex]
                const updatedFields = getChangedFields(certificateForm, original);
                console.log(updatedFields)
                if (Object.keys(updatedFields).length > 0) {
                    await patchCertificateDetail(updatedFields, original._id);
                    updateCertificates(certificatesEditingIndex, updatedFields);
                    const updatedCertificate = onboardingStore.getState().certificates;
                    await updateOriginalData({certificates: updatedCertificate});
                    console.log(updatedFields)
                } else {
                    toast("No Changes to Save", {
                        style: {
                        border: '1px solid #3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        color: '#3b82f6'
                    }
                    })
                    return;
                }
            }
        } catch (error) {
            console.error("Error saving:", error);
        }
        updateCertificateForm({
            title: '',
            link: '',
            license: '',
            issuer: '',
            date: '',
            expirationDate: '',
            additionalInfo: '',
            hide: false
        });
        updateCertificatesEditingIndex(null);
        updateAddCertificate(false);
    }

    const handleEdit = async (index) => {
        updateCertificateForm(originalData.certificates[index]);
        updateCertificatesEditingIndex(index);
    }

    const handleAdd = () => {
        updateCertificateForm({
            title: '',
            link: '',
            license: '',
            issuer: '',
            date: '',
            expirationDate: '',
            additionalInfo: '',
            hide: false    
        });
        updateAddCertificate(true);
    };

    const handleCancel = () => {
        updateCertificateForm({
            title: '',
            link: '',
            license: '',
            issuer: '',
            date: '',
            expirationDate: '',
            additionalInfo: '',
            hide: false   
        });
        updateAddCertificate(false);
        updateCertificatesEditingIndex(null);
    }

    const handleDelete = async (index) => {
        try {
            await deleteCertificateDetail(certificates[index]._id);
            removeCertificates(index);
        } catch (error) {
            
        }
    }

    React.useEffect(() => {
        if (!editor) return;

        const formContent = certificateForm.additionalInfo || "<p>Write your summary...</p>";
        const editorContent = editor.getHTML();

        // Only set content if it's actually different
        if (formContent.trim() !== editorContent.trim()) {
            editor.commands.setContent(formContent);
        }
    }, [certificateForm.additionalInfo, editor]);


    return (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden max-w-4xl">
            <SectionHeader 
                title="Certification"
                icon={<CertificateIcon/>}
                sectionId="certificates"
            />

            {isExpanded && (
                <>
                    {(certificates.length === 0 || certificatesEditingIndex !== null || addCertificate) && (
                        <CertficateForm 
                            data={certificateForm}
                            editor={editor}
                            handleSave={handleSave}
                            handleChange={updateCertificateForm}
                            certificatesEditingIndex={certificatesEditingIndex}
                            handleCancel={handleCancel}
                            addCertificate={addCertificate}
                        />
                    )}
            
                    {(certificates.length > 0 && certificatesEditingIndex === null && addCertificate === false) && (
                        <div className="p-6 border-t border-gray-800 space-y-6 w-full">
                            {certificates.map((certificate, index) => (
                                <div key={index} className="border-b pb-2 border-gray-800"> 
                                    <div className="flex justify-between">
                                        <div onClick={() => handleEdit(index)} className="font-semibold hover:text-gray-400">
                                            <p>{certificate.title}, {certificate.issuer && certificate.issuer}</p>
                                            <p>{certificate.date && new Date(certificate.date).toISOString().split("T")[0]} - {certificate.expirationDate && certificate.expirationDate} | {certificate.issuer && certificate.issuer}, {certificate.license && certificate.license}</p>
                                        </div>
                                        <div>
                                            <button 
                                                type="button"
                                                onClick={() => {handleDelete(index)}}
                                            >
                                                <Trash className="h-5 w-5 text-[#0A66C2] hover:text-white"/>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="flex justify-center">
                                <button className="bg-gradient-to-r from-indigo-500 to-purple-500 h-10 w-40 rounded-xl hover:from-indigo-600 hover:to-purple-600 hover:scale-105 transition-all transform" 
                                onClick={handleAdd}>Add +</button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

function CertficateForm({data, editor, handleSave, handleChange, certificatesEditingIndex, addCertificate, handleCancel}) {
    return (
        <div className="p-6 border-t border-gray-800 space-y-6 w-full">
            <h2 className="text-xl font-semibold">
              {certificatesEditingIndex !== null ? 'Update Certification' : 'Add Certification'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Certification
                    </label>
                    <input 
                        type="text"
                        value={data.title ?? ''}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Cloud Certification"
                        onChange={(e) => handleChange({ title: e.target.value})}
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Link
                    </label>
                    <input 
                        type="text"
                        value={data.link ?? ''}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="issuer.com\certificate"
                        onChange={(e) => handleChange({ link: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        License
                    </label>
                    <input 
                        type="text"
                        value={data.license ?? ''}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Amazon"
                        onChange={(e) => handleChange({ license: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Issuer
                    </label>
                    <input 
                        type="text"
                        value={data.issuer ?? ''}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="123456789"
                        onChange={(e) => handleChange({ issuer: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Issue Date
                    </label>
                    <input
                        type="date"
                        value={data.date ? new Date(data.date).toISOString().split("T")[0] : ''}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        onChange={(e) => handleChange({ date: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        End Data
                    </label>
                    <input 
                        type="date"
                        value={data.expirationDate ? new Date(data.expirationDate).toISOString().split("T")[0] : ''}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        onChange={(e) => handleChange({ expirationDate: e.target.value})}
                    />
                </div>
                <div className="md:col-span-2">
                    <MenuBar editor={editor} />
                    <div className="relative tipTapWrapper border border-gray-700 rounded-md bg-gray-800 text-white min-h-[124px] max-h-[1274px] overflow-auto">
                        <EditorContent
                        editor={editor}
                        className="tiptap list-disc list-inside"
                        />
                    </div>
                </div>
            </div>
            <div className="flex justify-end gap-2">
                {(certificatesEditingIndex !== null || addCertificate) && (
                    <button className="px-3 py-1.5 text-sm md:px-4 md:py-2 md:text-sm bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 flex items-center space-x-2 font-medium rounded-lg transition-all transform hover:scale-105 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-950 disabled:transform-none disabled:opaissuer-50" 
                    onClick={() => {handleCancel()}}>Cancel</button>
                )}
                <SaveButton itemId="certificates" onSave={handleSave}/>
            </div>
        </div>
    )
}

export default CertificationDetails;