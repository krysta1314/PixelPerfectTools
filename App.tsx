

import React, { useState, useRef, useEffect } from 'react';
import { AppState, Theme, LanguageCode } from './types';
import { enhanceImage } from './services/geminiService';
import { ComparisonSlider } from './components/ComparisonSlider';
import { Features, UseCases, FAQ } from './components/Features';
import { Footer } from './components/Footer';
import { UploadIcon, DownloadIcon, SparklesIcon, MenuIcon, SunIcon, MoonIcon, GlobeIcon, PlusIcon, BrandLogo, CheckIcon } from './components/Icons';
import { getDictionary, LANGUAGES } from './lib/translations';

function App() {
  // Settings State
  const [theme, setTheme] = useState<Theme>('dark');
  const [lang, setLang] = useState<LanguageCode>('en');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  // App Logic State
  const [appState, setAppState] = useState<AppState>(AppState.LANDING);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('image');
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New Business Logic State
  const [scale, setScale] = useState<2 | 4 | 8>(2);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [freeChances, setFreeChances] = useState(3);
  const [credits, setCredits] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSubModal, setShowSubModal] = useState(false);
  const [lastReset, setLastReset] = useState(Date.now());

  // Translations
  const t = getDictionary(lang);

  // --- Initialization & Detection ---
  useEffect(() => {
    // 1. Theme Detection
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    if (storedTheme) {
      setTheme(storedTheme);
    } else {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      setTheme(systemTheme);
    }

    // 2. Language Detection
    const navLang = navigator.language;
    const baseLang = navLang.split('-')[0];
    let detectedLang: LanguageCode = 'en';
    const exactMatch = LANGUAGES.find(l => l.code.toLowerCase() === navLang.toLowerCase());
    if (exactMatch) {
      detectedLang = exactMatch.code;
    } else {
      const baseMatch = LANGUAGES.find(l => l.code === baseLang);
      if (baseMatch) {
        detectedLang = baseMatch.code;
      }
    }
    setLang(detectedLang);

    // 3. User Data Logic (Simulated Backend)
    const savedUserData = localStorage.getItem('pixelPerfect_user_data');
    if (savedUserData) {
      const data = JSON.parse(savedUserData);
      // Check for 24h reset
      if (Date.now() - data.lastReset > 24 * 60 * 60 * 1000) {
        setFreeChances(3);
        setLastReset(Date.now());
        // Preserve other data
        setCredits(data.credits);
        setIsLoggedIn(data.isLoggedIn);
      } else {
        setFreeChances(data.freeChances);
        setCredits(data.credits);
        setIsLoggedIn(data.isLoggedIn);
        setLastReset(data.lastReset);
      }
    }
  }, []);

  // --- Theme Effect ---
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // --- User Data Persistence ---
  useEffect(() => {
    localStorage.setItem('pixelPerfect_user_data', JSON.stringify({
      freeChances,
      credits,
      isLoggedIn,
      lastReset
    }));
  }, [freeChances, credits, isLoggedIn, lastReset]);

  // --- Click Outside for Lang Menu ---
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- Auto Scroll to Preview ---
  useEffect(() => {
    if (appState === AppState.PREVIEW && originalImage) {
      // Small timeout to ensure DOM is rendered
      setTimeout(() => {
        const workspace = document.getElementById('workspace');
        if (workspace) {
          workspace.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }, [appState, originalImage]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

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

      // Extract filename without extension
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
    // 1. Check Login
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    // 2. Calculate Cost & Quota
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

    // 3. Check sufficiency
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

  const handleLogin = () => {
    setIsLoggedIn(true);
    setShowLoginModal(false);
  };

  const [isToolsMenuOpen, setIsToolsMenuOpen] = useState(false);
  const toolsMenuRef = useRef<HTMLDivElement>(null);

  // --- Click Outside for Tools Menu ---
  useEffect(() => {
    function handleClickOutsideTools(event: MouseEvent) {
      if (toolsMenuRef.current && !toolsMenuRef.current.contains(event.target as Node)) {
        setIsToolsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutsideTools);
    return () => document.removeEventListener("mousedown", handleClickOutsideTools);
  }, []);

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
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen flex flex-col font-sans selection:bg-primary-500 selection:text-white transition-colors duration-300 relative bg-gray-50 dark:bg-[#0B0F19]">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-primary-400/20 dark:bg-primary-500/10 rounded-[100%] blur-[120px] pointer-events-none mix-blend-multiply dark:mix-blend-screen opacity-50 dark:opacity-40 animate-pulse z-0"></div>

      <header className="fixed top-6 left-1/2 -translate-x-1/2 w-[calc(100%-60px)] max-w-[1430px] z-50 transition-all duration-300">
        <div className="backdrop-blur-xl bg-white/40 dark:bg-black/40 border border-white/20 dark:border-white/10 shadow-lg shadow-black/5 rounded-full px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={reset}>
              <BrandLogo className="w-8 h-8 md:w-10 md:h-10 text-slate-900 dark:text-white group-hover:scale-105 transition-transform" />
              <span className="text-slate-900 dark:text-white font-extrabold text-2xl tracking-tighter hidden sm:block font-display drop-shadow-sm">PixelPerfect <span className="bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient-x">AI</span></span>
            </div>

            {/* Tools Menu */}
            <nav className="hidden md:block relative" ref={toolsMenuRef} onMouseEnter={() => setIsToolsMenuOpen(true)} onMouseLeave={() => setIsToolsMenuOpen(false)}>
              <button
                className="flex items-center gap-1 text-slate-700 dark:text-slate-200 font-medium hover:text-primary-600 dark:hover:text-primary-400 transition-colors py-2"
                onClick={() => setIsToolsMenuOpen(true)}
              >
                {t.toolsMenu}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 ${isToolsMenuOpen ? 'rotate-180' : ''}`}><path d="m6 9 6 6 6-6" /></svg>
              </button>

              {isToolsMenuOpen && (
                <div className="absolute top-full left-0 pt-2 w-64 animate-in fade-in zoom-in-95 duration-200">
                  <div className="bg-white/90 dark:bg-[#151b2b]/95 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl py-2 overflow-hidden">
                    <a href="#" className="block px-4 py-3 text-sm font-bold text-slate-900 dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                      {t.allTools}
                    </a>
                    <div className="h-px bg-slate-200 dark:bg-white/10 my-1"></div>

                    <a href="#" onClick={(e) => { e.preventDefault(); reset(); setIsToolsMenuOpen(false); }} className="block px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center justify-between group">
                      <span>{t.imageUpscaler}</span>
                      <CheckIcon className="w-4 h-4 text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>

                    <div className="px-4 py-3 text-sm text-slate-400 dark:text-slate-500 flex items-center justify-between cursor-not-allowed opacity-70">
                      <span>{t.imageRemover}</span>
                      <span className="text-[10px] font-bold bg-slate-100 dark:bg-white/10 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200 dark:border-white/5">{t.comingSoon}</span>
                    </div>

                    <div className="px-4 py-3 text-sm text-slate-400 dark:text-slate-500 flex items-center justify-between cursor-not-allowed opacity-70">
                      <span>{t.imageExtender}</span>
                      <span className="text-[10px] font-bold bg-slate-100 dark:bg-white/10 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200 dark:border-white/5">{t.comingSoon}</span>
                    </div>

                    <div className="px-4 py-3 text-sm text-slate-400 dark:text-slate-500 flex items-center justify-between cursor-not-allowed opacity-70">
                      <span>{t.videoEnhancer}</span>
                      <span className="text-[10px] font-bold bg-slate-100 dark:bg-white/10 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200 dark:border-white/5">{t.comingSoon}</span>
                    </div>
                  </div>
                </div>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <div className="relative" ref={langMenuRef}>
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="p-2 text-slate-700 dark:text-slate-200 hover:bg-white/20 dark:hover:bg-white/10 rounded-full transition-colors flex items-center gap-2"
                aria-label="Select Language"
              >
                <GlobeIcon className="w-5 h-5" />
                <span className="text-xs font-bold uppercase hidden md:inline-block tracking-wide">{lang}</span>
              </button>

              {isLangMenuOpen && (
                <div className="absolute top-full right-0 mt-4 w-56 max-h-96 overflow-y-auto bg-white/90 dark:bg-[#151b2b]/90 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl py-2 animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Select Language</div>
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLang(l.code);
                        setIsLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 text-sm hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center justify-between ${lang === l.code ? 'text-primary-600 dark:text-primary-400 font-bold bg-black/5 dark:bg-white/5' : 'text-slate-700 dark:text-slate-300'}`}
                    >
                      {l.label}
                      {lang === l.code && <div className="w-2 h-2 rounded-full bg-primary-500"></div>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={toggleTheme}
              className="p-2 text-slate-700 dark:text-slate-200 hover:bg-white/20 dark:hover:bg-white/10 rounded-full transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
            </button>

            {!isLoggedIn ? (
              <button
                onClick={() => setShowLoginModal(true)}
                className="ml-2 px-5 py-2 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold hover:shadow-lg hover:scale-105 transition-all"
              >
                {t.login}
              </button>
            ) : (
              <button
                onClick={() => setIsLoggedIn(false)}
                className="ml-2 w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold"
              >
                JD
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow pt-32 pb-20 px-4 relative z-10">

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
                {/* Updated max-w-7xl to match Hero */}
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
                    {/* New Image Button */}
                    <div className="group relative">
                      <button
                        onClick={triggerFileInput}
                        className="px-6 py-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/10 transition-all font-bold text-sm shadow-lg group-hover:shadow-xl group-hover:-translate-y-1 flex items-center gap-2"
                      >
                        <PlusIcon className="w-5 h-5" />
                        {t.newImageBtn}
                      </button>
                    </div>

                    {/* Download Button */}
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

                    {/* Generate Image Button */}
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

        {/* Login Modal */}
        {showLoginModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowLoginModal(false)}></div>
            <div className="relative bg-white dark:bg-[#1a1f2e] border border-white/10 rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 fade-in duration-200 text-center">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" /></svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t.loginTitle}</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">{t.loginDesc}</p>
              <button onClick={handleLogin} className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-colors">{t.loginAction}</button>
              <button onClick={() => setShowLoginModal(false)} className="mt-4 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">{t.cancel}</button>
            </div>
          </div>
        )}

        {/* Subscription Modal */}
        {showSubModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSubModal(false)}></div>
            <div className="relative bg-white dark:bg-[#1a1f2e] border border-white/10 rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 fade-in duration-200 text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <SparklesIcon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t.subTitle}</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">{t.subDesc}</p>
              <button onClick={() => setShowSubModal(false)} className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-500/20">{t.subAction}</button>
              <button onClick={() => setShowSubModal(false)} className="mt-4 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">{t.cancel}</button>
            </div>
          </div>
        )}

      </main>

      <Footer t={t} />
    </div>
  );
}

export default App;