import { useLanguage } from '../context/LanguageContext';
import { getWeatherAdvice } from '../services/weatherService';

export default function WeatherInsights({ weather, uvIndex, airQuality }) {
  const { t } = useLanguage();
  if (!weather) return null;

  const uv = uvIndex?.value ?? 0;
  const advice = getWeatherAdvice(weather, uv);

  return (
    <div className="saas-card">
      <h3 className="mb-4 text-lg font-semibold text-slate-800">{t('todaysInsights')}</h3>
      <div className="space-y-3">
        {advice.map((item, i) => (
          <div key={i} className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
            <span className="text-2xl shrink-0">{item.icon}</span>
            <p className="text-sm text-slate-600">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
