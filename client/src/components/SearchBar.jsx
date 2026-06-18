import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { searchGeocode } from '../utils/weatherUtils';

export default function SearchBar({ onSearch, onDetectLocation, loading }) {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const fetchSuggestions = useCallback(async (value) => {
    if (value.length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const results = await searchGeocode(value);
      setSuggestions(results.slice(0, 8));
    } catch {
      setSuggestions([]);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => fetchSuggestions(query), 300);
    return () => clearTimeout(timer);
  }, [query, fetchSuggestions]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (query.trim()) onSearch(query.trim());
  };

  const selectCity = (item) => {
    setQuery(item.label);
    setShowSuggestions(false);
    onSearch(item.label);
  };

  return (
    <div className="glass-card p-4 sm:p-5">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 250)}
            placeholder={t('searchPlaceholder')}
            className="input-field pl-10"
            disabled={loading}
          />

          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute left-0 right-0 top-full z-50 mt-1 max-h-64 overflow-y-auto rounded-xl border border-white/20 bg-gray-900/95 shadow-xl backdrop-blur-md">
              {suggestions.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onMouseDown={() => selectCity(item)}
                    className="w-full px-4 py-3 text-left transition-colors hover:bg-white/10"
                  >
                    <span className="font-medium">{item.name}</span>
                    {item.state && (
                      <span className="ml-1 text-blue-300">, {item.state}</span>
                    )}
                    <span className="text-white/40">, {item.country}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex gap-2">
          <button type="submit" className="btn-primary flex-1 sm:flex-none" disabled={loading}>
            {t('search')}
          </button>
          <button
            type="button"
            onClick={onDetectLocation}
            className="btn-secondary flex items-center justify-center gap-2"
            disabled={loading}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="hidden sm:inline">{t('myLocation')}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
