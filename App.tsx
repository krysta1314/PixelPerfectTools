import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Theme, LanguageCode } from './types';
import { BrandLogo, SunIcon, MoonIcon, GlobeIcon, CheckIcon } from './components/Icons';
import { getDictionary, LANGUAGES } from './lib/translations';
import { Footer } from './components/Footer';

// Pages
import { Home } from './pages/Home';
import { ImageUpscaler } from './pages/ImageUpscaler';
import { BackgroundRemover } from './pages/BackgroundRemover';
import { ImageExtender } from './pages/ImageExtender';
import { VideoEnhancer } from './pages/VideoEnhancer';
import { CartoonGenerator } from './pages/CartoonGenerator';

// ... (keep existing imports)



function AppContent() {
  // Settings State
  const [theme, setTheme] = useState<Theme>('dark');
  const [lang, setLang] = useState<LanguageCode>('en');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  // Business Logic State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [freeChances, setFreeChances] = useState(3);
  const [credits, setCredits] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSubModal, setShowSubModal] = useState(false);
  const [lastReset, setLastReset] = useState(Date.now());

  // Tools Menu State
  const [isToolsMenuOpen, setIsToolsMenuOpen] = useState(false);
  const toolsMenuRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

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

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setShowLoginModal(false);
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen flex flex-col font-sans selection:bg-primary-500 selection:text-white transition-colors duration-300 relative bg-gray-50 dark:bg-[#0B0F19]">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-primary-400/20 dark:bg-primary-500/10 rounded-[100%] blur-[120px] pointer-events-none mix-blend-multiply dark:mix-blend-screen opacity-50 dark:opacity-40 animate-pulse z-0"></div>

      <header className="fixed top-6 left-1/2 -translate-x-1/2 w-[calc(100%-60px)] max-w-[1430px] z-50 transition-all duration-300">
        <div className="backdrop-blur-xl bg-white/40 dark:bg-black/40 border border-white/20 dark:border-white/10 shadow-lg shadow-black/5 rounded-full px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={handleLogoClick}>
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
                  <div className="bg-white dark:bg-[#151b2b] border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl py-2 overflow-hidden">
                    <Link to="/" onClick={() => setIsToolsMenuOpen(false)} className="block px-4 py-3 text-sm font-bold text-slate-900 dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                      {t.allTools}
                    </Link>
                    <div className="h-px bg-slate-200 dark:bg-white/10 my-1"></div>

                    <Link to="/image-upscaler" onClick={() => setIsToolsMenuOpen(false)} className="block px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center justify-between group">
                      <span>{t.imageUpscaler}</span>
                      <CheckIcon className="w-4 h-4 text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>

                    <Link to="/background-remover" onClick={() => setIsToolsMenuOpen(false)} className="block px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center justify-between group">
                      <span>{t.imageRemover}</span>
                    </Link>

                    <Link to="/image-extender" onClick={() => setIsToolsMenuOpen(false)} className="block px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center justify-between group">
                      <span>{t.imageExtender}</span>
                    </Link>

                    <Link to="/video-enhancer" onClick={() => setIsToolsMenuOpen(false)} className="block px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center justify-between group">
                      <span>{t.videoEnhancer}</span>
                    </Link>

                    <Link to="/cartoon-generator" onClick={() => setIsToolsMenuOpen(false)} className="block px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center justify-between group">
                      <span>{t.cartoonGenerator}</span>
                    </Link>
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
        <Routes>
          <Route path="/" element={<Home t={t} />} />
          <Route
            path="/image-upscaler"
            element={
              <ImageUpscaler
                t={t}
                isLoggedIn={isLoggedIn}
                freeChances={freeChances}
                credits={credits}
                setFreeChances={setFreeChances}
                setCredits={setCredits}
                setShowLoginModal={setShowLoginModal}
                setShowSubModal={setShowSubModal}
              />
            }
          />
          <Route path="/background-remover" element={<BackgroundRemover t={t} />} />
          <Route path="/image-extender" element={<ImageExtender t={t} />} />
          <Route path="/video-enhancer" element={<VideoEnhancer t={t} />} />
          <Route path="/cartoon-generator" element={<CartoonGenerator t={t} />} />
        </Routes>
      </main>

      <Footer t={t} />

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
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t.subTitle}</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">{t.subDesc}</p>
            <button onClick={() => setShowSubModal(false)} className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-500/20">{t.subAction}</button>
            <button onClick={() => setShowSubModal(false)} className="mt-4 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">{t.cancel}</button>
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;