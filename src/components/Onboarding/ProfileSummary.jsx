import React from "react";
import SectionHeader from "./SectionHeader";
import { onboardingStore } from "../../stores/onboardingStore";
import toast from "react-hot-toast";
import { patchProfileSummaryDetails } from "../../services/operations/profileSummaryAPI";
import { IdentificationCardIcon } from "@phosphor-icons/react";
import { useEditor, EditorContent } from "@tiptap/react";
import SaveButton from "./SaveButton";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import MenuBar from "../shared/MenuBar";

function ProfileSummary() {
    const {
        profileSummary,
        updateProfileSummary,
        originalData,
        updateOriginalData,
        expandedSections
    } = onboardingStore();

    const isExpanded = expandedSections.has("profileSummary");

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
        content: profileSummary || "<p>Write your summary...</p>",
        onUpdate: ({ editor }) => {
            updateProfileSummary(editor.getHTML());
        },
    });

    const isEmpty =
        editor && editor.getText().trim() === "";

    const handleSave = async () => {
        if (isEmpty) {
            toast.error("Profile Summary should not be empty.", {
                style: {
                    border: '1px solid orange',
                    backgroundColor: 'rgba(255, 165, 0, 0.1)',
                    color: 'orange'
                }
            });
            return;
        }

        if (profileSummary === originalData.profileSummary) {
            toast("No Changes to Save", {
                style: {
                border: '1px solid #3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                color: '#3b82f6'
            }
            })
            return;
        }

        try {
            await patchProfileSummaryDetails(profileSummary);
            updateOriginalData({profileSummary: profileSummary});
        } catch (error) {
            console.error("Update failed", error);
        }
    }

    React.useEffect(() => {
        if (editor && originalData.profileSummary !== undefined) {
            editor.commands.setContent(originalData.profileSummary || "<p>Write your summary...</p>");
        }
    }, [editor, originalData.profileSummary]);

    return (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden max-w-4xl">
            <SectionHeader 
                title="Profile Summary"
                icon={<IdentificationCardIcon/>}
                sectionId="profileSummary"
            />

            {isExpanded && (
                <div className="p-6 border-t border-gray-800 space-y-6 w-full">
                     <MenuBar editor={editor} />
                     <div className="relative tipTapWrapper border border-gray-700 rounded-md bg-gray-800 text-white min-h-[124px] max-h-[1274px] overflow-auto">
                        <EditorContent
                        editor={editor}
                        className="tiptap list-disc list-inside"
                        />
                    </div>
                    <div className="flex justify-end">
                        <SaveButton itemId="profileSummary" onSave={handleSave}/>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProfileSummary;