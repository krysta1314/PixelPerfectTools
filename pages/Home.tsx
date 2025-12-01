import React from 'react';
import { Link } from 'react-router-dom';
import { SparklesIcon } from '../components/Icons';

interface HomeProps {
  t: any;
}

export function Home({ t }: HomeProps) {
  const tools = [
    {
      title: t.imageUpscaler,
      description: t.upscalerDesc,
      icon: '🔍',
      path: '/image-upscaler',
      available: true,
      gradient: 'from-blue-500 to-purple-600'
    },
    {
      title: t.imageRemover,
      description: t.removerDesc,
      icon: '✂️',
      path: '/background-remover',
      available: true,
      gradient: 'from-green-500 to-teal-600'
    },
    {
      title: t.imageExtender,
      description: t.extenderDesc,
      icon: '🖼️',
      path: '/image-extender',
      available: true,
      gradient: 'from-orange-500 to-red-600'
    },
    {
      title: t.videoEnhancer,
      description: t.videoEnhancerDesc,
      icon: '🎬',
      path: '/video-enhancer',
      available: true,
      gradient: 'from-pink-500 to-rose-600'
    },
    {
      title: t.cartoonGenerator,
      description: t.cartoonDesc,
      icon: '🎨',
      path: '/cartoon-generator',
      available: true,
      gradient: 'from-indigo-500 to-purple-600'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-100/40 via-transparent to-transparent dark:from-primary-900/20 pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 mb-8 backdrop-blur-sm animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">New: Gemini 2.5 Flash Model</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6 leading-[1.1]">
            PixelPerfect <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-purple-600 to-blue-600 dark:from-primary-300 dark:via-purple-300 dark:to-blue-300 animate-gradient-x">AI</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
            {t.homeDesc}
          </p>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="max-w-7xl mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, index) => (
            <Link
              key={index}
              to={tool.path}
              className="group relative block h-full"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-purple-500/5 rounded-3xl transform group-hover:scale-105 transition-transform duration-300"></div>

              <div className="relative h-full bg-white dark:bg-[#151b2b] border border-slate-200 dark:border-white/5 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                <div className={`w-14 h-14 mb-6 rounded-2xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {tool.icon}
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-primary-500 transition-colors">
                  {tool.title}
                </h3>

                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                  {tool.description}
                </p>

                <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-semibold text-sm">
                  <span>{t.tryNow}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 mt-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
            {t.whyChooseTitle}
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {t.whyChooseDesc}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-xl">
              <SparklesIcon className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{t.aiPowered}</h3>
            <p className="text-slate-600 dark:text-slate-400">
              {t.aiPoweredDesc}
            </p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center shadow-xl">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M2 12h20" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{t.easyToUse}</h3>
            <p className="text-slate-600 dark:text-slate-400">
              {t.easyToUseDesc}
            </p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-xl">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{t.secureReliable}</h3>
            <p className="text-slate-600 dark:text-slate-400">
              {t.secureReliableDesc}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
