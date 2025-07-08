import React, { useCallback, useState, useRef } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../../utils/cropUtils";

export default function ImageCropperModal({ file, onCancel, onSave }) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [aspect, setAspect] = useState(1); // null = free
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
            onCancel();
        }
    };

    const handleAspectChange = (e) => {
        const value = e.target.value;
        if (value === "free") {
            setAspect(null);
        } else {
            setAspect(parseFloat(value));
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center"
            onClick={handleClickOutside}
        >
            <div
                ref={modalRef}
                className="bg-gray-900/90 border border-gray-800 backdrop-blur-md rounded-lg p-4 w-[90vw] max-w-md shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Aspect Ratio Selector */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-white mb-1">
                        Aspect Ratio
                    </label>
                    <select
                        onChange={handleAspectChange}
                        className="w-full bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={aspect === null ? "free" : aspect}
                    >
                        <option value={1}>1:1</option>
                        <option value={(16 / 9).toFixed(2)}>16:9</option>
                        <option value={(4 / 3).toFixed(2)}>4:3</option>
                    </select>
                </div>

                {/* Cropper */}
                <div className="relative w-full h-64 bg-black/40 rounded-md overflow-hidden">
                    <Cropper
                        image={URL.createObjectURL(file)}
                        crop={crop}
                        zoom={zoom}
                        aspect={aspect || undefined}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                        cropSize={aspect ? undefined : { width: 200, height: 200 }}
                    />
                </div>

                {/* Buttons */}
                <div className="flex justify-end mt-4 space-x-2">
                    <button
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-sm"
                        onClick={handleSave}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
