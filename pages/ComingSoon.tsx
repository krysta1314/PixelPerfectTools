import React from 'react';

interface ComingSoonPageProps {
    title: string;
    description: string;
    icon: string;
    gradient: string;
    t: any;
}

export function ComingSoonPage({ title, description, icon, gradient, t }: ComingSoonPageProps) {
    return (
        <div className="min-h-[calc(100vh-200px)] pt-20 pb-20 flex items-center justify-center">
            <div className="max-w-2xl mx-auto px-4 text-center">
                <div className={`w-32 h-32 mx-auto mb-8 rounded-3xl bg-gradient-to-br ${gradient} flex items-center justify-center text-6xl shadow-2xl animate-float`}>
                    {icon}
                </div>

                <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6">
                    {title}
                </h1>

                <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                    {description}
                </p>

                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/50 dark:bg-white/5 border border-white/20 dark:border-white/10 text-slate-900 dark:text-white text-sm font-semibold backdrop-blur-md shadow-lg">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                    </span>
                    {t.comingSoonTitle}
                </div>

                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                    <div className="bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white/30 dark:border-white/10 rounded-2xl p-6">
                        <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400">
                                <path d="M12 2v20M2 12h20" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{t.comingSoonFeature1}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            {t.comingSoonFeature1Desc}
                        </p>
                    </div>

                    <div className="bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white/30 dark:border-white/10 rounded-2xl p-6">
                        <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-400">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{t.comingSoonFeature2}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            {t.comingSoonFeature2Desc}
                        </p>
                    </div>

                    <div className="bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white/30 dark:border-white/10 rounded-2xl p-6">
                        <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600 dark:text-purple-400">
                                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{t.comingSoonFeature3}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            {t.comingSoonFeature3Desc}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// 各个工具页面 - 需要从 App.tsx 传入 t
interface ToolPageProps {
    t: any;
}

export function BackgroundRemover({ t }: ToolPageProps) {
    return (
        <ComingSoonPage
            title={t.imageRemover}
            description={t.removerDesc}
            icon="✂️"
            gradient="from-green-500 to-teal-600"
            t={t}
        />
    );
}

export function ImageExtender({ t }: ToolPageProps) {
    return (
        <ComingSoonPage
            title={t.imageExtender}
            description={t.extenderDesc}
            icon="🖼️"
            gradient="from-orange-500 to-red-600"
            t={t}
        />
    );
}

export function VideoEnhancer({ t }: ToolPageProps) {
    return (
        <ComingSoonPage
            title={t.videoEnhancer}
            description={t.videoEnhancerDesc}
            icon="🎬"
            gradient="from-pink-500 to-rose-600"
            t={t}
        />
    );
}

export function CartoonGenerator({ t }: ToolPageProps) {
    return (
        <ComingSoonPage
            title={t.cartoonGenerator}
            description={t.cartoonDesc}
            icon="🎨"
            gradient="from-indigo-500 to-purple-600"
            t={t}
        />
    );
}
