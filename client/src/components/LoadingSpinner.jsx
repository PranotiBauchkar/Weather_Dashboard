import { useLanguage } from '../context/LanguageContext';

export default function LoadingSpinner() {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative h-14 w-14">
        <div className="absolute inset-0 rounded-full border-4 border-sky/20" />
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-sky" />
      </div>
      <p className="mt-4 text-sm text-slate-500">{t('loading')}</p>
    </div>
  );
}
