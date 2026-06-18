import { useLanguage } from '../context/LanguageContext';

export default function Favorites({ favorites, searchHistory, onSelectCity, onToggleFavorite, onClearHistory }) {
  const { t } = useLanguage();
  const hasFavorites = favorites.length > 0;
  const hasHistory = searchHistory.length > 0;
  if (!hasFavorites && !hasHistory) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {hasFavorites && (
        <div className="saas-card">
          <h3 className="mb-3 font-semibold text-slate-800">{t('favorites')}</h3>
          <div className="flex flex-wrap gap-2">
            {favorites.map((city) => (
              <div key={city} className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 pr-1">
                <button onClick={() => onSelectCity(city)} className="px-3 py-1.5 text-sm text-slate-700 hover:text-sky">{city}</button>
                <button onClick={() => onToggleFavorite(city)} className="rounded-lg p-1 text-slate-400 hover:text-red-500">✕</button>
              </div>
            ))}
          </div>
        </div>
      )}
      {hasHistory && (
        <div className="saas-card">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800">{t('recentSearches')}</h3>
            <button onClick={onClearHistory} className="text-xs text-slate-400 hover:text-slate-600">{t('clear')}</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {searchHistory.map((city) => (
              <button key={city} onClick={() => onSelectCity(city)} className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 hover:border-sky/30">
                {city}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
