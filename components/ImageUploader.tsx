import React, { useState, useRef } from 'react';
import { UploadIcon } from './Icons';
import { Translations } from '../types';

interface ImageUploaderProps {
    t: Translations;
    onUpload: (file: File) => void;
    acceptedFormats?: string[];
    maxSizeMB?: number;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
    t,
    onUpload,
    acceptedFormats = ['image/jpeg', 'image/png', 'image/webp'],
    maxSizeMB = 10
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) validateAndUpload(file);
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) validateAndUpload(file);
    };

    const validateAndUpload = (file: File) => {
        if (!acceptedFormats.includes(file.type)) {
            alert("Please upload a supported image format.");
            return;
        }
        if (file.size > maxSizeMB * 1024 * 1024) {
            alert(`File size too large. Please upload an image under ${maxSizeMB}MB.`);
            return;
        }
        onUpload(file);
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <div
            className={`w-full max-w-xl p-1 rounded-3xl bg-gradient-to-b from-gray-200 to-gray-50 dark:from-white/10 dark:to-transparent ${isDragging ? 'ring-4 ring-primary-500 scale-[1.02]' : ''} transition-all duration-300`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-[22px] p-6 md:p-8 text-center border border-white/40 dark:border-white/10 shadow-xl relative overflow-hidden group">
                <div className="relative z-10 flex flex-col items-center">
                    <button
                        onClick={triggerFileInput}
                        className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl text-lg hover:shadow-lg hover:scale-105 transition-all mb-4 flex items-center justify-center gap-2"
                    >
                        <UploadIcon className="w-5 h-5" />
                        {t.uploadBtn}
                    </button>
                    <p className="text-sm text-slate-400">{t.supportedFormats}</p>
                </div>
            </div>
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept={acceptedFormats.join(',')}
                onChange={handleFileUpload}
                onClick={(e) => ((e.target as HTMLInputElement).value = '')}
            />
        </div>
    );
};
