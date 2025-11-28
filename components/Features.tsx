

import React, { useState } from 'react';
import { SparklesIcon, CheckIcon, DownloadIcon, ChevronRightIcon } from './Icons';
import { Translations } from '../types';

export const Features: React.FC<{ t: Translations }> = ({ t }) => {
  return (
    <section className="py-24 px-4 md:px-8 bg-white dark:bg-[#0B0F19] transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-primary-600 dark:text-primary-400 font-bold tracking-wider uppercase text-sm mb-2 block">{t.premiumFeatures}</span>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">{t.featuresTitle}</h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            {t.featuresDesc}
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Main Feature - Large */}
          <div className="md:col-span-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-8 md:p-12 rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary-500/20 transition-all duration-500"></div>
            
            <div className="relative z-10">
              <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary-500/20 text-white">
                <SparklesIcon className="w-7 h-7" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">{t.feature1Title}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed max-w-md">{t.feature1Desc}</p>
            </div>
            
            {/* Abstract visual decor */}
            <div className="absolute bottom-0 right-0 w-1/3 h-1/2 bg-gradient-to-t from-primary-100 dark:from-slate-800 to-transparent opacity-50 rounded-tl-3xl"></div>
          </div>

          {/* Secondary Feature - Tall */}
          <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl relative overflow-hidden group">
             <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-purple-500/5 to-transparent"></div>
             <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
             </div>
             <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{t.feature2Title}</h3>
             <p className="text-slate-600 dark:text-slate-400">{t.feature2Desc}</p>
          </div>

          {/* Tertiary Feature */}
          <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl hover:border-primary-500/30 transition-colors">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center mb-6">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{t.feature3Title}</h3>
            <p className="text-slate-600 dark:text-slate-400">{t.feature3Desc}</p>
          </div>

          {/* Feature 4 */}
          <div className="md:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 md:p-12 rounded-3xl relative overflow-hidden flex flex-col md:flex-row items-center gap-8">
             <div className="flex-1 z-10">
                <h3 className="text-2xl font-bold mb-4">{t.privacyTitle}</h3>
                <p className="text-slate-300 mb-6">{t.privacyDesc}</p>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-white/10 rounded-lg text-sm border border-white/10">{t.privacyItem1}</span>
                  <span className="px-3 py-1 bg-white/10 rounded-lg text-sm border border-white/10">{t.privacyItem2}</span>
                </div>
             </div>
             <div className="relative w-32 h-32 flex items-center justify-center">
                <div className="absolute inset-0 border-4 border-dashed border-white/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
                <div className="absolute inset-4 border-4 border-white/10 rounded-full"></div>
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-400"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export const UseCases: React.FC<{ t: Translations }> = ({ t }) => {
  const cases = [
    t.useCase1,
    t.useCase2,
    t.useCase3,
    t.useCase4,
    t.useCase5,
    t.useCase6
  ];

  return (
    <section className="py-24 px-4 md:px-8 border-t border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-transparent transition-colors duration-300 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary-200/20 dark:bg-primary-500/5 rounded-full blur-3xl -translate-x-1/2"></div>
      
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1">
          <span className="inline-block py-1 px-3 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 text-xs font-bold uppercase tracking-wide mb-6">
            {t.versatileApps}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">{t.useCasesTitle}</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-10 text-lg leading-relaxed max-w-xl">
            {t.useCasesDesc}
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {cases.map((c, i) => (
              <div key={i} className="flex items-center p-3 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-colors">
                <div className="bg-green-100 dark:bg-green-500/20 p-1.5 rounded-full mr-3 text-green-600 dark:text-green-400 shrink-0">
                  <CheckIcon className="w-4 h-4" />
                </div>
                <span className="text-slate-700 dark:text-slate-300 font-medium">{c}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex-1 w-full max-w-xl lg:max-w-none relative">
           <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-purple-600 opacity-30 blur-2xl rounded-3xl"></div>
           <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/20 dark:border-slate-700">
             <div className="grid grid-cols-2">
               {/* E-commerce: Watch */}
               <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&h=400&q=80" className="w-full aspect-square object-cover hover:scale-110 transition-transform duration-700" alt="E-commerce Product" />
               {/* E-commerce: Sneakers */}
               <img src="https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=400&h=400&q=80" className="w-full aspect-square object-cover hover:scale-110 transition-transform duration-700" alt="E-commerce Sneakers" />
               {/* Beauty: Portrait */}
               <img src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&h=400&q=80" className="w-full aspect-square object-cover hover:scale-110 transition-transform duration-700" alt="Beauty Portrait" />
               {/* Furniture */}
               <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&h=400&q=80" className="w-full aspect-square object-cover hover:scale-110 transition-transform duration-700" alt="Furniture" />
             </div>
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-8 pointer-events-none">
                <div className="text-white">
                  <p className="font-bold text-lg">{t.proResultsTitle}</p>
                  <p className="text-white/80 text-sm">{t.proResultsDesc}</p>
                </div>
             </div>
           </div>
        </div>
      </div>
    </section>
  );
}

export const FAQ: React.FC<{ t: Translations }> = ({ t }) => {
  // Changed from single index to array of indices to support multiple open items
  const [openIndices, setOpenIndices] = useState<number[]>([]);

  const faqs = [
    { q: t.faqQ1, a: t.faqA1 },
    { q: t.faqQ2, a: t.faqA2 },
    { q: t.faqQ3, a: t.faqA3 },
    { q: t.faqQ4, a: t.faqA4 },
    { q: t.faqQ5, a: t.faqA5 },
    { q: t.faqQ6, a: t.faqA6 },
    { q: t.faqQ7, a: t.faqA7 },
  ];

  const toggle = (index: number) => {
    setOpenIndices(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index) 
        : [...prev, index]
    );
  };

  // Structured Data for SEO (JSON-LD)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  return (
    <section className="py-24 px-4 md:px-8 bg-white dark:bg-[#0B0F19] transition-colors duration-300">
      {/* Injecting JSON-LD Schema */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">{t.faqTitle}</h2>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndices.includes(index);
            return (
              <div 
                key={index} 
                className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-all duration-300 hover:border-primary-500/30"
              >
                <button
                  onClick={() => toggle(index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white pr-4 m-0">{faq.q}</h3>
                  <ChevronRightIcon 
                    className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} 
                  />
                </button>
                
                <div 
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <div className="p-6 pt-0 text-gray-600 dark:text-gray-300 leading-relaxed border-t border-slate-200/50 dark:border-slate-800/50 mt-2">
                    {faq.a}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};