import React from 'react';
import { Translations } from '../types';
import { BrandLogo } from './Icons';

export const Footer: React.FC<{ t: Translations }> = ({ t }) => {
  return (
    <footer className="bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 py-12 px-4 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8">
        <div className="col-span-1 md:col-span-2">
          <h3 className="text-slate-900 dark:text-white text-lg font-bold mb-4 flex items-center gap-2">
            <BrandLogo className="w-8 h-8" />
            PixelPerfect <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">AI</span>
          </h3>
          <p className="max-w-xs text-sm leading-relaxed">
            {t.footerDesc}
          </p>
        </div>
        
        <div>
          <h4 className="text-slate-900 dark:text-white font-semibold mb-4">{t.product}</h4>
          <ul className="space-y-2 text-sm hidden">
            <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Features</a></li>
            <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Pricing</a></li>
            <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">API</a></li>
            <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Showcase</a></li>
          </ul>
        </div>

        <div>
           <h4 className="text-slate-900 dark:text-white font-semibold mb-4">{t.support}</h4>
           <ul className="space-y-2 text-sm">
             <li><a href="mailto:zhouyuanyuan@yshenglife.cn" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">{t.contactUs}</a></li>
           </ul>
        </div>

        <div>
          <h4 className="text-slate-900 dark:text-white font-semibold mb-4">{t.legal}</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Privacy Policy</a></li>
            <li><a href="" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Terms of Service</a></li>
            <li className="hidden"><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Cookie Policy</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-slate-200 dark:border-slate-900 text-center text-xs text-slate-300 dark:text-slate-400">
        © {new Date().getFullYear()} PixelPerfect AI. All rights reserved.
      </div>
    </footer>
  );
};