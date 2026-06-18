import { useLanguage } from '../context/LanguageContext';
import { getWindDirection } from '../services/weatherService';

export default function WindCompass({ speed, deg, gust }) {
  const { t } = useLanguage();
  if (speed == null) return null;

  const direction = getWindDirection(deg || 0);

  return (
    <div className="saas-card flex h-full flex-col items-center">
      <h3 className="mb-4 self-start text-lg font-semibold text-slate-800">{t('wind')}</h3>
      <div className="relative flex h-28 w-28 items-center justify-center">
        <div className="absolute inset-0 rounded-full border-2 border-slate-200" />
        <div className="absolute flex flex-col items-center transition-transform duration-500" style={{ transform: `rotate(${deg || 0}deg)` }}>
          <div className="h-8 w-0.5 bg-gradient-to-t from-transparent to-sky" />
          <div className="h-0 w-0 border-x-[5px] border-b-[10px] border-x-transparent border-b-sky" />
        </div>
        <div className="relative z-10 text-center">
          <p className="text-2xl font-bold text-slate-800">{speed}</p>
          <p className="text-xs text-slate-400">m/s</p>
        </div>
      </div>
      <p className="mt-4 text-sm text-slate-500">
        {t('direction')}: <strong className="text-slate-700">{direction}</strong> ({deg}°)
        {gust != null && <> · {t('gust')}: <strong>{gust}</strong></>}
      </p>
    </div>
  );
}
