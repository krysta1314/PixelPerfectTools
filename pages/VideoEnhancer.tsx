import React, { useState, useRef, useEffect } from 'react';
import { AppState } from '../types';
import { Features, UseCases, FAQ } from '../components/Features';
import { UploadIcon, DownloadIcon, SparklesIcon, PlusIcon, PlayIcon, PauseIcon } from '../components/Icons';
import { Translations } from '../types';

interface VideoEnhancerProps {
    t: Translations;
}

export function VideoEnhancer({ t }: VideoEnhancerProps) {
    const [appState, setAppState] = useState<AppState>(AppState.LANDING);
    const [originalVideo, setOriginalVideo] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string>('video');
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [enhanceMode, setEnhanceMode] = useState<'2x' | '4x' | 'hdr'>('2x');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Video Refs
    const originalVideoRef = useRef<HTMLVideoElement>(null);
    const enhancedVideoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    // Auto Scroll to Preview
    useEffect(() => {
        if (appState === AppState.PREVIEW && originalVideo) {
            setTimeout(() => {
                const workspace = document.getElementById('workspace');
                if (workspace) {
                    workspace.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 100);
        }
    }, [appState, originalVideo]);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        processFile(file);
    };

    const processFile = (file?: File) => {
        if (file) {
            const validTypes = ['video/mp4', 'video/webm'];
            if (!validTypes.includes(file.type)) {
                setError("Please upload a supported video format (MP4, WebM).");
                return;
            }
            if (file.size > 50 * 1024 * 1024) {
                setError("File size too large. Please upload a video under 50MB.");
                return;
            }

            const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
            setFileName(nameWithoutExt);

            const url = URL.createObjectURL(file);
            setOriginalVideo(url);
            setAppState(AppState.PREVIEW);
            setError(null);
        }
    };

    const handleProcessClick = () => {
        processVideo();
    };

    const processVideo = async () => {
        if (!originalVideo) return;

        setAppState(AppState.PROCESSING);
        setError(null);

        // Simulate processing
        setTimeout(() => {
            setAppState(AppState.RESULT);
        }, 3000);
    };

    const togglePlay = () => {
        if (originalVideoRef.current && enhancedVideoRef.current) {
            if (isPlaying) {
                originalVideoRef.current.pause();
                enhancedVideoRef.current.pause();
            } else {
                originalVideoRef.current.play();
                enhancedVideoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    // Sync videos
    useEffect(() => {
        const v1 = originalVideoRef.current;
        const v2 = enhancedVideoRef.current;

        if (v1 && v2) {
            const sync = () => {
                if (Math.abs(v1.currentTime - v2.currentTime) > 0.1) {
                    v2.currentTime = v1.currentTime;
                }
            };
            v1.addEventListener('timeupdate', sync);
            return () => v1.removeEventListener('timeupdate', sync);
        }
    }, [appState]);

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const reset = () => {
        setOriginalVideo(null);
        setAppState(AppState.LANDING);
        setError(null);
        setFileName('video');
        setIsPlaying(false);
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

    // SEO Content
    const customFeatures = [
        { title: "4K AI Upscaling", desc: "Upscale low-res videos to 4K clarity without losing detail.", icon: <SparklesIcon className="w-7 h-7" /> },
        { title: "Noise Reduction", desc: "Remove grain and artifacts from old or low-light footage.", icon: <SparklesIcon className="w-7 h-7" /> },
        { title: "Color Correction", desc: "Automatically adjust brightness, contrast, and saturation for vibrant visuals.", icon: <SparklesIcon className="w-7 h-7" /> }
    ];

    const customCases = [
        "Old Video Restoration", "User Generated Content", "Product Demos", "Social Media Clips", "Archive Footage", "Low-Light Video"
    ];

    const customFaqs = [
        { q: "What formats are supported?", a: "We currently support MP4 and WebM video formats." },
        { q: "Is there a size limit?", a: "Yes, the current limit is 50MB per video for optimal processing speed." },
        { q: "How long does it take?", a: "Processing time depends on the video length and resolution, typically taking 2-3x the video duration." },
        { q: "Can I upscale to 8K?", a: "Currently we support upscaling up to 4K resolution." },
        { q: "Is audio preserved?", a: "Yes, the original audio is preserved in the enhanced video." }
    ];

    return (
        <div className="min-h-[calc(100vh-200px)] pt-8 pb-20">
            <section className="relative pt-6 pb-0">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-white/5 border border-white/20 dark:border-white/10 text-slate-900 dark:text-white text-sm font-semibold mb-8 backdrop-blur-md shadow-sm hover:scale-105 transition-transform cursor-default">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-purple-500"></span>
                            </span>
                            AI Video Enhancement
                        </div>

                        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6 leading-[1.1]">
                            {t.videoEnhancerTitle} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 dark:from-purple-300 dark:via-pink-300 dark:to-red-300 animate-gradient-x">
                                {t.videoEnhancerSubtitle}
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-xl mb-10 leading-relaxed font-light">
                            Transform low-quality videos into stunning 4K masterpieces. Restore old footage and enhance details instantly.
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
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-600 rounded-3xl blur opacity-30 dark:opacity-50 group-hover:opacity-60 transition-opacity duration-500"></div>
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50 dark:border-white/10 backdrop-blur-md bg-slate-900/50 transform rotate-1 lg:rotate-2 group-hover:rotate-0 transition-transform duration-500 aspect-video flex items-center justify-center">
                            <video
                                src="https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-gift-box-4867-large.mp4"
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-bold border border-white/20">
                                    Before / After Preview
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {originalVideo && (
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
                                    <div className="lg:col-span-2 relative aspect-video bg-black rounded-2xl overflow-hidden border border-gray-200/50 dark:border-white/5 flex items-center justify-center group">
                                        <video
                                            src={originalVideo}
                                            controls
                                            className="w-full h-full object-contain"
                                        />

                                        {appState === AppState.PROCESSING && (
                                            <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white">
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
                                                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Enhancement Mode</h3>

                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">{t.enhanceModeLabel}</span>
                                                        <div className="flex gap-2">
                                                            {(['2x', '4x', 'hdr'] as const).map((m) => {
                                                                const isSelected = enhanceMode === m;
                                                                return (
                                                                    <button
                                                                        key={m}
                                                                        onClick={() => setEnhanceMode(m)}
                                                                        className={`flex-1 py-2 rounded-lg text-sm font-bold border transition-all uppercase ${isSelected ? 'bg-primary-500 border-primary-500 text-white shadow-lg shadow-primary-500/30' : 'bg-white/50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-primary-500/50'}`}
                                                                    >
                                                                        {m}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                onClick={triggerFileInput}
                                                disabled={appState === AppState.PROCESSING}
                                                className="w-full py-3 px-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-white/20 text-slate-500 dark:text-slate-400 hover:border-primary-500 hover:text-primary-500 dark:hover:text-primary-400 transition-colors text-sm font-semibold flex items-center justify-center gap-2"
                                            >
                                                Replace Video
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
                                                        {t.videoEnhanceBtn}
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

                    {appState === AppState.RESULT && originalVideo && (
                        <section className="flex flex-col items-center pt-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                            <div className="max-w-7xl w-full">

                                <div className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl rounded-3xl p-6 border border-white/40 dark:border-white/10 shadow-2xl mb-8">
                                    <div className="flex justify-center mb-6">
                                        <button
                                            onClick={togglePlay}
                                            className="px-6 py-2 bg-primary-600 text-white rounded-full font-bold hover:bg-primary-700 transition-colors flex items-center gap-2"
                                        >
                                            {isPlaying ? <PauseIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
                                            {isPlaying ? 'Pause Comparison' : 'Play Comparison'}
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <h3 className="text-center font-bold text-slate-500">Original</h3>
                                            <div className="relative rounded-2xl overflow-hidden aspect-video bg-black">
                                                <video
                                                    ref={originalVideoRef}
                                                    src={originalVideo}
                                                    className="w-full h-full object-contain opacity-70 blur-[1px]"
                                                    loop
                                                    muted
                                                    playsInline
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-center font-bold text-primary-500">Enhanced (Simulated)</h3>
                                            <div className="relative rounded-2xl overflow-hidden aspect-video bg-black shadow-lg shadow-primary-500/20 ring-2 ring-primary-500/50">
                                                <video
                                                    ref={enhancedVideoRef}
                                                    src={originalVideo}
                                                    className="w-full h-full object-contain contrast-125 saturate-125"
                                                    loop
                                                    muted
                                                    playsInline
                                                />
                                            </div>
                                        </div>
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
                                            href={originalVideo}
                                            download={`${fileName}_enhanced.mp4`}
                                            className="px-8 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold transition-all flex items-center gap-2 shadow-lg group-hover:shadow-xl group-hover:-translate-y-1 inline-flex"
                                        >
                                            <DownloadIcon className="w-5 h-5" />
                                            {t.downloadBtn}
                                        </a>
                                    </div>
                                </div>

                            </div>
                        </section>
                    )}
                </div>
            )}

            <Features t={t} customFeatures={customFeatures} />
            <UseCases t={t} customCases={customCases} />
            <FAQ t={t} customFaqs={customFaqs} />

            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="video/mp4, video/webm"
                onChange={handleFileUpload}
                onClick={(e) => ((e.target as HTMLInputElement).value = '')}
            />
        </div>
    );
}
