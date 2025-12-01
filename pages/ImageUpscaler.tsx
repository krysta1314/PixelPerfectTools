import React, { useState, useRef, useEffect } from 'react';
import { AppState } from '../types';
import { enhanceImage } from '../services/geminiService';
import { ComparisonSlider } from '../components/ComparisonSlider';
import { Features, UseCases, FAQ } from '../components/Features';
import { UploadIcon, DownloadIcon, SparklesIcon, PlusIcon } from '../components/Icons';

interface ImageUpscalerProps {
    t: any;
    isLoggedIn: boolean;
    freeChances: number;
    credits: number;
    setFreeChances: (value: number | ((prev: number) => number)) => void;
    setCredits: (value: number | ((prev: number) => number)) => void;
    setShowLoginModal: (value: boolean) => void;
    setShowSubModal: (value: boolean) => void;
}

export function ImageUpscaler({
    t,
    isLoggedIn,
    freeChances,
    credits,
    setFreeChances,
    setCredits,
    setShowLoginModal,
    setShowSubModal
}: ImageUpscalerProps) {
    const [appState, setAppState] = useState<AppState>(AppState.LANDING);
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [resultImage, setResultImage] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string>('image');
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [scale, setScale] = useState<2 | 4 | 8>(2);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Auto Scroll to Preview
    useEffect(() => {
        if (appState === AppState.PREVIEW && originalImage) {
            setTimeout(() => {
                const workspace = document.getElementById('workspace');
                if (workspace) {
                    workspace.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 100);
        }
    }, [appState, originalImage]);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        processFile(file);
    };

    const processFile = (file?: File) => {
        if (file) {
            const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                setError("Please upload a supported image format (JPEG, PNG, WEBP).");
                return;
            }
            if (file.size > 10 * 1024 * 1024) {
                setError("File size too large. Please upload an image under 10MB.");
                return;
            }

            const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
            setFileName(nameWithoutExt);

            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                setOriginalImage(result);
                setAppState(AppState.PREVIEW);
                setResultImage(null);
                setError(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleProcessClick = () => {
        if (!isLoggedIn) {
            setShowLoginModal(true);
            return;
        }

        let useFree = false;
        let requiredCredits = 0;

        if (scale === 2) {
            if (freeChances > 0) {
                useFree = true;
            } else {
                requiredCredits = 2;
            }
        } else if (scale === 4) {
            requiredCredits = 4;
        } else if (scale === 8) {
            requiredCredits = 8;
        }

        if (useFree) {
            setFreeChances(prev => prev - 1);
            processImage();
        } else {
            if (credits >= requiredCredits) {
                setCredits(prev => prev - requiredCredits);
                processImage();
            } else {
                setShowSubModal(true);
            }
        }
    };

    const processImage = async () => {
        if (!originalImage) return;

        setAppState(AppState.PROCESSING);
        setError(null);
        const startTime = Date.now();

        try {
            const enhanced = await enhanceImage(originalImage, scale);

            const elapsed = Date.now() - startTime;
            const minDuration = 1500;
            if (elapsed < minDuration) {
                await new Promise(resolve => setTimeout(resolve, minDuration - elapsed));
            }

            setResultImage(enhanced);
            setAppState(AppState.RESULT);
        } catch (err: any) {
            console.error(err);
            setAppState(AppState.PREVIEW);
            setError(err.message || "Failed to enhance image. Please try again.");
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const reset = () => {
        setOriginalImage(null);
        setResultImage(null);
        setAppState(AppState.LANDING);
        setError(null);
        setFileName('image');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

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
        processFile(file);
    };

    return (
        <div className="min-h-[calc(100vh-200px)] pt-8 pb-20">
            <section className="relative pt-6 pb-0">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-white/5 border border-white/20 dark:border-white/10 text-slate-900 dark:text-white text-sm font-semibold mb-8 backdrop-blur-md shadow-sm hover:scale-105 transition-transform cursor-default">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                            </span>
                            Powered by Gemini 2.5 Flash
                        </div>

                        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6 leading-[1.1]">
                            {t.heroTitle} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-purple-600 to-blue-600 dark:from-primary-300 dark:via-purple-300 dark:to-blue-300 animate-gradient-x">
                                {t.heroSubtitle}
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-xl mb-10 leading-relaxed font-light">
                            {t.heroDesc}
                        </p>

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
                        </div>
                    </div>

                    <div className="relative w-full perspective-1000 group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-purple-600 rounded-3xl blur opacity-30 dark:opacity-50 group-hover:opacity-60 transition-opacity duration-500"></div>
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50 dark:border-white/10 backdrop-blur-md bg-slate-900/50 transform rotate-1 lg:rotate-2 group-hover:rotate-0 transition-transform duration-500">
                            <ComparisonSlider
                                beforeImage="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=30&blur=8&auto=format&fit=crop"
                                afterImage="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=90&auto=format&fit=crop"
                                t={t}
                            />
                        </div>

                        <div className="absolute -right-4 top-10 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-3 rounded-xl shadow-xl border border-white/20 dark:border-slate-700 animate-float hidden lg:block">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-xs font-bold text-slate-900 dark:text-white">Crisp Details</span>
                            </div>
                        </div>

                        <p className="mt-6 text-slate-500 dark:text-slate-500 text-sm font-medium tracking-wide flex items-center justify-center gap-2">
                            <SparklesIcon className="w-4 h-4" />
                            {t.demoLabel}
                        </p>
                    </div>
                </div>
            </section>

            {originalImage && (
                <div id="workspace" className="mb-20 scroll-mt-32">
                    {(appState === AppState.PREVIEW || appState === AppState.PROCESSING) && (
                        <section className="flex flex-col items-center justify-start pt-10 animate-in fade-in slide-in-from-bottom-8 duration-500">
                            <div className="max-w-7xl w-full bg-white/60 dark:bg-white/5 backdrop-blur-2xl border border-white/40 dark:border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl shadow-black/5 relative overflow-hidden">

                                <div className="flex justify-between items-center mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${appState === AppState.PROCESSING ? 'bg-yellow-500 animate-pulse' : 'bg-gray-400'}`}></div>
                                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t.previewTitle}</h2>
                                    </div>
                                    <button onClick={reset} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">{t.cancel}</button>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
                                    <div className="lg:col-span-2 relative aspect-video bg-gray-50/50 dark:bg-black/20 rounded-2xl overflow-hidden border border-gray-200/50 dark:border-white/5 flex items-center justify-center group">
                                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                                        <img src={originalImage || ''} alt="Original" className="relative z-10 max-h-full max-w-full object-contain shadow-2xl" />

                                        {appState === AppState.PROCESSING && (
                                            <div className="absolute inset-0 z-20 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                                                <div className="relative mb-6">
                                                    <div className="w-24 h-24 border-4 border-white/20 rounded-full animate-[spin_3s_linear_infinite]"></div>
                                                    <div className="absolute inset-0 border-4 border-t-primary-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                                                    <SparklesIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 animate-pulse text-white" />
                                                </div>
                                                <h3 className="text-2xl font-bold tracking-tight mb-1">{t.processingTitle}</h3>
                                                <p className="text-white/70 text-sm font-mono">{t.processingDesc}</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col justify-between h-full gap-6">
                                        <div className="flex flex-col gap-6">
                                            <div className="bg-white/50 dark:bg-white/5 p-6 rounded-2xl border border-white/20 dark:border-white/10">
                                                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Settings</h3>

                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">{t.scaleLabel}</span>
                                                        <div className="flex gap-2">
                                                            {[2, 4, 8].map((s) => {
                                                                const isSelected = scale === s;
                                                                return (
                                                                    <button
                                                                        key={s}
                                                                        onClick={() => setScale(s as 2 | 4 | 8)}
                                                                        className={`flex-1 py-2 rounded-lg text-sm font-bold border transition-all ${isSelected ? 'bg-primary-500 border-primary-500 text-white shadow-lg shadow-primary-500/30' : 'bg-white/50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-primary-500/50'}`}
                                                                    >
                                                                        {s}x
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                        <div className="text-xs text-slate-500 mt-1 flex justify-end">
                                                            {scale === 2 && freeChances > 0 ? (
                                                                <span className="text-green-500 font-bold">Free ({freeChances} Free chances left)</span>
                                                            ) : (
                                                                <span className="text-primary-500 font-bold">{scale === 2 ? 2 : scale} Credits</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                onClick={triggerFileInput}
                                                disabled={appState === AppState.PROCESSING}
                                                className="w-full py-3 px-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-white/20 text-slate-500 dark:text-slate-400 hover:border-primary-500 hover:text-primary-500 dark:hover:text-primary-400 transition-colors text-sm font-semibold flex items-center justify-center gap-2"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                                                Replace Image
                                            </button>
                                        </div>

                                        <div>
                                            <button
                                                onClick={handleProcessClick}
                                                disabled={appState === AppState.PROCESSING}
                                                className="w-full py-5 bg-gradient-to-r from-primary-600 to-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-primary-500/20 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
                                            >
                                                {appState === AppState.PROCESSING ? (
                                                    <>Processing...</>
                                                ) : (
                                                    <>
                                                        <SparklesIcon className="w-5 h-5 group-hover:animate-spin" />
                                                        {t.upscaleBtn}
                                                    </>
                                                )}
                                            </button>

                                            {error && (
                                                <div className="mt-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 p-4 rounded-xl text-sm border border-red-200 dark:border-red-900/30 animate-in fade-in slide-in-from-top-2">
                                                    <strong>Error:</strong> {error}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {appState === AppState.RESULT && resultImage && (
                        <section className="flex flex-col items-center pt-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                            <div className="max-w-7xl w-full">

                                <div className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl rounded-3xl p-3 border border-white/40 dark:border-white/10 shadow-2xl mb-8">
                                    <div className="relative rounded-2xl overflow-hidden">
                                        <img
                                            src={resultImage}
                                            alt="Upscaled Result"
                                            className="w-full h-auto object-contain max-h-[80vh] bg-gray-100 dark:bg-black/40"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-wrap justify-center gap-4 md:gap-6 pb-8">
                                    <div className="group relative">
                                        <button
                                            onClick={triggerFileInput}
                                            className="px-6 py-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/10 transition-all font-bold text-sm shadow-lg group-hover:shadow-xl group-hover:-translate-y-1 flex items-center gap-2"
                                        >
                                            <PlusIcon className="w-5 h-5" />
                                            {t.newImageBtn}
                                        </button>
                                    </div>

                                    <div className="group relative">
                                        <a
                                            href={resultImage}
                                            download={`${fileName}_enhanced.png`}
                                            className="px-8 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold transition-all flex items-center gap-2 shadow-lg group-hover:shadow-xl group-hover:-translate-y-1 inline-flex"
                                        >
                                            <DownloadIcon className="w-5 h-5" />
                                            {t.downloadBtn}
                                        </a>
                                    </div>

                                    <div className="group relative">
                                        <button
                                            className="px-8 py-3 rounded-xl relative overflow-hidden font-bold text-sm shadow-lg transition-all flex items-center gap-2 group-hover:shadow-xl group-hover:-translate-y-1"
                                        >
                                            <div className="absolute inset-0 bg-white dark:bg-[#0B0F19] rounded-xl z-10 m-[2px]"></div>
                                            <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-blue-500 rounded-xl z-0 animate-gradient-x"></div>

                                            <div className="relative z-20 flex items-center gap-2">
                                                <SparklesIcon className="w-5 h-5 text-primary-500 dark:text-primary-400" />
                                                <span className="bg-gradient-to-r from-primary-500 to-blue-500 bg-clip-text text-transparent">
                                                    {t.generateBtn}
                                                </span>
                                            </div>
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </section>
                    )}
                </div>
            )}

            <Features t={t} />
            <UseCases t={t} />
            <FAQ t={t} />

            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleFileUpload}
                onClick={(e) => ((e.target as HTMLInputElement).value = '')}
            />
        </div>
    );
}
