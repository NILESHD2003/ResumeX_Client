import React, { useCallback, useState, useRef } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../../utils/cropUtils";

export default function ImageCropperModal({ file, onCancel, onSave }) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const modalRef = useRef(null);

    const onCropComplete = useCallback((_, croppedPixels) => {
        setCroppedAreaPixels(croppedPixels);
    }, []);

    const handleSave = async () => {
        const croppedBlob = await getCroppedImg(URL.createObjectURL(file), croppedAreaPixels);
        onSave(croppedBlob);
    };

    const handleClickOutside = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            onCancel(); // close when clicking outside the modal
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center"
            onClick={handleClickOutside}
        >
            <div
                ref={modalRef}
                className="bg-gray-900/80 border border-gray-800 backdrop-blur-md rounded-lg p-4 w-[90vw] max-w-md shadow-xl"
                onClick={(e) => e.stopPropagation()} // prevent inside clicks from closing modal
            >
                <div className="relative w-full h-64 bg-gradient-to-b from-indigo-900/10 to-transparent rounded-md overflow-hidden">
                    <Cropper
                        image={URL.createObjectURL(file)}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                    />
                </div>
                <div className="flex justify-end mt-4 space-x-2">
                    <button
                        className="flex items-center space-x-2 font-medium rounded-lg transition-all transform hover:scale-105 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-950 bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 px-3 py-1.5 text-sm md:px-4 md:py-2"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                    <button
                        className="flex items-center space-x-2 font-medium rounded-lg transition-all transform hover:scale-105 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-950 bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 px-3 py-1.5 text-sm md:px-4 md:py-2"
                        onClick={handleSave}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
