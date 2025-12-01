import React, { useState, useRef, useEffect } from 'react';
import { AppState } from '../types';
import { ComparisonSlider } from '../components/ComparisonSlider';
import { Features, UseCases, FAQ } from '../components/Features';
import { UploadIcon, DownloadIcon, SparklesIcon, PlusIcon } from '../components/Icons';
import { Translations } from '../types';

interface CartoonGeneratorProps {
    t: Translations;
}

export function CartoonGenerator({ t }: CartoonGeneratorProps) {
    const [appState, setAppState] = useState<AppState>(AppState.LANDING);
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [resultImage, setResultImage] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string>('image');
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [style, setStyle] = useState<'disney' | 'anime' | 'sketch' | 'oil'>('disney');
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
        processImage();
    };

    const processImage = async () => {
        if (!originalImage) return;

        setAppState(AppState.PROCESSING);
        setError(null);

        setTimeout(() => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    // Apply filters based on style
                    let filter = 'none';
                    switch (style) {
                        case 'disney':
                            filter = 'saturate(1.5) contrast(1.2) brightness(1.1)';
                            break;
                        case 'anime':
                            filter = 'saturate(2) contrast(1.1) hue-rotate(-10deg)';
                            break;
                        case 'sketch':
                            filter = 'grayscale(100%) contrast(1.5) brightness(1.2)';
                            break;
                        case 'oil':
                            filter = 'saturate(1.8) contrast(1.3) sepia(0.3)';
                            break;
                    }

                    ctx.filter = filter;
                    ctx.drawImage(img, 0, 0);

                    setResultImage(canvas.toDataURL());
                    setAppState(AppState.RESULT);
                }
            };
            img.src = originalImage;
        }, 2500);
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

    const styles = [
        { id: 'disney', label: t.styleDisney, img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop', color: 'from-pink-500 to-purple-500' },
        { id: 'anime', label: t.styleAnime, img: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=200&h=200&fit=crop', color: 'from-blue-500 to-cyan-500' },
        { id: 'sketch', label: t.styleSketch, img: 'https://images.unsplash.com/photo-1515405295579-ba7a45243476?w=200&h=200&fit=crop', color: 'from-gray-500 to-slate-500' },
        { id: 'oil', label: t.styleOil, img: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=200&h=200&fit=crop', color: 'from-yellow-500 to-orange-500' },
    ];

    // SEO Content
    const customFeatures = [
        { title: "Multiple Styles", desc: "Choose from Disney 3D, Anime, Sketch, and Oil Painting styles.", icon: <SparklesIcon className="w-7 h-7" /> },
        { title: "AI-Powered", desc: "Advanced algorithms transform your photos while preserving facial features.", icon: <SparklesIcon className="w-7 h-7" /> },
        { title: "High Resolution", desc: "Download high-quality cartoon avatars suitable for printing.", icon: <SparklesIcon className="w-7 h-7" /> }
    ];

    const customCases = [
        "Social Media Avatars", "Personalized Gifts", "Artistic Projects", "Fun & Entertainment", "Profile Pictures", "Digital Art"
    ];

    const customFaqs = [
        { q: "What styles are available?", a: "We currently offer Disney 3D, Anime, Pencil Sketch, and Oil Painting styles." },
        { q: "Is it free to use?", a: "Yes, you can generate cartoon images for free with daily credits." },
        { q: "Can I use it for commercial purposes?", a: "Yes, the generated images are yours to use commercially." },
        { q: "Does it work on pets?", a: "Yes! It works great on both human portraits and pet photos." },
        { q: "Is my data safe?", a: "We process images securely and do not store them permanently." }
    ];

    return (
        <div className="min-h-[calc(100vh-200px)] pt-8 pb-20">
            <section className="relative pt-6 pb-12">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-white/5 border border-white/20 dark:border-white/10 text-slate-900 dark:text-white text-sm font-semibold mb-8 backdrop-blur-md shadow-sm hover:scale-105 transition-transform cursor-default">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-pink-500"></span>
                        </span>
                        AI Cartoon Generator
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6 leading-[1.1]">
                        {t.cartoonTitle} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 animate-gradient-x">
                            {t.cartoonSubtitle}
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
                        Turn your photos into amazing cartoons in seconds. Choose from multiple styles like Disney, Anime, and more.
                    </p>

                    {/* Main Workspace Area */}
                    <div className="max-w-6xl mx-auto bg-white/60 dark:bg-white/5 backdrop-blur-2xl border border-white/40 dark:border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl shadow-black/5 relative overflow-hidden" id="workspace">

                        {!originalImage ? (
                            <div
                                className={`w-full py-20 border-3 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${isDragging ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10' : 'border-gray-300 dark:border-white/20 hover:border-primary-400 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={triggerFileInput}
                            >
                                <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-full flex items-center justify-center mb-6">
                                    <UploadIcon className="w-10 h-10" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t.uploadBtn}</h3>
                                <p className="text-slate-500 dark:text-slate-400">Drag & drop or click to upload</p>
                                <p className="text-xs text-slate-400 mt-4">{t.supportedFormats}</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Left: Image Preview */}
                                <div className="lg:col-span-2 relative aspect-[4/3] bg-gray-50/50 dark:bg-black/20 rounded-2xl overflow-hidden border border-gray-200/50 dark:border-white/5 flex items-center justify-center group">
                                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                                    {appState === AppState.RESULT && resultImage ? (
                                        <div className="w-full h-full">
                                            <ComparisonSlider
                                                beforeImage={originalImage}
                                                afterImage={resultImage}
                                                t={t}
                                            />
                                        </div>
                                    ) : (
                                        <img src={originalImage} alt="Original" className="relative z-10 max-h-full max-w-full object-contain shadow-2xl" />
                                    )}

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

                                {/* Right: Controls */}
                                <div className="flex flex-col h-full gap-6">
                                    <div className="bg-white/50 dark:bg-white/5 p-6 rounded-2xl border border-white/20 dark:border-white/10 flex-grow">
                                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">{t.styleLabel}</h3>

                                        <div className="grid grid-cols-2 gap-3">
                                            {styles.map((s) => (
                                                <button
                                                    key={s.id}
                                                    onClick={() => setStyle(s.id as any)}
                                                    className={`relative group overflow-hidden rounded-xl border-2 transition-all ${style === s.id ? 'border-primary-500 ring-2 ring-primary-500/20' : 'border-transparent hover:border-gray-300 dark:hover:border-white/20'}`}
                                                >
                                                    <div className="aspect-square relative">
                                                        <img src={s.img} alt={s.label} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                                        <div className={`absolute inset-0 bg-gradient-to-t ${s.color} opacity-0 group-hover:opacity-40 transition-opacity`}></div>
                                                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/60 backdrop-blur-sm text-white text-xs font-bold text-center">
                                                            {s.label}
                                                        </div>
                                                        {style === s.id && (
                                                            <div className="absolute top-2 right-2 bg-primary-500 text-white p-1 rounded-full shadow-lg">
                                                                <SparklesIcon className="w-3 h-3" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        {appState === AppState.RESULT ? (
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={triggerFileInput}
                                                    className="flex-1 py-4 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-bold hover:bg-gray-50 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                                                >
                                                    <PlusIcon className="w-5 h-5" />
                                                    New
                                                </button>
                                                <a
                                                    href={resultImage || ''}
                                                    download={`${fileName}_cartoon.png`}
                                                    className="flex-[2] py-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                                                >
                                                    <DownloadIcon className="w-5 h-5" />
                                                    Download
                                                </a>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={handleProcessClick}
                                                disabled={appState === AppState.PROCESSING}
                                                className="w-full py-5 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-2xl shadow-xl shadow-pink-500/20 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
                                            >
                                                {appState === AppState.PROCESSING ? (
                                                    <>Processing...</>
                                                ) : (
                                                    <>
                                                        <SparklesIcon className="w-5 h-5 group-hover:animate-spin" />
                                                        {t.cartoonBtn}
                                                    </>
                                                )}
                                            </button>
                                        )}

                                        {appState !== AppState.RESULT && (
                                            <button
                                                onClick={triggerFileInput}
                                                disabled={appState === AppState.PROCESSING}
                                                className="w-full py-3 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-sm font-semibold transition-colors"
                                            >
                                                Replace Image
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Gallery Section */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">Amazing Transformations</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { before: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2', after: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2', style: 'Disney 3D' },
                            { before: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d', after: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d', style: 'Anime' },
                            { before: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb', after: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb', style: 'Sketch' },
                            { before: 'https://images.unsplash.com/photo-1517841905240-472988babdf9', after: 'https://images.unsplash.com/photo-1517841905240-472988babdf9', style: 'Oil Painting' },
                        ].map((item, i) => (
                            <div key={i} className="relative group rounded-2xl overflow-hidden aspect-[3/4]">
                                <img src={item.before} alt="Example" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="text-white font-bold border border-white/50 px-4 py-2 rounded-full backdrop-blur-sm">{item.style}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Features t={t} customFeatures={customFeatures} />
            <UseCases t={t} customCases={customCases} />
            <FAQ t={t} customFaqs={customFaqs} />

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
