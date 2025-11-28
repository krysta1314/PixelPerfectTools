

export interface ComparisonImage {
  before: string;
  after: string;
  label?: string;
}

export enum AppState {
  LANDING = 'LANDING',
  PREVIEW = 'PREVIEW',
  PROCESSING = 'PROCESSING',
  RESULT = 'RESULT',
  ERROR = 'ERROR'
}

export interface FaqItem {
  question: string;
  answer: string;
}

export type Theme = 'light' | 'dark';

export type LanguageCode = 'en' | 'zh-CN' | 'zh-TW' | 'es' | 'pt' | 'hi' | 'ja' | 'ko' | 'fr' | 'de' | 'ru' | 'ar';

export interface Translations {
  heroTitle: string;
  heroSubtitle: string;
  heroDesc: string;
  uploadBtn: string;
  supportedFormats: string;
  demoLabel: string;
  featuresTitle: string;
  featuresDesc: string;
  feature1Title: string;
  feature1Desc: string;
  feature2Title: string;
  feature2Desc: string;
  feature3Title: string;
  feature3Desc: string;
  useCasesTitle: string;
  useCasesDesc: string;
  footerDesc: string;
  product: string;
  support: string;
  contactUs: string;
  legal: string;
  processingTitle: string;
  processingDesc: string;
  previewTitle: string;
  cancel: string;
  upscaleBtn: string;
  successTitle: string;
  successDesc: string;
  newImageBtn: string;
  downloadBtn: string;
  generateBtn: string;
  resLabel: string;
  formatLabel: string;
  modelLabel: string;
  login: string;
  scaleLabel: string;
  loginTitle: string;
  loginDesc: string;
  loginAction: string;
  subTitle: string;
  subDesc: string;
  subAction: string;
  freeQuota: string;
  credits: string;
  // Features Misc
  premiumFeatures: string;
  privacyTitle: string;
  privacyDesc: string;
  privacyItem1: string;
  privacyItem2: string;
  // Use Cases
  versatileApps: string;
  useCase1: string;
  useCase2: string;
  useCase3: string;
  useCase4: string;
  useCase5: string;
  useCase6: string;
  proResultsTitle: string;
  proResultsDesc: string;
  // FAQ Keys
  faqTitle: string;
  faqQ1: string; faqA1: string;
  faqQ2: string; faqA2: string;
  faqQ3: string; faqA3: string;
  faqQ4: string; faqA4: string;
  faqQ5: string; faqA5: string;
  faqQ6: string; faqA6: string;
  faqQ7: string; faqA7: string;
}