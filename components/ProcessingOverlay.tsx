import React from 'react';
import { SparklesIcon } from './Icons';
import { Translations } from '../types';

interface ProcessingOverlayProps {
    t: Translations;
}

export const ProcessingOverlay: React.FC<ProcessingOverlayProps> = ({ t }) => {
    return (
        <div className="absolute inset-0 z-20 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center text-white">
            <div className="relative mb-6">
                <div className="w-24 h-24 border-4 border-white/20 rounded-full animate-[spin_3s_linear_infinite]"></div>
                <div className="absolute inset-0 border-4 border-t-primary-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                <SparklesIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 animate-pulse text-white" />
            </div>
            <h3 className="text-2xl font-bold tracking-tight mb-1">{t.processingTitle}</h3>
            <p className="text-white/70 text-sm font-mono">{t.processingDesc}</p>
        </div>
    );
};
