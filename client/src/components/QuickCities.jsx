import { useLanguage } from '../context/LanguageContext';

export default function QuickCities({ onSelect, loading }) {
  const { t } = useLanguage();

  const cities = ['London', 'Mumbai', 'New York', 'Tokyo', 'Paris', 'Sydney', 'Dubai', 'Berlin'];

  return (
    <div className="saas-card">
      <h3 className="mb-3 text-sm font-medium text-slate-500">{t('popularCities')}</h3>
      <div className="flex flex-wrap gap-2">
        {cities.map((city) => (
          <button
            key={city}
            onClick={() => onSelect(city)}
            disabled={loading}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 transition-all hover:border-sky/30 hover:bg-sky/5 disabled:opacity-50"
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  );
}
